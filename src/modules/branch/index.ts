import { Router } from "express"
import { Sequelize } from "sequelize"
import { init, modelBranchName } from "./repository/dto"
import { BranchRepository } from "./repository/repo"
import { BranchService } from "./service"
import { BranchHttpService } from "./controller/transport/http-service"
import { CreateBranchService } from "./service/create.service"



export const setupBranchModule = (sequelize : Sequelize) => {
    init(sequelize)
    const repository = new BranchRepository(sequelize,modelBranchName)
    const service = new BranchService(repository)
    // command query pattenr
    const createHandler = new CreateBranchService(repository)
    const controller = new BranchHttpService(service,createHandler)
    const router = Router()

    router.post("/branches",controller.createAPI)
    router.get("/branches",controller.listAPI)
    router.get("/branches/by",controller.byCond)
    router.get("/branches/:id",controller.detailAPI)
    router.patch("/branches/:id",controller.updateAPI)
    router.delete("/branches/:id",controller.deleteAPI)
    return router
}