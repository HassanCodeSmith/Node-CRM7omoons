import { CustomErrorException } from "./customError.js";

// 406: Not Acceptable - Use when the server cannot produce a response matching the client's Accept headers.
export class NotAcceptableException extends CustomErrorException {
  constructor(message, ...rest) {
    super(406, message, "NotAcceptable", ...rest);
  }
}
