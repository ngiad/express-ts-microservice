import {
  ResponseErrorBadRequest,
  ResponseErrorForbidden,
  ResponseErrorNotFound,
  ResponseErrorUnprocessableEntity,
} from "../../../../share/response/response.error";

export const ErrCartIdNotFound = new ResponseErrorNotFound();
export const ErrCartIdnotvalidate = new ResponseErrorUnprocessableEntity(
  "Cart id not validate"
);

export const ErrProductNotfound = new ResponseErrorNotFound("Product not found")

export const ErrCartUserForbidden = new ResponseErrorForbidden("User not found")
