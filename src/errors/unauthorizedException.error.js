import { CustomErrorException } from "./customError.js";

// 401: Unauthorized - Use when authentication is required and has failed or not provided.
export class UnauthorizedException extends CustomErrorException {
  constructor(message, ...rest) {
    super(401, message, "Unauthorized", ...rest);
  }
}
