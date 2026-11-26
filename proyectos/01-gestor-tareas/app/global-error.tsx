"use client";

import { useEffect } from "react";

export default function GlobalError({
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
		<html lang="es">
			<body>
				<h2>Algo salió mal</h2>
				<p>Ocurrió un error inesperado en la aplicación.</p>
				<button type="button" onClick={reset}>
					Reintentar
				</button>
			</body>
		</html>
	);
}
