import { CustomErrorException } from "./customError.js";

// 502: Bad Gateway Error
export class BadGatewayException extends CustomErrorException {
  constructor(message, ...rest) {
    super(502, message, "BadGateway", ...rest);
  }
}
