import { CustomErrorException } from "./customError.js";

// 410: Gone - Use when the resource requested is no longer available and will not be available again.
export class GoneException extends CustomErrorException {
  constructor(message, ...rest) {
    super(410, message, "Gone", ...rest);
  }
}
