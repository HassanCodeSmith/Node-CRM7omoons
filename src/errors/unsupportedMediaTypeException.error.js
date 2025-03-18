import { CustomErrorException } from "./customError.js";

// 415: Unsupported Media Type - Use when the media format of the requested data is not supported by the server.
export class UnsupportedMediaTypeException extends CustomErrorException {
  constructor(message, ...rest) {
    super(415, message, "UnsupportedMedia", ...rest);
  }
}
