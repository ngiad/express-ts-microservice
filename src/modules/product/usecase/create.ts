import { v7 } from "uuid";
import { ProductStatus, ProductType } from "../model";
import { ErrProductValueValidate } from "../model/error";
import { ProductCreateSchema, ProductCreateType } from "../model/dto";
import { IBaseCreateService, ICommandHandler } from "../../../share/interface";
import { IProductRepository } from "../interface";



export class CreateProductService implements ICommandHandler<IBaseCreateService<ProductCreateType>, ProductType> {
    constructor(private readonly _repository: IProductRepository) {}

    execute = async(command: IBaseCreateService<ProductCreateType>): Promise<ProductType> => {
        const validateProductCreate = ProductCreateSchema.safeParse(command.data);

        if (validateProductCreate.error) {
          throw ErrProductValueValidate;
        }
    
        const product: ProductType = {
          id: v7(),
          ...validateProductCreate.data,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: ProductStatus.Active,
        };
        return await this._repository.insert(product);
    }
}