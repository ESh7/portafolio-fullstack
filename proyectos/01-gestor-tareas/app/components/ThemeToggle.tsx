"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getStoredTheme(): Theme {
	if (typeof window === "undefined") {
		return "light";
	}
	return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle("dark", theme === "dark");
	localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const currentTheme = getStoredTheme();
		setTheme(currentTheme);
		applyTheme(currentTheme);
	}, []);

	function handleToggle() {
		const nextTheme: Theme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
		applyTheme(nextTheme);
	}

	const isDark = theme === "dark";
	const label = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

	return (
		<button
			type="button"
			onClick={handleToggle}
			className="fixed right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-md border border-foreground/20 bg-background text-foreground hover:bg-foreground/10"
			aria-label={label}
			title={label}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				className="hidden h-6 w-6 dark:block"
				aria-hidden="true"
			>
				<path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="block h-6 w-6 dark:hidden"
				aria-hidden="true"
			>
				<path d="M9 21h6" />
				<path d="M12 3a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1.26A7 7 0 0 0 12 3z" />
			</svg>
		</button>
	);
}
