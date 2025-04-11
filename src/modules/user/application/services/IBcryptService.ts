

export interface IBcryptService {
    /**
     * Băm một chuỗi đầu vào (payload).
     * @param payload Chuỗi cần băm.
     * @returns Promise giải quyết thành chuỗi đã được băm.
     */
    hash(payload: string): Promise<string>;

    /**
     * So sánh một chuỗi đầu vào (payload) với một chuỗi đã được băm.
     * @param payload Chuỗi gốc cần so sánh.
     * @param hashed Chuỗi đã được băm trước đó. (Lưu ý: đã sửa lỗi chính tả từ 'hasd')
     * @returns Promise giải quyết thành true nếu khớp, ngược lại là false.
     */
    compare(payload: string, hashed: string): Promise<boolean>;
}