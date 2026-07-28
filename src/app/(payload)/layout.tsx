/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
/* MODIFIED: added Clerk auth.protect() guard — see git history before regenerating. */
import config from "@payload-config";
import "@payloadcms/next/css";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { auth } from "@clerk/nextjs/server";
import { ReactNode } from "react";

import { importMap } from "./admin/importMap.js";
import "./custom.scss";

type Args = { children: ReactNode };

const serverFunction: ServerFunctionClient = async function (args) {
	"use server";

	return handleServerFunctions({
		...args,
		config,
		importMap,
	});
};

const Layout = async ({ children }: Args) => {
	await auth.protect();

	return (
		<RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
			{children}
		</RootLayout>
	);
};

export { Layout as default };
