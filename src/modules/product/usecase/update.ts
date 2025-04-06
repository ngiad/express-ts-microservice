import { IBaseUpdateService, ICommandHandler } from "../../../share/interface";
import { BaseStatus } from "../../../share/model/base-status";
import { IProductRepository } from "../interface";
import { ProductStatus, ProductType } from "../model";
import { ProductUpdateSchema, ProductUpdateType } from "../model/dto";
import { ErrProductDeleted, ErrProductId, ErrProductIdNotFound } from "../model/error";


export class UpdateProductService implements ICommandHandler<IBaseUpdateService<ProductUpdateType>,ProductType>{
    constructor(private readonly _repository: IProductRepository) {}

    execute = async(command: IBaseUpdateService<ProductUpdateType>): Promise<ProductType> => {
        if (!command.id) throw ErrProductId
        const productUpdateValidate = ProductUpdateSchema.safeParse(command.data);

        if(productUpdateValidate.error) 
            throw productUpdateValidate.error;

        const product: ProductType | null = await this._repository.detail(command.id);
        if (!product) throw ErrProductIdNotFound

        if(product.status === ProductStatus.Deleted) throw ErrProductDeleted

        return await this._repository.update(command.id,productUpdateValidate.data as ProductUpdateType & BaseStatus);
    }
}