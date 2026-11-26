import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "./components/ThemeToggle";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Gestor de Tareas",
	description:
		"Aplicación para crear, organizar y dar seguimiento a tus tareas.",
};

const themeScript = `(function(){try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="es"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full bg-background font-sans text-foreground">
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: script estático para aplicar el tema antes del render y evitar flash */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<ThemeToggle />
				{children}
			</body>
		</html>
	);
}
