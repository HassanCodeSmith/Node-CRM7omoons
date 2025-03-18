import { CustomErrorException } from "./customError.js";

// 400: Bad Request - Use when the client sends an invalid request or incorrect data.
export class BadRequestException extends CustomErrorException {
  constructor(message, ...rest) {
    super(400, message, "BadRequest", ...rest);
  }
}
