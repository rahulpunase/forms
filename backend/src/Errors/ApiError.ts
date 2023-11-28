import { HttpStatusCode } from "../models";
import BaseError from "./BaseError";

class APIError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = "Internal server error",
    data = {}
  ) {
    super(name, httpCode, isOperational, description, data);
  }
}

export default APIError;
