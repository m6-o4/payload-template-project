import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { geist } from "@/lib/fonts";

// load foundational styles for the web application
import "@/globals.css";

const metadata: Metadata = {
	description: "A blank template using Payload in a Next.js app.",
	title: "Payload Blank Template",
};

// root layout for the public site. renders html/body directly because this
// project uses multiple root layouts, one per route group
const WebLayout = (props: { children: ReactNode }) => {
	const { children } = props;

	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={geist.className}>
					<header>The Header Goes Here</header>

					<main className="flex min-h-screen flex-col antialiased">{children}</main>

					<footer className="mt-auto">The Footer Goes Here</footer>
				</body>
			</html>
		</ClerkProvider>
	);
};

export { WebLayout as default, metadata };
