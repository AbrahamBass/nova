import type { middlewareFn } from "./type";
import type { StaticHandlerMeta } from "../dependencies/type";
import type { Request } from "../request/base";
import type { Reply } from "../response/base";

export function authGuard(meta: StaticHandlerMeta): middlewareFn {
  return async (req: Request, reply: Reply) => {
    if (!meta.requiresAuth) return;
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };
}

function hasScopes(user: unknown): user is { scopes?: string[] } {
  return (
    !!user &&
    typeof user === "object" &&
    !Buffer.isBuffer(user) &&
    "scopes" in user
  );
}

export function scopesGuard(meta: StaticHandlerMeta): middlewareFn {
  return async (req, reply) => {
    if (!meta.scopes?.length) return;

    let userScopes: string[] = [];
    if (hasScopes(req.user)) {
      userScopes = req.user.scopes ?? [];
    }

    const allowed = meta.scopes.some((scope) => userScopes.includes(scope));

    if (!allowed) {
      reply.status(403).send({
        detail: "Forbidden",
      });
    }
  };
}
