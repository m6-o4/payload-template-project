import { isAuthenticated, isPublic } from "@/payload/access/access-control";
import type { CollectionConfig } from "payload";

const Media: CollectionConfig = {
	slug: "media",
	labels: { singular: "Media", plural: "Media" },
	admin: {
		defaultColumns: ["filename", "alt", "caption", "createdAt", "updatedAt"],
		group: "Globals",
		useAsTitle: "filename",
	},
	access: {
		create: isAuthenticated,
		delete: isAuthenticated,
		read: isPublic,
		update: isAuthenticated,
	},
	fields: [
		{ name: "alt", type: "text", label: "Alternative Text", required: true },
		{ name: "caption", type: "text", label: "Caption" },
	],
	upload: {
		adminThumbnail: "filename",
		focalPoint: true,
		mimeTypes: [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"image/svg+xml",
			"image/webp",
		],
	},
};

export { Media };
