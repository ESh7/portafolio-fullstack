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
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>

					<label htmlFor="description">Descripción (opcional)</label>
					<textarea
						id="description"
						name="description"
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
								<strong>{task.title}</strong> — {task.status}
								<button type="button" onClick={() => handleDelete(task.id)}>
									Eliminar
								</button>
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}
