import { CustomErrorException } from "./customError.js";

// 505: HTTP Version Not Supported Error
export class HttpVersionNotSupportedException extends CustomErrorException {
  constructor(message, ...rest) {
    super(505, message, "HttpVersionNotSupported", ...rest);
  }
}
