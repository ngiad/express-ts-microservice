import { IBaseGetDetail, IQueryHandler } from "../../../share/interface";
import { IProductRepository } from "../interface";
import { ProductType } from "../model";
import { ErrProductIdNotFound, ErrProductIdNotValid } from "../model/error";


export class ProductDetailService implements IQueryHandler<IBaseGetDetail, ProductType> {
    constructor(private readonly _repository: IProductRepository) {}

    query = async (command: IBaseGetDetail): Promise<ProductType> => {
        if (!command.id) throw ErrProductIdNotValid
        const product = await this._repository.detail(command.id);
        if (!product) throw ErrProductIdNotFound
        if (product.status === "deleted") throw ErrProductIdNotFound
        return product
    }
}