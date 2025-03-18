import { CustomErrorException } from "./customError.js";

// 504: Gateway Timeout Error
export class GatewayTimeoutException extends CustomErrorException {
  constructor(message, ...rest) {
    super(504, message, "GatewayTimeout", ...rest);
  }
}
