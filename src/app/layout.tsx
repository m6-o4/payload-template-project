import { ReactNode } from "react";
import { Geist } from "next/font/google";

// configure brand-specific typography with css variables for tailwind integration
const geist = Geist({ subsets: ["latin"] });

// primary shell for the web frontend, managing site-wide providers and layout structure
const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<html lang="en" className={geist.className}>
			<body>{children}</body>
		</html>
	);
};

export { RootLayout as default };
