import { type NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;

function normalizeDescription(
	value: unknown,
): { ok: true; value: string | null } | { ok: false; error: string } {
	if (value === undefined || value === null) {
		return { ok: true, value: null };
	}

	if (typeof value !== "string") {
		return {
			ok: false,
			error: "El campo 'description' debe ser un texto.",
		};
	}

	const trimmed = value.trim();

	if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
		return {
			ok: false,
			error: `El campo 'description' no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres.`,
		};
	}

	return {
		ok: true,
		value: trimmed.length > 0 ? trimmed : null,
	};
}

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

	if (typeof body !== "object" || body === null || Array.isArray(body)) {
		return NextResponse.json(
			{ error: "El cuerpo de la solicitud debe ser un objeto JSON." },
			{ status: 400 },
		);
	}

	const { title, description, status } = body as {
		title?: unknown;
		description?: unknown;
		status?: unknown;
	};

	const data: {
		title?: string;
		description?: string | null;
		status?: "pending" | "completed";
	} = {};

	if (title !== undefined) {
		if (typeof title !== "string") {
			return NextResponse.json(
				{ error: "El campo 'title' debe ser un texto." },
				{ status: 400 },
			);
		}

		const normalizedTitle = title.trim();
		if (normalizedTitle.length === 0) {
			return NextResponse.json(
				{ error: "El campo 'title' no puede estar vacío." },
				{ status: 400 },
			);
		}

		if (normalizedTitle.length > MAX_TITLE_LENGTH) {
			return NextResponse.json(
				{
					error: `El campo 'title' no puede superar los ${MAX_TITLE_LENGTH} caracteres.`,
				},
				{ status: 400 },
			);
		}

		data.title = normalizedTitle;
	}

	if (description !== undefined) {
		const descriptionResult = normalizeDescription(description);
		if (!descriptionResult.ok) {
			return NextResponse.json(
				{ error: descriptionResult.error },
				{ status: 400 },
			);
		}
		data.description = descriptionResult.value;
	}

	if (status !== undefined) {
		if (status !== "pending" && status !== "completed") {
			return NextResponse.json(
				{ error: "El campo 'status' debe ser 'pending' o 'completed'." },
				{ status: 400 },
			);
		}
		data.status = status;
	}

	if (Object.keys(data).length === 0) {
		return NextResponse.json(
			{ error: "Debes enviar al menos un campo para actualizar." },
			{ status: 400 },
		);
	}

	try {
		const tarea = await prisma.tarea.update({
			where: { id: taskId },
			data,
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
