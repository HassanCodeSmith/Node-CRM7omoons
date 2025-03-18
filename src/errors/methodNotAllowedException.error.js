import { CustomErrorException } from "./customError.js";

// 405: Method Not Allowed - Use when the request method is not supported for the requested resource.
export class MethodNotAllowedException extends CustomErrorException {
  constructor(message, ...rest) {
    super(405, message, "MethodNotAllowed", ...rest);
  }
}
