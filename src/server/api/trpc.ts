/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { db } from "@/server/db";
// import type {
//   NextApiResponse,
//   NextApiRequest,
//   CreateNextContextOptions,
// } from "@trpc/server/adapters/next";
import type { UserDataPayload } from "@/types";

// type CreateContextOptions = {
//   req: NextApiRequest;

//   res: NextApiResponse;
// };

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";

// const createInnerTRPCContext = (_opts: CreateContextOptions) => {
//   return {
//     db,
//     req: _opts.req,
//     res: _opts.res,
//   };
// };

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};
// export const createTRPCContext = async (req: Request, resHeaders: Headers) => {
//   return {
//     db,
//     req,
//     resHeaders,
//   };
// };

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuth = t.middleware(async ({ ctx, next }) => {
  const authToken = ctx.headers.get("authorization");
  console.log(
    "%csrc/server/api/trpc.ts:86 ctx.headers",
    "color: #007acc;",
    ctx.headers,
  );

  if (typeof authToken !== "string") {
    throw new TRPCError({ code: "PARSE_ERROR" });
  }

  const [tokenType, accessToken] = authToken?.split(" ");

  if (
    typeof tokenType !== "string" ||
    typeof accessToken !== "string" ||
    tokenType !== "Bearer"
  ) {
    throw new TRPCError({ code: "PARSE_ERROR" });
  }

  if (!accessToken) throw new TRPCError({ code: "UNAUTHORIZED" });

  try {
    const payload = jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET,
    ) as UserDataPayload;

    if (payload) {
      return next({
        ctx: {
          userId: payload.userId,
        },
      });
    }
  } catch (error) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next();
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
