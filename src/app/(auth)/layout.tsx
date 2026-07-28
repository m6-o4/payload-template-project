import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { geist } from "@/lib/fonts";

// load foundational styles for the application auth
import "@/globals.css";

const metadata: Metadata = {
	description: "Sign in to continue.",
	robots: { follow: false, index: false },
	title: "Sign In | Superior Software Solutions",
};

// root layout for the auth group. renders html/body directly because this
// project uses multiple root layouts, one per route group
const AuthLayout = (props: { children: ReactNode }) => {
	const { children } = props;

	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={geist.className}>
					<main className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
						{children}
					</main>
				</body>
			</html>
		</ClerkProvider>
	);
};

export { AuthLayout as default, metadata };
