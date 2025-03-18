import { CustomErrorException } from "./customError.js";

// 418: I'm a teapot - Use as a humorous response for requests to brew coffee with a teapot.
export class ImATeapotException extends CustomErrorException {
  constructor(message, ...rest) {
    super(418, message, "ImATeapot", ...rest);
  }
}
