import { Router } from "express"
import { Sequelize } from "sequelize"
import { init, modelBranchName } from "./repository/dto"
import { BranchRepository } from "./repository/repo"
import { BranchHttpService } from "./controller/transport/http-service"
import { CreateBranchService } from "./service/create.service"
import { BranchDetailService } from "./service/detail.service"
import { BranchUpdateService } from "./service/update.service"
import { GetListBranch } from "./service/list.service"
import { BranchDeleteService } from "./service/delete.service"
import { GetByCondBranchService } from "./service/bycond.service"



export const setupBranchModule = (sequelize : Sequelize) => {
    init(sequelize)
    const repository = new BranchRepository(sequelize,modelBranchName)
    // command query pattenr
    // command
    const createHandler = new CreateBranchService(repository)
    const updateHandler = new BranchUpdateService(repository)
    const deleteHandler = new BranchDeleteService(repository)


    // query
    const detailQuery = new BranchDetailService(repository)
    const listQuery = new GetListBranch(repository)
    const byCondQuery = new GetByCondBranchService(repository)


    const controller = new BranchHttpService(createHandler,detailQuery,updateHandler,listQuery,deleteHandler,byCondQuery)
    const router = Router()

    router.post("/branches",controller.createAPI)
    router.get("/branches",controller.listAPI)
    router.get("/branches/by",controller.byCond)
    router.get("/branches/:id",controller.detailAPI)
    router.patch("/branches/:id",controller.updateAPI)
    router.delete("/branches/:id",controller.deleteAPI)
    return router
}