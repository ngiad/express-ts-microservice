import { IBaseDeleteService, ICommandHandler } from "../../../share/interface";
import { IProductRepository } from "../interface";
import { ProductStatus } from "../model";
import { ErrProductDeleted, ErrProductId, ErrProductIdNotFound } from "../model/error";


export class DeleteProductService implements ICommandHandler<IBaseDeleteService, boolean> {
    constructor(private readonly _repository: IProductRepository) {}

    execute = async (command: IBaseDeleteService): Promise<boolean> => {
        if (!command.id) throw ErrProductId
        const product = await this._repository.detail(command.id);
        if (!product) throw ErrProductIdNotFound

        if(product.status === ProductStatus.Deleted) throw ErrProductDeleted

        return await this._repository.delete(command.id, false);
    }
}