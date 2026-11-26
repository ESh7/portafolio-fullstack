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

export default function HomePage() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [tasks, setTasks] = useState<Tarea[]>([]);
	const [filter, setFilter] = useState<TaskFilter>("all");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const loadTasks = useCallback(async (currentFilter: TaskFilter) => {
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
		} catch (loadError) {
			console.error(loadError);
			setError("No se pudieron cargar las tareas.");
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

			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "No se pudo crear la tarea.");
				return;
			}

			await loadTasks(filter);
			setTitle("");
			setDescription("");
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
				const data = await response.json();
				setError(data.error ?? "No se pudo eliminar la tarea.");
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
				const data = await response.json();
				setError(data.error ?? "No se pudo actualizar la tarea.");
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

			const data = await response.json();

			if (!response.ok) {
				setError(data.error ?? "No se pudo actualizar la tarea.");
				return;
			}

			const updatedTask: Tarea = data;
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

	return (
		<main>
			<h1>Gestor de Tareas</h1>

			<section>
				<h2>Nueva tarea</h2>
				<form onSubmit={handleSubmit}>
					<label htmlFor="title">Título</label>
					<input
						id="title"
						name="title"
						type="text"
						className="border bg-background text-foreground p-1"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>

					<label htmlFor="description">Descripción (opcional)</label>
					<textarea
						id="description"
						name="description"
						className="border bg-background text-foreground p-1"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
					/>

					{error ? <p role="alert">{error}</p> : null}

					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creando..." : "Crear tarea"}
					</button>
				</form>
			</section>
			<div className="flex gap-6">
				<button
					type="button"
					onClick={() => setFilter("all")}
					disabled={filter === "all"}
				>
					Todas
				</button>
				<button
					type="button"
					onClick={() => setFilter("pending")}
					disabled={filter === "pending"}
				>
					Pendientes
				</button>
				<button
					type="button"
					onClick={() => setFilter("completed")}
					disabled={filter === "completed"}
				>
					Completadas
				</button>
			</div>

			<section>
				<h2>Mis tareas</h2>
				{tasks.length === 0 ? (
					<p>
						{filter === "all"
							? "No hay tareas todavía."
							: "No hay tareas para este filtro."}
					</p>
				) : (
					<ul>
						{tasks.map((task) => (
							<li key={task.id}>
								<input
									type="checkbox"
									checked={task.status === "completed"}
									onChange={() => handleToggleStatus(task)}
									aria-label={`Marcar "${task.title}" como ${task.status === "pending" ? "completada" : "pendiente"}`}
								/>

								{editingId === task.id ? (
									<div>
										<label htmlFor={`edit-title-${task.id}`}>Título</label>
										<input
											id={`edit-title-${task.id}`}
											type="text"
											className="border bg-background text-foreground p-1"
											value={editTitle}
											onChange={(event) => setEditTitle(event.target.value)}
										/>

										<label htmlFor={`edit-description-${task.id}`}>
											Descripción
										</label>
										<textarea
											id={`edit-description-${task.id}`}
											className="border bg-background text-foreground p-1"
											value={editDescription}
											onChange={(event) =>
												setEditDescription(event.target.value)
											}
										/>

										<button
											type="button"
											onClick={() => handleEditSave(task.id)}
										>
											Guardar
										</button>
										<button type="button" onClick={handleEditCancel}>
											Cancelar
										</button>
									</div>
								) : (
									<>
										<strong>{task.title}</strong> — {task.status}
										<button type="button" onClick={() => handleEditStart(task)}>
											Editar
										</button>
										<button type="button" onClick={() => handleDelete(task.id)}>
											Eliminar
										</button>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}
