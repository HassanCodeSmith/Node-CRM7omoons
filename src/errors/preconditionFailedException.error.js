import { CustomErrorException } from "./customError.js";

// 412: Precondition Failed - Use when preconditions in request headers are not met.
export class PreconditionFailedException extends CustomErrorException {
  constructor(message, ...rest) {
    super(412, message, "PreconditionFailed", ...rest);
  }
}
