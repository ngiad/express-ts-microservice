// business error : do nghiệp vụ quy định
// technical error : các lỗi do kĩ thuật

export const ErrCategoryNameDublicate = new Error('Category name already exists')
export const ErrCategoryNotfound = new Error('Category not found')
export const ErrCategoryDeleted = new Error('Category deleted')