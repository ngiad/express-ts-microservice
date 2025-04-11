import { ResponseErrorBadRequest, ResponseErrorNotFound } from "../../../../share/response/response.error";


export const ErrTokenNotfound = new ResponseErrorBadRequest("token notfound!")

export const ErrUserNotfound = new ResponseErrorNotFound("username notfound!")
export const ErrUserDeleted = new ResponseErrorBadRequest("user deleted!")
export const ErrUserBanner = new ResponseErrorBadRequest("user banner")
export const ErrUserPassword = new ResponseErrorBadRequest("user password is wrong")
export const ErrLoginValidation = new ResponseErrorBadRequest(
  "Login validation error"
);
export const ErrLoginUsernameValidation = new ResponseErrorBadRequest(
  "Login username validation error"
);

export const ErrLoginPasswordValidation = new ResponseErrorBadRequest(
  "Login password validation error"
);

export const ErrRegisterUsernameValidation = new ResponseErrorBadRequest(
    "Register username validation error"
  );
  
export const ErrRegisterPasswordValidation = new ResponseErrorBadRequest(
    "Register password validation error"
  );

export const ErrRegisterNameValidation = new ResponseErrorBadRequest(
    "Register name validation error"
)      
  
export const ErrRegisterValidation = new ResponseErrorBadRequest(
    "Register validation error"
)

export const ErrUserCreated = new ResponseErrorBadRequest(
    "User created error"
)


export const ErrUserUpdateProfileValidate = new ResponseErrorBadRequest(
  'User update validate wrong'
)

export const ErrUserIdValidateWrong = new ResponseErrorBadRequest(
  'id user wrong'
)


export const ErrUseUpdatePasswordValidateWrong = new ResponseErrorBadRequest(
  'password update validate wrong'
)
  

