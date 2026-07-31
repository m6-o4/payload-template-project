import path from "path";
import { fileURLToPath } from "url";
import { globals } from "@/payload/blocks/globals";
import { collections } from "@/payload/collections";
import { Users } from "@/payload/collections/users/schema";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexical } from "@/payload/fields/lexical";
import { resend } from "@/payload/fields/resend";
import { plugins } from "@/payload/plugins/schema";
import { buildConfig, PayloadRequest } from "payload";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// retrieve values from the environment variables
const cronSecret = process.env.CRON_SECRET!;
const databaseURL = process.env.DATABASE_URL!;
const payloadSecret = process.env.PAYLOAD_SECRET!;

export default buildConfig({
	admin: {
		components: {
			graphics: { Icon: "/components/payload/icon#Icon" },
			logout: { Button: "/components/admin/custom-signout-button#CustomSignOutButton" },
			providers: ["/components/admin/clerk-admin-provider#ClerkAdminProvider"],
		},
		importMap: {
			baseDir: path.resolve(dirname),
		},
		livePreview: {
			breakpoints: [
				{
					label: "Mobile",
					name: "mobile",
					width: 375,
					height: 667,
				},
				{
					label: "Tablet",
					name: "tablet",
					width: 768,
					height: 1024,
				},
				{
					label: "Desktop",
					name: "desktop",
					width: 1440,
					height: 900,
				},
			],
		},
		meta: {
			icons: [
				{
					fetchPriority: "high",
					rel: "icon",
					sizes: "32x32",
					type: "image/png",
					url: "/favicon.png",
				},
			],

			// append a suffix to the browser title for all admin pages
			titleSuffix: " | Superior Software Solutions",
		},

		// set the users collection slug for authentication management
		user: Users.slug,
	},
	collections: collections,
	db: mongooseAdapter({ url: databaseURL }),
	editor: lexical,
	email: resend,
	globals: globals,
	jobs: {
		access: {
			run: ({ req }: { req: PayloadRequest }): boolean => {
				// allow logged in users to execute this endpoint (default)
				if (req.user) return true;

				const secret = cronSecret;
				if (!secret) return false;

				// if there is no logged in user, then check
				// for the vercel cron secret to be present as an
				// authorization header:
				const authHeader = req.headers.get("authorization");
				return authHeader === `Bearer ${secret}`;
			},
		},
		tasks: [],
	},
	plugins: [...plugins],
	secret: payloadSecret,
	sharp,
	typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
