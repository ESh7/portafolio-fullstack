import { type NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const taskId = Number(id);

	if (!Number.isInteger(taskId) || taskId <= 0) {
		return NextResponse.json(
			{ error: "El id de la tarea no es válido." },
			{ status: 400 },
		);
	}

	try {
		await prisma.tarea.delete({ where: { id: taskId } });

		return NextResponse.json({ message: "Tarea eliminada." }, { status: 200 });
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			return NextResponse.json(
				{ error: "La tarea no existe." },
				{ status: 404 },
			);
		}

		console.error("Error al eliminar tarea:", error);

		return NextResponse.json(
			{ error: "No se pudo eliminar la tarea." },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const taskId = Number(id);

	if (!Number.isInteger(taskId) || taskId <= 0) {
		return NextResponse.json(
			{ error: "El id de la tarea no es válido." },
			{ status: 400 },
		);
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "El cuerpo de la solicitud debe ser un JSON válido." },
			{ status: 400 },
		);
	}

	if (typeof body !== "object" || body === null) {
		return NextResponse.json(
			{ error: "El cuerpo de la solicitud debe ser un objeto JSON." },
			{ status: 400 },
		);
	}

	const { status } = body as { status?: unknown };

	if (status !== "pending" && status !== "completed") {
		return NextResponse.json(
			{ error: "El campo 'status' debe ser 'pending' o 'completed'." },
			{ status: 400 },
		);
	}

	try {
		const tarea = await prisma.tarea.update({
			where: { id: taskId },
			data: { status },
		});
		return NextResponse.json(tarea, { status: 200 });
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			return NextResponse.json(
				{ error: "La tarea no existe." },
				{ status: 404 },
			);
		}
		console.error("Error al actualizar tarea:", error);
		return NextResponse.json(
			{ error: "No se pudo actualizar la tarea." },
			{ status: 500 },
		);
	}
}
