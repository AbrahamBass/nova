import type { Request } from "../request/base";
import type { Reply } from "../response/base";

export type middlewareFn = (req: Request, reply: Reply) => Promise<void> | void;
