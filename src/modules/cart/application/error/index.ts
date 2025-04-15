import {
  ResponseErrorBadRequest,
  ResponseErrorNotFound,
  ResponseErrorUnprocessableEntity,
} from "../../../../share/response/response.error";

export const ErrCartIdNotFound = new ResponseErrorNotFound();
export const ErrCartIdnotvalidate = new ResponseErrorUnprocessableEntity(
  "Cart id not validate"
);
