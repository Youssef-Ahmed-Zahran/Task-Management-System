import { prisma } from "../../../lib/prisma.js";
import { ApiError } from "../../../utils/ApiError.js";
import type { CreateProjectInput, UpdateProjectInput } from "../schema/projects.schema.js";

const projectSelect = {
  id: true,
  name: true,
  description: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  owner: { select: { id: true, name: true, email: true } },
  members: {
    select: {
      user: { select: { id: true, name: true, email: true, role: true } },
      joinedAt: true,
    },
  },
  _count: { select: { tasks: true } },
};

export const getAccessibleProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    select: projectSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const getProjectById = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: projectSelect,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const isMember =
    project.ownerId === userId ||
    project.members.some((m) => m.user.id === userId);

  if (!isMember) {
    throw new ApiError(403, "You do not have access to this project.");
  }

  return project;
};

export const createProject = async (data: CreateProjectInput, ownerId: string) => {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId,
    },
    select: projectSelect,
  });
};

export const updateProject = async (
  projectId: string,
  data: UpdateProjectInput,
  userId: string
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (project.ownerId !== userId) {
    throw new ApiError(403, "Only the project owner can update this project.");
  }

  return prisma.project.update({
    where: { id: projectId },
    data,
    select: projectSelect,
  });
};

export const deleteProject = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (project.ownerId !== userId) {
    throw new ApiError(403, "Only the project owner can delete this project.");
  }

  await prisma.project.delete({ where: { id: projectId } });
};

export const addMember = async (
  projectId: string,
  body: { userId?: string; email?: string },
  requesterId: string
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (project.ownerId !== requesterId) {
    throw new ApiError(403, "Only the project owner can add members.");
  }

  // Resolve userId — accept either a direct userId or an email address
  let resolvedUserId = body.userId;
  if (!resolvedUserId && body.email) {
    const found = await prisma.user.findUnique({ where: { email: body.email } });
    if (!found) {
      throw new ApiError(404, `No user found with email: ${body.email}`);
    }
    resolvedUserId = found.id;
  }

  const userToAdd = await prisma.user.findUnique({ where: { id: resolvedUserId } });
  if (!userToAdd) {
    throw new ApiError(404, "User not found.");
  }

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: resolvedUserId! } },
  });
  if (existing) {
    throw new ApiError(409, "User is already a member of this project.");
  }

  return prisma.projectMember.create({
    data: { projectId, userId: resolvedUserId! },
    select: {
      user: { select: { id: true, name: true, email: true } },
      joinedAt: true,
    },
  });
};

export const removeMember = async (
  projectId: string,
  userId: string,
  requesterId: string
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  if (project.ownerId !== requesterId) {
    throw new ApiError(403, "Only the project owner can remove members.");
  }

  if (userId === requesterId) {
    throw new ApiError(400, "Project owner cannot remove themselves.");
  }

  await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  });
};
