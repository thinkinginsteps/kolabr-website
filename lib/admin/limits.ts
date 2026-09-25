/**
 * Size limits shared by the back office and next.config.ts. Kept free of "server-only" so the
 * config can import it: the Server Action body limit and the upload check must be the same
 * number, or a package that passes one is refused by the other.
 */

/** A package is ~15MB today; the ceiling is for a mistake, not a limit to work to. */
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

/**
 * What a Server Action request may carry. Next caps it at 1MB by default, which would refuse every
 * deployment package. The limit covers the raw multipart body, so it allows headroom for the
 * boundaries and field metadata on top of the file. nginx allows bodies this large only under
 * /admin, which is where every action lives.
 */
export const SERVER_ACTION_BODY_LIMIT_BYTES = MAX_UPLOAD_BYTES + 1024 * 1024;
