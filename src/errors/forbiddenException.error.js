import { CustomErrorException } from "./customError.js";

// 403: Forbidden - Use when the server understands the request but refuses to authorize it.
export class ForbiddenException extends CustomErrorException {
  constructor(message, ...rest) {
    super(403, message, "Forbidden", ...rest);
  }
}
