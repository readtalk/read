import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import { useEffect, useState } from "react";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	const [installPrompt, setInstallPrompt] = useState<any>(null);
	const [showInstallUI, setShowInstallUI] = useState(false);

	useEffect(() => {
		// Tangkap event beforeinstallprompt
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setInstallPrompt(e);
			setShowInstallUI(true);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		};
	}, []);

	const handleInstall = () => {
		if (installPrompt) {
			installPrompt.prompt();
			installPrompt.userChoice.then(() => {
				setShowInstallUI(false);
				setInstallPrompt(null);
			});
		}
	};

	const dismissInstall = () => {
		setShowInstallUI(false);
	};

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				{/* ========== TAMBAHAN PWA ========== */}
				<link rel="manifest" href="/manifest.json" />
				<meta name="theme-color" content="#ffffff" />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
				{/* ========== SERVICE WORKER ========== */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
							if ('serviceWorker' in navigator) {
								navigator.serviceWorker.register('/sw.js')
									.then(reg => console.log('SW registered:', reg))
									.catch(err => console.error('SW registration failed:', err));
							}
						`,
					}}
				/>

				{/* ========== CUSTOM PWA INSTALL PROMPT ========== */}
				{showInstallUI && (
					<div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 z-50 border border-gray-200 dark:border-gray-700 animate-slide-up">
						<div className="flex items-start gap-3">
							<div className="text-3xl">📁</div>
							<div className="flex-1">
								<h3 className="font-semibold text-gray-800 dark:text-white">
									Get Install
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									App-like experience with home screen icon
								</p>
								<div className="flex gap-2 mt-3">
									<button
										onClick={handleInstall}
										className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
									>
										Install
									</button>
									<button
										onClick={dismissInstall}
										className="px-4 py-1.5 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									>
										Not now
									</button>
								</div>
							</div>
							<button
								onClick={dismissInstall}
								className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							>
								✕
							</button>
						</div>
					</div>
				)}
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
