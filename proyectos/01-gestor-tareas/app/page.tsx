"use client";

import { type FormEvent, useEffect, useState } from "react";

type TaskStatus = "pending" | "completed";

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

	useEffect(() => {
		async function loadTasks() {
			try {
				const response = await fetch("/api/tareas");
				if (!response.ok) {
					throw new Error("No se pudieron cargar las tareas.");
				}

				const data: Tarea[] = await response.json();
				setTasks(data);
			} catch (loadError) {
				console.error(loadError);
				setError("No se pudieron cargar las tareas.");
			}
		}

		void loadTasks();
	}, []);

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

			setTasks((currentTasks) => [data as Tarea, ...currentTasks]);
			setTitle("");
			setDescription("");
		} catch (submitError) {
			console.error(submitError);
			setError("No se pudo crear la tarea.");
		} finally {
			setIsSubmitting(false);
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

			<section>
				<h2>Mis tareas</h2>
				{tasks.length === 0 ? (
					<p>No hay tareas todavía.</p>
				) : (
					<ul>
						{tasks.map((task) => (
							<li key={task.id}>
								<strong>{task.title}</strong> — {task.status}
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}
