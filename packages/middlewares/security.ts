import helmet, { type FastifyHelmetOptions } from "@fastify/helmet";
import cors, { type FastifyCorsOptions } from "@fastify/cors";
import rateLimit, { type FastifyRateLimitOptions } from "@fastify/rate-limit";
import cookie, { type FastifyCookieOptions } from "@fastify/cookie";
import compress, { type FastifyCompressOptions } from "@fastify/compress";
import csrf, {
  type FastifyCsrfProtectionOptions,
} from "@fastify/csrf-protection";
import fastifyStatic, { type FastifyStaticOptions } from "@fastify/static";
import type { SecurityPlugin } from "../core/options";

function cleanFastifyStaticOptions(
  options: FastifyStaticOptions,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(options).filter(([_, value]) => value !== undefined),
  );
}

export class Security {
  static helmet(options?: FastifyHelmetOptions): SecurityPlugin {
    return async (app) => {
      await app.register(helmet, {
        global: true,
        ...options,
      });
    };
  }

  static cors(options?: FastifyCorsOptions): SecurityPlugin {
    return async (app) => {
      await app.register(cors, {
        origin: true,
        credentials: true,
        ...options,
      });
    };
  }

  static rateLimit(options?: FastifyRateLimitOptions): SecurityPlugin {
    return async (app) => {
      await app.register(rateLimit, {
        max: 100,
        timeWindow: "1 minute",
        ...options,
      });
    };
  }

  static cookies(options?: FastifyCookieOptions): SecurityPlugin {
    return async (app) => {
      await app.register(cookie, {
        ...options,
      });
    };
  }

  static csrf(options: FastifyCsrfProtectionOptions = {}): SecurityPlugin {
    return async (app) => {
      await app.register(csrf, options);
    };
  }

  static compress(options?: FastifyCompressOptions): SecurityPlugin {
    return async (app) => {
      await app.register(compress, {
        global: true,
        ...options,
      });
    };
  }

  static staticFiles(options: FastifyStaticOptions = {}): SecurityPlugin {
    return async (app) => {
      const cleanedOptions = cleanFastifyStaticOptions(options);
      await app.register(fastifyStatic, cleanedOptions);
    };
  }
}
