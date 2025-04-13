// business error : do nghiệp vụ quy định
// technical error : các lỗi do kĩ thuật

import { ResponseErrorBadRequest } from "../../../share/response/response.error"

export const ErrCategoryNameDublicate = new ResponseErrorBadRequest('Category name already exists')
export const ErrCategoryNotfound = new ResponseErrorBadRequest('Category not found')
export const ErrCategoryDeleted = new ResponseErrorBadRequest('Category deleted')

export const ErrCategoryIdValidate = new ResponseErrorBadRequest("id validate wrong!")