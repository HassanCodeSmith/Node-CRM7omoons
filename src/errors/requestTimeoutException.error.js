import { CustomErrorException } from "./customError.js";

// 408: Request Timeout - Use when the client takes too long to send a request.
export class RequestTimeoutException extends CustomErrorException {
  constructor(message, ...rest) {
    super(408, message, "RequestTimeout", ...rest);
  }
}
