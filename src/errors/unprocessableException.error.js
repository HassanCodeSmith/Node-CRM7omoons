import { CustomErrorException } from "./customError.js";

// 422: Unprocessable Entity - Use when the server understands the content type but cannot process the data.
export class UnprocessableEntityException extends CustomErrorException {
  constructor(message, ...rest) {
    super(422, message, "UnprocessableEntity", ...rest);
  }
}
