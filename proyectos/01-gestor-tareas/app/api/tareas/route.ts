import { type NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
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

	const { title, description } = body as {
		title?: unknown;
		description?: unknown;
	};

	if (typeof title !== "string") {
		return NextResponse.json(
			{ error: "El campo 'title' es obligatorio y debe ser un texto." },
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

	const descriptionResult = normalizeDescription(description);

	if (!descriptionResult.ok) {
		return NextResponse.json(
			{ error: descriptionResult.error },
			{ status: 400 },
		);
	}

	try {
		const tarea = await prisma.tarea.create({
			data: {
				title: normalizedTitle,
				description: descriptionResult.value,
			},
		});

		return NextResponse.json(tarea, { status: 201 });
	} catch (error) {
		console.error("Error al crear tarea:", error);
		return NextResponse.json(
			{ error: "No se pudo crear la tarea en la base de datos." },
			{ status: 500 },
		);
	}
}
export async function GET(request: NextRequest) {
	const status = request.nextUrl.searchParams.get("status");
	// 1) Si status viene y NO es "pending" ni "completed", responde 400
	if (status && status !== "pending" && status !== "completed") {
		return NextResponse.json(
			{ error: "El parámetro 'status' debe ser 'pending' o 'completed'." },
			{ status: 400 },
		);
	}

	try {
		const tareas = await prisma.tarea.findMany({
			orderBy: { createdAt: "desc" },
			where: {
				status:
					status === "pending" || status === "completed" ? status : undefined,
			},
		});

		return NextResponse.json(tareas, { status: 200 });
	} catch (error) {
		console.error("Error al obtener tareas:", error);
		return NextResponse.json(
			{ error: "No se pudieron obtener las tareas de la base de datos." },
			{ status: 500 },
		);
	}
}
