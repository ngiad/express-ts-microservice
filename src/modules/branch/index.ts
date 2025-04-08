import { Router } from "express"
import { Sequelize } from "sequelize"
import { init, modelBranchName } from "./repository/dto"
import { BranchCommandRepository, BranchQueryRepository, BranchRepository, RPCBranchRepository } from "./repository/repo"
import { BranchHttpService } from "./Infrastructure/transport/http-service"
import { CreateBranchService } from "./usecase/create.service"
import { BranchDetailService } from "./usecase/detail.service"
import { BranchUpdateService } from "./usecase/update.service"
import { GetListBranch } from "./usecase/list.service"
import { BranchDeleteService } from "./usecase/delete.service"
import { GetByCondBranchService } from "./usecase/bycond.service"
import { RPCBranchService } from "./Infrastructure/rpc/rpc-service"

export const setupBranchModule = (sequelize : Sequelize) => {
    init(sequelize)
    const branchQueryRepo = new BranchQueryRepository(sequelize,modelBranchName)
    const branchCommandRepo = new BranchCommandRepository(sequelize,modelBranchName)
    
    const repository = new BranchRepository(branchQueryRepo,branchCommandRepo)
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
    router.get("/branches/by",controller.byCondAPI)
    router.get("/branches/:id",controller.detailAPI)
    router.patch("/branches/:id",controller.updateAPI)
    router.delete("/branches/:id",controller.deleteAPI)



    // rpc
    const rpcBranchRepository = new RPCBranchRepository(sequelize,modelBranchName)
    const rpcBranchService = new RPCBranchService(rpcBranchRepository)
    router.get("/rpc/branches/:id", rpcBranchService.getByIdRPC)
    router.get("/rpc/branches", rpcBranchService.getbylistRPC)
    router.get("/rpc/branches/by", rpcBranchService.getByCondRPC)
    
    return router
}