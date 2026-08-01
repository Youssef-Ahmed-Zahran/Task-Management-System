import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  const memberPassword = await bcrypt.hash("Member1234!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@task.dev" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@task.dev",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "member@task.dev" },
    update: {},
    create: {
      name: "Member User",
      email: "member@task.dev",
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  const project = await prisma.project.upsert({
    where: { id: "seed-project-001" },
    update: {},
    create: {
      id: "seed-project-001",
      name: "Demo Project",
      description: "A sample project seeded for testing purposes.",
      ownerId: admin.id,
    },
  });

  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: member.id } },
    update: {},
    create: { projectId: project.id, userId: member.id },
  });

  await prisma.task.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "seed-task-001",
        projectId: project.id,
        title: "Setup project repository",
        description: "Initialize the git repo and project structure.",
        status: "DONE",
        priority: "HIGH",
        creatorId: admin.id,
        assigneeId: admin.id,
      },
      {
        id: "seed-task-002",
        projectId: project.id,
        title: "Design database schema",
        description: "Create the Prisma schema with all required models.",
        status: "DONE",
        priority: "HIGH",
        creatorId: admin.id,
        assigneeId: member.id,
      },
      {
        id: "seed-task-003",
        projectId: project.id,
        title: "Build authentication API",
        description: "Implement register, login, logout endpoints with JWT.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        creatorId: admin.id,
        assigneeId: member.id,
      },
      {
        id: "seed-task-004",
        projectId: project.id,
        title: "Build task board UI",
        description: "Create the Kanban board with drag-and-drop support.",
        status: "TODO",
        priority: "MEDIUM",
        creatorId: admin.id,
      },
      {
        id: "seed-task-005",
        projectId: project.id,
        title: "Write API tests",
        description: "Cover auth and task CRUD with at least 5 test cases.",
        status: "TODO",
        priority: "LOW",
        creatorId: admin.id,
      },
    ],
  });

  console.log("✅ Seed complete!");
  console.log(`   Admin: admin@task.dev / Admin1234!`);
  console.log(`   Member: member@task.dev / Member1234!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
