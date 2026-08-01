import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";

const request = supertest(app);

let authCookie: string;
let projectId: string;
let taskId: string;

const testUser = {
  name: "Test User",
  email: `test_${Date.now()}@example.com`,
  password: "Test1234!",
};

beforeAll(async () => {
  // Clean up any leftover test data
  await prisma.user.deleteMany({ where: { email: testUser.email } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

describe("Auth API", () => {
  it("POST /api/auth/register — should create a new user", async () => {
    const res = await request.post("/api/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it("POST /api/auth/register — should reject duplicate email", async () => {
    const res = await request.post("/api/auth/register").send(testUser);
    expect(res.status).toBe(409);
  });

  it("POST /api/auth/register — should reject invalid email", async () => {
    const res = await request
      .post("/api/auth/register")
      .send({ ...testUser, email: "not-an-email" });
    expect(res.status).toBe(422);
  });

  it("POST /api/auth/login — should fail with wrong password", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "WrongPass99!" });
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/login — should succeed and set cookie", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
    const cookie = res.headers["set-cookie"];
    expect(cookie).toBeDefined();
    authCookie = Array.isArray(cookie) ? cookie[0] : cookie;
  });

  it("GET /api/auth/me — should return current user when authenticated", async () => {
    const res = await request
      .get("/api/auth/me")
      .set("Cookie", authCookie);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it("GET /api/auth/me — should return 401 without cookie", async () => {
    const res = await request.get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("Projects API", () => {
  it("POST /api/projects — should create a project", async () => {
    const res = await request
      .post("/api/projects")
      .set("Cookie", authCookie)
      .send({ name: "Test Project", description: "A test project" });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Test Project");
    projectId = res.body.data.id;
  });

  it("GET /api/projects — should return accessible projects", async () => {
    const res = await request
      .get("/api/projects")
      .set("Cookie", authCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe("Tasks API", () => {
  it("POST /api/projects/:projectId/tasks — should create a task", async () => {
    const res = await request
      .post(`/api/projects/${projectId}/tasks`)
      .set("Cookie", authCookie)
      .send({ title: "Test Task", priority: "HIGH", status: "TODO" });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Test Task");
    taskId = res.body.data.id;
  });

  it("GET /api/projects/:projectId/tasks — should list tasks", async () => {
    const res = await request
      .get(`/api/projects/${projectId}/tasks`)
      .set("Cookie", authCookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("GET /api/projects/:projectId/tasks — should filter by status", async () => {
    const res = await request
      .get(`/api/projects/${projectId}/tasks?status=TODO`)
      .set("Cookie", authCookie);
    expect(res.status).toBe(200);
    res.body.data.forEach((t: any) => expect(t.status).toBe("TODO"));
  });

  it("PUT /api/projects/:projectId/tasks/:taskId — should update task status", async () => {
    const res = await request
      .put(`/api/projects/${projectId}/tasks/${taskId}`)
      .set("Cookie", authCookie)
      .send({ status: "IN_PROGRESS" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("IN_PROGRESS");
  });

  it("DELETE /api/projects/:projectId/tasks/:taskId — should delete a task", async () => {
    const res = await request
      .delete(`/api/projects/${projectId}/tasks/${taskId}`)
      .set("Cookie", authCookie);
    expect(res.status).toBe(200);
  });

  it("DELETE /api/projects/:projectId/tasks/:taskId — should return 404 for deleted task", async () => {
    const res = await request
      .get(`/api/projects/${projectId}/tasks/${taskId}`)
      .set("Cookie", authCookie);
    expect(res.status).toBe(404);
  });

  it("POST /api/projects/:projectId/tasks — unauthenticated should return 401", async () => {
    const res = await request
      .post(`/api/projects/${projectId}/tasks`)
      .send({ title: "Unauthorized task" });
    expect(res.status).toBe(401);
  });
});
