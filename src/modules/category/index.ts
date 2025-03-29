import { Router } from "express"
import { init, modelName } from "./controller/repository/dto"
import { Sequelize } from "sequelize"
import { CategoryHttpService } from "./controller/transport/http-service"
import { CategoryService } from "./service"
import { CategoryRepository } from "./controller/repository/repo"


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
    return router
}