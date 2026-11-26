"use client";

import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main>
			<h2>Algo salió mal</h2>
			<p>Ocurrió un error al cargar esta sección.</p>
			<button type="button" onClick={reset}>
				Reintentar
			</button>
		</main>
	);
}
