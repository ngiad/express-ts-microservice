import { Router } from "express"
import { Sequelize } from "sequelize"
import { init, modelProductName } from "./repository/dto"
import { ProductCommandRepository, ProductQueryRepository, ProductRepository } from "./repository/repo"
import { CreateProductService } from "./usecase/create"
import { ProductHttpService } from "./Infrastructure/transport/http-service"
import { UpdateProductService } from "./usecase/update"
import { DeleteProductService } from "./usecase/delete"
import { ProductDetailService } from "./usecase/detail"
import { ListProductService } from "./usecase/list"
import { GetProductByCondService } from "./usecase/bycond"


export const setupProductModule = (sequelize : Sequelize) => {
    init(sequelize)
    const productQueryRepository = new ProductQueryRepository(sequelize,modelProductName)
    const productCommandRepository = new ProductCommandRepository(sequelize,modelProductName)
    
    const repository = new ProductRepository(productQueryRepository,productCommandRepository)

    const createHandler = new CreateProductService(repository)
    const updateHandler = new UpdateProductService(repository)
    const deleteHandler = new DeleteProductService(repository)
    const detailQuery = new ProductDetailService(repository)
    const listQuery = new ListProductService(repository)
    const byCondQuery = new GetProductByCondService(repository)

    const controller = new ProductHttpService(createHandler,detailQuery,updateHandler,listQuery,deleteHandler,byCondQuery)

    const router = Router()

    router.post("/products",controller.createAPI)
    router.get("/products",controller.listAPI)
    router.get("/products/by",controller.byCondAPI)
    router.get("/products/:id",controller.detailAPI)
    router.patch("/products/:id",controller.updateAPI)
    router.delete("/products/:id",controller.deleteAPI)
    return router
}