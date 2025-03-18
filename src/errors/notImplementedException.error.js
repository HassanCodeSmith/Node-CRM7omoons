import { CustomErrorException } from "./customError.js";

// 501: Not Implemented Error
export class NotImplementedException extends CustomErrorException {
  constructor(message, ...rest) {
    super(501, message, "NotImplemented", ...rest);
  }
}
