import { CustomErrorException } from "./customError.js";

// 413: Payload Too Large - Use when the request payload is larger than the server is willing or able to process.
export class PayloadTooLargeException extends CustomErrorException {
  constructor(message, ...rest) {
    super(413, message, "PayloadTooLarge", ...rest);
  }
}
