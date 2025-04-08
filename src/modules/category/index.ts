import { Router } from "express"
import { init, modelName } from "./Infrastructure/repository/dto"
import { Sequelize } from "sequelize"
import { CategoryHttpService } from "./Infrastructure/transport/http-service"
import { CategoryService } from "./usecase"
import { CategoryRepository, RPCCategoryRepository } from "./Infrastructure/repository/repo"
import { RPCCategoryService } from "./Infrastructure/rpc/rpc-service"


export const setupCategoryModule = (sequelize : Sequelize) => {
    init(sequelize)
    const repository = new CategoryRepository(sequelize,modelName)
    const service = new CategoryService(repository)
    const controller = new CategoryHttpService(service)
    const router = Router()

    router.post("/categories",controller.createAPI)
    router.get("/categories",controller.listAPI)
    router.get("/categories/:id",controller.detailAPI)
    router.patch("/categories/:id",controller.updateAPI)
    router.delete("/categories/:id",controller.deleteAPI)


    // rpc
    const rpcCategoryRepository = new RPCCategoryRepository(sequelize,modelName)
    const rpcCategoryService = new RPCCategoryService(rpcCategoryRepository)
    router.get("/rpc/categories/:id", rpcCategoryService.getByIdRPC)
    router.get("/rpc/categories", rpcCategoryService.getbylistRPC)
    router.get("/rpc/categories/by", rpcCategoryService.getByCondRPC)
    return router
}