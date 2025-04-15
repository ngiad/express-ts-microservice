import { Router } from "express";
import { Sequelize } from "sequelize";
import { initCartItemModel, modelCartName } from "./infrastructure/persistence/mysql-sequelize/sequelize/cart.model";
import { CartCommandRepository, CartQueryRepository, CartRepository, RPCCartRepository } from "./infrastructure/persistence/mysql-sequelize/repositories/cart.repository";
import { DeleteCartItemCommand } from "./application/usecase/commands/deleteCartItem.command";
import { UpdateCartItemCommand } from "./application/usecase/commands/updateCartItem.command";
import { ListCartItemQuery } from "./application/usecase/queries/listCartItem.query";
import { wrapClassMethods } from "../../share/utils/wrapClassMethods";
import { CartHttpController } from "./application/transport/http/controller";
import { Introspect } from "../../share/repository/introspec-rpc";
import { config } from "../../share/component/config";
import { VerifyGlobalCommand } from "../../share/usecase/commands/verifyGlobalCommand";
import { authGlobalMiddleware } from "../../share/middleware/auth";
import { CreateCartItemCommand } from "./application/usecase/commands/createCartItem.command";
import { RPCBranchCartItem, RPCProductRepository } from "./infrastructure/persistence/rpc-repository";



export const setupCartModule = (sequelize: Sequelize) => {
  initCartItemModel(sequelize);
  const rpcProductRepository = new RPCProductRepository(config.rpc.productRPC)
  const rpcBranchRepository = new RPCBranchCartItem(config.rpc.branchRPC)

  const CartQueryRepo = new CartQueryRepository(sequelize, modelCartName);
  const CartCommandRepo = new CartCommandRepository(
    sequelize,
    modelCartName
  );

  const repository = new CartRepository(CartQueryRepo, CartCommandRepo);
  // command query pattenr
  // command
  const createHandler = new CreateCartItemCommand(repository, rpcProductRepository);
  const updateHandler = new UpdateCartItemCommand(repository);
  const deleteHandler = new DeleteCartItemCommand(repository);

  // query
  const listQuery = new ListCartItemQuery(repository,rpcProductRepository,rpcBranchRepository);


  const controller = wrapClassMethods<CartHttpController>(new CartHttpController({
    createHandler: createHandler,
    updateHandler: updateHandler,
    listQuery: listQuery,
    deleteHandler: deleteHandler,
  }))
  

  const introspect = new Introspect(config.rpc.userRPC)
  const verifyGlobal = new VerifyGlobalCommand(introspect);

  const router = Router();

  router.post(
    "/cart",
    authGlobalMiddleware(verifyGlobal),
    controller.createAPI
  );
  router.get("/cart", authGlobalMiddleware(verifyGlobal), controller.listAPI);
  router.patch(
    "/cart/:id",
    authGlobalMiddleware(verifyGlobal),
    controller.updateAPI
  );
  router.delete(
    "/cart/:id",
    authGlobalMiddleware(verifyGlobal),
    controller.deleteAPI
  );

  // rpc
  return router;
};
