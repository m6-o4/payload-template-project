import path from "path";
import { fileURLToPath } from "url";
import { collections } from "@/payload/collections";
import { Users } from "@/payload/collections/users/schema";
import { plugins } from "@/payload/plugins/schema";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexical } from "@/payload/fields/lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// retrieve values from the environment variables.
const databaseURL = process.env.DATABASE_URL!;
const payloadSecret = process.env.PAYLOAD_SECRET!;

export default buildConfig({
	admin: {
		components: {
			logout: {
				Button: "/components/admin/custom-signout-button#CustomSignOutButton",
			},
			providers: ["/components/admin/clerk-admin-provider#ClerkAdminProvider"],
		},
		// set base directory for custom component imports.
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
			// append a suffix to the browser title for all admin pages.
			titleSuffix: " | Superior Software Solutions",
		},

		// set the users collection slug for authentication management
		user: Users.slug,
	},
	collections: collections,
	db: mongooseAdapter({ url: databaseURL }),
	editor: lexical,
	plugins: [...plugins],
	secret: payloadSecret,
	sharp,
	typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
