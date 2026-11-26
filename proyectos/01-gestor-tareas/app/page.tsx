"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";

type TaskStatus = "pending" | "completed";
type TaskFilter = "all" | "pending" | "completed";

interface Tarea {
	id: number;
	title: string;
	description: string | null;
	status: TaskStatus;
	createdAt: string;
	updatedAt: string;
}

const inputClassName =
	"w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";
const labelClassName = "mb-1 block text-sm font-medium text-foreground";
const primaryButtonClassName =
	"rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButtonClassName =
	"rounded-md border border-foreground/20 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40";
const destructiveButtonClassName =
	"rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40";

function getStatusLabel(status: TaskStatus): string {
	return status === "completed" ? "Completada" : "Pendiente";
}

async function getResponseError(
	response: Response,
	fallback: string,
): Promise<string> {
	try {
		const data: unknown = await response.json();
		if (
			typeof data === "object" &&
			data !== null &&
			"error" in data &&
			typeof data.error === "string"
		) {
			return data.error;
		}
	} catch {
		// Si la respuesta no es JSON válido, usamos el mensaje de respaldo.
	}

	return fallback;
}

export default function HomePage() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [tasks, setTasks] = useState<Tarea[]>([]);
	const [filter, setFilter] = useState<TaskFilter>("all");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const loadTasks = useCallback(async (currentFilter: TaskFilter) => {
		setIsLoading(true);
		const url =
			currentFilter === "all"
				? "/api/tareas"
				: `/api/tareas?status=${currentFilter}`;
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("No se pudieron cargar las tareas.");
			}

			const data: Tarea[] = await response.json();
			setTasks(data);
			setError(null);
			return true;
		} catch (loadError) {
			console.error(loadError);
			setTasks([]);
			setError("No se pudieron cargar las tareas.");
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadTasks(filter);
	}, [filter, loadTasks]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/tareas", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ title, description }),
			});

			if (!response.ok) {
				setError(
					await getResponseError(response, "No se pudo crear la tarea."),
				);
				return;
			}

			const reloaded = await loadTasks(filter);
			if (reloaded) {
				setTitle("");
				setDescription("");
			}
		} catch (submitError) {
			console.error(submitError);
			setError("No se pudo crear la tarea.");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleDelete(id: number) {
		setError(null);

		try {
			const response = await fetch(`/api/tareas/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				setError(
					await getResponseError(response, "No se pudo eliminar la tarea."),
				);
				return;
			}

			setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
		} catch (deleteError) {
			console.error(deleteError);
			setError("No se pudo eliminar la tarea.");
		}
	}

	async function handleToggleStatus(task: Tarea) {
		setError(null);
		const nextStatus: TaskStatus =
			task.status === "pending" ? "completed" : "pending";

		try {
			const response = await fetch(`/api/tareas/${task.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: nextStatus }),
			});

			if (!response.ok) {
				setError(
					await getResponseError(response, "No se pudo actualizar la tarea."),
				);
				return;
			}

			const updatedTask: Tarea = await response.json();
			setTasks((currentTasks) =>
				currentTasks
					.map((currentTask) =>
						currentTask.id === task.id ? updatedTask : currentTask,
					)
					.filter(
						(currentTask) => filter === "all" || currentTask.status === filter,
					),
			);
		} catch (toggleError) {
			console.error(toggleError);
			setError("No se pudo actualizar la tarea.");
		}
	}

	function handleEditStart(task: Tarea) {
		setError(null);
		setEditingId(task.id);
		setEditTitle(task.title);
		setEditDescription(task.description ?? "");
	}

	function handleEditCancel() {
		setEditingId(null);
		setEditTitle("");
		setEditDescription("");
		setError(null);
	}

	async function handleEditSave(id: number) {
		setError(null);

		try {
			const response = await fetch(`/api/tareas/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: editTitle,
					description: editDescription,
				}),
			});

			if (!response.ok) {
				setError(
					await getResponseError(response, "No se pudo actualizar la tarea."),
				);
				return;
			}

			const updatedTask: Tarea = await response.json();
			setTasks((currentTasks) =>
				currentTasks.map((currentTask) =>
					currentTask.id === id ? updatedTask : currentTask,
				),
			);
			setEditingId(null);
			setEditTitle("");
			setEditDescription("");
		} catch (editError) {
			console.error(editError);
			setError("No se pudo actualizar la tarea.");
		}
	}

	const filterOptions: Array<{ value: TaskFilter; label: string }> = [
		{ value: "all", label: "Todas" },
		{ value: "pending", label: "Pendientes" },
		{ value: "completed", label: "Completadas" },
	];

	return (
		<main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-20 sm:px-6">
			<header className="mb-8">
				<p className="text-sm font-medium uppercase tracking-wide text-foreground/60">
					Proyecto 1
				</p>
				<h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					Gestor de Tareas
				</h1>
				<p className="mt-2 text-base text-foreground/70">
					Crea, organiza y da seguimiento a tus tareas.
				</p>
			</header>

			{error ? (
				<p
					role="alert"
					className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
				>
					{error}
				</p>
			) : null}

			<section className="mb-8 rounded-lg border border-foreground/15 bg-background p-5 shadow-sm">
				<h2 className="mb-4 text-xl font-semibold text-foreground">
					Nueva tarea
				</h2>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className={labelClassName} htmlFor="title">
							Título
						</label>
						<input
							id="title"
							name="title"
							type="text"
							className={inputClassName}
							value={title}
							onChange={(event) => setTitle(event.target.value)}
						/>
					</div>

					<div>
						<label className={labelClassName} htmlFor="description">
							Descripción (opcional)
						</label>
						<textarea
							id="description"
							name="description"
							className={inputClassName}
							rows={3}
							value={description}
							onChange={(event) => setDescription(event.target.value)}
						/>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className={primaryButtonClassName}
					>
						{isSubmitting ? "Creando..." : "Crear tarea"}
					</button>
				</form>
			</section>

			<section className="rounded-lg border border-foreground/15 bg-background p-5 shadow-sm">
				<div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-xl font-semibold text-foreground">Mis tareas</h2>
					<fieldset className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0">
						<legend className="sr-only">Filtrar tareas</legend>
						{filterOptions.map((option) => {
							const isActive = filter === option.value;
							return (
								<button
									key={option.value}
									type="button"
									aria-pressed={isActive}
									onClick={() => setFilter(option.value)}
									className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 ${
										isActive
											? "border-foreground bg-foreground text-background"
											: "border-foreground/20 text-foreground hover:bg-foreground/10"
									}`}
								>
									{option.label}
								</button>
							);
						})}
					</fieldset>
				</div>

				{isLoading ? (
					<p className="rounded-md border border-dashed border-foreground/20 px-4 py-8 text-center text-sm text-foreground/70">
						Cargando tareas...
					</p>
				) : tasks.length === 0 ? (
					<p className="rounded-md border border-dashed border-foreground/20 px-4 py-8 text-center text-sm text-foreground/70">
						{filter === "all"
							? "No hay tareas todavía."
							: "No hay tareas para este filtro."}
					</p>
				) : (
					<ul className="space-y-3">
						{tasks.map((task) => {
							const isEditing = editingId === task.id;
							return (
								<li
									key={task.id}
									className="rounded-md border border-foreground/15 p-4"
								>
									{isEditing ? (
										<div className="space-y-4">
											<div>
												<label
													className={labelClassName}
													htmlFor={`edit-title-${task.id}`}
												>
													Título
												</label>
												<input
													id={`edit-title-${task.id}`}
													type="text"
													className={inputClassName}
													value={editTitle}
													onChange={(event) => setEditTitle(event.target.value)}
												/>
											</div>

											<div>
												<label
													className={labelClassName}
													htmlFor={`edit-description-${task.id}`}
												>
													Descripción
												</label>
												<textarea
													id={`edit-description-${task.id}`}
													className={inputClassName}
													rows={3}
													value={editDescription}
													onChange={(event) =>
														setEditDescription(event.target.value)
													}
												/>
											</div>

											<div className="flex flex-wrap gap-2">
												<button
													type="button"
													onClick={() => handleEditSave(task.id)}
													className={primaryButtonClassName}
												>
													Guardar
												</button>
												<button
													type="button"
													onClick={handleEditCancel}
													className={secondaryButtonClassName}
												>
													Cancelar
												</button>
											</div>
										</div>
									) : (
										<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
											<div className="flex min-w-0 flex-1 items-start gap-3">
												<input
													type="checkbox"
													checked={task.status === "completed"}
													onChange={() => handleToggleStatus(task)}
													aria-label={`Marcar "${task.title}" como ${task.status === "pending" ? "completada" : "pendiente"}`}
													className="mt-1 h-4 w-4 shrink-0 accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
												/>
												<div className="min-w-0 flex-1">
													<div className="flex flex-wrap items-center gap-2">
														<p className="font-medium text-foreground break-words">
															{task.title}
														</p>
														<span
															className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
																task.status === "completed"
																	? "bg-foreground/10 text-foreground/80"
																	: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
															}`}
														>
															{getStatusLabel(task.status)}
														</span>
													</div>
													{task.description ? (
														<p className="mt-1 text-sm text-foreground/70 break-words">
															{task.description}
														</p>
													) : null}
												</div>
											</div>

											<div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
												<button
													type="button"
													onClick={() => handleEditStart(task)}
													className={secondaryButtonClassName}
												>
													Editar
												</button>
												<button
													type="button"
													onClick={() => handleDelete(task.id)}
													className={destructiveButtonClassName}
												>
													Eliminar
												</button>
											</div>
										</div>
									)}
								</li>
							);
						})}
					</ul>
				)}
			</section>
		</main>
	);
}
