import path from "path";
import { fileURLToPath } from "url";
import { globals } from "@/payload/blocks/globals";
import { collections } from "@/payload/collections";
import { Users } from "@/payload/collections/users/schema";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexical } from "@/payload/fields/lexical";
import { resend } from "@/payload/fields/resend";
import { plugins } from "@/payload/plugins/schema";
import { buildConfig } from "payload";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// retrieve values from the environment variables
const databaseURL = process.env.DATABASE_URL!;
const payloadSecret = process.env.PAYLOAD_SECRET!;

export default buildConfig({
	admin: {
		components: {
			graphics: { Icon: "/components/payload/icon#Icon" },
			logout: { Button: "/components/admin/custom-signout-button#CustomSignOutButton" },
			providers: ["/components/admin/clerk-admin-provider#ClerkAdminProvider"],
		},

		// set base directory for custom component imports
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
			icons: [
				{
					fetchPriority: "high",
					rel: "icon",
					sizes: "32x32",
					type: "image/svg+xml",
					url: "/favicon.svg",
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
	plugins: [...plugins],
	secret: payloadSecret,
	sharp,
	typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
