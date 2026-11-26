import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { createMock, findManyMock } = vi.hoisted(() => ({
	createMock: vi.fn(),
	findManyMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
	prisma: {
		tarea: {
			create: createMock,
			findMany: findManyMock,
		},
	},
}));

import { GET, POST } from "./route";

describe("POST /api/tareas", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("rechaza título vacío con 400", async () => {
		const request = new NextRequest("http://localhost/api/tareas", {
			method: "POST",
			body: JSON.stringify({ title: "   ", description: "desc" }),
			headers: { "Content-Type": "application/json" },
		});

		const response = await POST(request);
		const body = await response.json();

		expect(response.status).toBe(400);
		expect(body.error).toMatch(/title/i);
		expect(createMock).not.toHaveBeenCalled();
	});

	it("crea tarea válida con 201 (CA-1.1)", async () => {
		createMock.mockResolvedValue({
			id: 1,
			title: "Mi tarea",
			description: null,
			status: "pending",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		const request = new NextRequest("http://localhost/api/tareas", {
			method: "POST",
			body: JSON.stringify({ title: "  Mi tarea  ", description: "  " }),
			headers: { "Content-Type": "application/json" },
		});

		const response = await POST(request);
		const body = await response.json();

		expect(response.status).toBe(201);
		expect(body.status).toBe("pending");
		expect(body.id).toBe(1);
		expect(createMock).toHaveBeenCalledWith({
			data: { title: "Mi tarea", description: null },
		});
	});
});

describe("GET /api/tareas", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("devuelve lista con 200", async () => {
		findManyMock.mockResolvedValue([]);
		const request = new NextRequest("http://localhost/api/tareas");
		const response = await GET(request);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual([]);
	});

	it("rechaza filtro inválido con 400", async () => {
		const request = new NextRequest("http://localhost/api/tareas?status=bad");
		const response = await GET(request);
		expect(response.status).toBe(400);
	});

	it("filtra por status pending (CA-2.2)", async () => {
		findManyMock.mockResolvedValue([]);
		const request = new NextRequest("http://localhost/api/tareas?status=pending");
		const response = await GET(request);
		expect(response.status).toBe(200);
		expect(findManyMock).toHaveBeenCalledWith({
			where: { status: "pending" },
			orderBy: { createdAt: "desc" },
		});
	});
});
