import { ReactNode } from "react";
import type { Metadata } from "next";

// load foundational styles for the web application
import "@/globals.css";

const metadata: Metadata = {
	description: "A blank template using Payload in a Next.js app.",
	title: "Payload Blank Template",
};

const WebLayout = (props: { children: ReactNode }) => {
	const { children } = props;

	return (
		<div>
			<main>{children}</main>
		</div>
	);
};

export { WebLayout as default, metadata };
