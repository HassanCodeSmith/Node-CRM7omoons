import { CustomErrorException } from "./customError.js";

// 503: Service Unavailable Error
export class ServiceUnavailableException extends CustomErrorException {
  constructor(message, ...rest) {
    super(503, message, "ServiceUnavailable", ...rest);
  }
}
