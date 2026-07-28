import type { User } from "@/payload-types";
import type { Access, AccessArgs } from "payload";

type Role = NonNullable<User["roles"]>[number];
type MaybeUser = Pick<User, "roles"> | null | undefined;

// narrower than Access: returns a plain boolean, never a Where filter.
// required for collection.admin, which has no document set to filter against
type BooleanAccess = (args: AccessArgs) => boolean;

// single source of truth for role checks; roles is an array, so every gate
// below reads through this rather than indexing it inline
const hasRole = (user: MaybeUser, ...roles: Role[]): boolean =>
	Boolean(user?.roles?.some((role) => roles.includes(role)));

// gate for any action that requires a signed-in user, regardless of role
const isAuthenticated: BooleanAccess = ({ req: { user } }) => {
	return Boolean(user);
};

// used on content collections where guests should only see published entries
// while authenticated users (editors, previews) can see drafts as well
const isAuthenticatedOrPublished: Access = ({ req: { user } }) => {
	if (user) {
		return true;
	}
	return { _status: { equals: "published" } };
};

// escape hatch for resources that are intentionally world-readable
const isPublic: BooleanAccess = () => true;

// hard lock, typically paired with server actions or api routes that perform
// their own authorization, so the collection itself stays sealed
const isRestricted: BooleanAccess = () => false;

// top tier in this template; destructive and platform-wide operations.
// role changes are written to Clerk, so this governs Payload-side writes only
const isAdmin: BooleanAccess = ({ req: { user } }) => {
	return hasRole(user, "admin");
};

// staff-level gate covering content management; mirrors the rule that decides
// who may enter the admin panel at all
const isAdminOrEditor: BooleanAccess = ({ req: { user } }) => {
	return hasRole(user, "admin", "editor");
};

// users collection read gate: staff see the full list, everyone else is scoped
// to their own record so authenticated end users cannot enumerate the table
const isAdminOrSelf: Access = ({ req: { user } }) => {
	if (!user) return false;
	if (hasRole(user, "admin", "editor")) return true;
	return { id: { equals: user.id } };
};

// factory for ownership-scoped collections. pass the relation field pointing
// back to the owning user, e.g. isAdminOrOwner("createdBy"). replaces writing a
// near-identical function per collection as ownership fields multiply
const isAdminOrOwner =
	(ownerField: string): Access =>
	({ req: { user } }) => {
		if (!user) return false;
		if (hasRole(user, "admin", "editor")) return true;
		return { [ownerField]: { equals: user.id } };
	};

export {
	isAdmin,
	isAdminOrEditor,
	isAdminOrOwner,
	isAdminOrSelf,
	isAuthenticated,
	isAuthenticatedOrPublished,
	isPublic,
	isRestricted,
};
