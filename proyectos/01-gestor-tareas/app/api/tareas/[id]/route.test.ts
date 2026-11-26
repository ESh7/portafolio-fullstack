import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateMock, deleteMock } = vi.hoisted(() => ({
	updateMock: vi.fn(),
	deleteMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
	prisma: {
		tarea: {
			update: updateMock,
			delete: deleteMock,
		},
	},
}));

vi.mock("@/app/generated/prisma/client", () => {
	class PrismaClientKnownRequestError extends Error {
		code: string;
		constructor(
			message: string,
			{ code }: { code: string; clientVersion?: string },
		) {
			super(message);
			this.code = code;
		}
	}
	return { Prisma: { PrismaClientKnownRequestError } };
});

import { Prisma } from "@/app/generated/prisma/client";
import { DELETE, PATCH } from "./route";

function req(url: string, method: string, body?: unknown) {
	return new NextRequest(url, {
		method,
		body: body ? JSON.stringify(body) : undefined,
		headers: { "Content-Type": "application/json" },
	});
}

describe("PATCH /api/tareas/[id]", () => {
	beforeEach(() => vi.clearAllMocks());

	it("actualiza status a completed con 200 (CA-4.1)", async () => {
		updateMock.mockResolvedValue({
			id: 1,
			title: "T",
			description: null,
			status: "completed",
			createdAt: "",
			updatedAt: "",
		});
		const res = await PATCH(
			req("http://localhost/api/tareas/1", "PATCH", { status: "completed" }),
			{ params: Promise.resolve({ id: "1" }) },
		);
		expect(res.status).toBe(200);
		expect(updateMock).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { status: "completed" },
		});
	});

	it("actualiza status a pending con 200 (CA-4.2)", async () => {
		updateMock.mockResolvedValue({
			id: 1,
			title: "T",
			description: null,
			status: "pending",
			createdAt: "",
			updatedAt: "",
		});
		const res = await PATCH(
			req("http://localhost/api/tareas/1", "PATCH", { status: "pending" }),
			{ params: Promise.resolve({ id: "1" }) },
		);
		expect(res.status).toBe(200);
		expect(updateMock).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { status: "pending" },
		});
	});

	it("edita título y descripción con 200 (CA-3.1)", async () => {
		updateMock.mockResolvedValue({
			id: 1,
			title: "Nuevo",
			description: "Desc",
			status: "pending",
			createdAt: "",
			updatedAt: "",
		});
		const res = await PATCH(
			req("http://localhost/api/tareas/1", "PATCH", {
				title: "Nuevo",
				description: "Desc",
			}),
			{ params: Promise.resolve({ id: "1" }) },
		);
		expect(res.status).toBe(200);
		expect(updateMock).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { title: "Nuevo", description: "Desc" },
		});
	});

	it("rechaza status inválido con 400", async () => {
		const res = await PATCH(
			req("http://localhost/api/tareas/1", "PATCH", { status: "bad" }),
			{ params: Promise.resolve({ id: "1" }) },
		);
		expect(res.status).toBe(400);
		expect(updateMock).not.toHaveBeenCalled();
	});

	it("rechaza título vacío en edición con 400", async () => {
		const res = await PATCH(
			req("http://localhost/api/tareas/1", "PATCH", { title: "   " }),
			{ params: Promise.resolve({ id: "1" }) },
		);
		expect(res.status).toBe(400);
		expect(updateMock).not.toHaveBeenCalled();
	});

	it("devuelve 404 si la tarea no existe", async () => {
		updateMock.mockRejectedValue(
			new Prisma.PrismaClientKnownRequestError("not found", {
				code: "P2025",
				clientVersion: "test",
			}),
		);
		const res = await PATCH(
			req("http://localhost/api/tareas/99", "PATCH", { status: "completed" }),
			{ params: Promise.resolve({ id: "99" }) },
		);
		expect(res.status).toBe(404);
	});
});

describe("DELETE /api/tareas/[id]", () => {
	beforeEach(() => vi.clearAllMocks());

	it("elimina con 200", async () => {
		deleteMock.mockResolvedValue({ id: 1 });
		const res = await DELETE(req("http://localhost/api/tareas/1", "DELETE"), {
			params: Promise.resolve({ id: "1" }),
		});
		expect(res.status).toBe(200);
	});

	it("devuelve 404 si no existe", async () => {
		deleteMock.mockRejectedValue(
			new Prisma.PrismaClientKnownRequestError("not found", {
				code: "P2025",
				clientVersion: "test",
			}),
		);
		const res = await DELETE(req("http://localhost/api/tareas/99", "DELETE"), {
			params: Promise.resolve({ id: "99" }),
		});
		expect(res.status).toBe(404);
	});
});
