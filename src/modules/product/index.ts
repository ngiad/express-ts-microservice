import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, modelProductName } from "./repository/mysql/dto";
import {
  ProductCommandRepository,
  ProductQueryRepository,
  ProductRepository,
  RPCProductRepository,
} from "./repository/mysql/repo";
import { CreateProductService } from "./usecase/create";
import { ProductHttpService } from "./Infrastructure/transport/http-service";
import { UpdateProductService } from "./usecase/update";
import { DeleteProductService } from "./usecase/delete";
import { ProductDetailService } from "./usecase/detail";
import { ListProductService } from "./usecase/list";
import { GetProductByCondService } from "./usecase/bycond";
import {
  ProxyProductBranchRepository,
  ProxyProductCategopryRepository,
  RPCProductBranchRopository,
  RPCProductCategoryRopository,
} from "./repository/rpc-repository";
import { config } from "../../share/component/config";
import { VerifyGlobalCommand } from "../../share/usecase/commands/verifyGlobalCommand";
import { roleHandlingGlobalMiddleware } from "../../share/middleware/role";
import { authGlobalMiddleware } from "../../share/middleware/auth";
import { UserRole } from "../../share/interface";
import { Introspect } from "../../share/repository/introspec-rpc";
import { wrapClassMethods } from "../../share/utils/wrapClassMethods";
import { ProductRPCService } from "./Infrastructure/rpc";

export const setupProductModule = (sequelize: Sequelize) => {
  init(sequelize);
  const productQueryRepository = new ProductQueryRepository(
    sequelize,
    modelProductName
  );
  const productCommandRepository = new ProductCommandRepository(
    sequelize,
    modelProductName
  );

  // rpc
  const productBranchRepo = new RPCProductBranchRopository(
    config.rpc.productBranch
  );
  const productCategoryRepo = new RPCProductCategoryRopository(
    config.rpc.productCategory
  );

  // proxy pattern demo
  const proxyProductBranchRepo = new ProxyProductBranchRepository(
    productBranchRepo
  );

  const proxyProductCategoryRepo = new ProxyProductCategopryRepository(
    productCategoryRepo
  );

  const repository = new ProductRepository(
    productQueryRepository,
    productCommandRepository
  );

  const createHandler = new CreateProductService(
    repository,
    proxyProductBranchRepo,
    productCategoryRepo
  );
  const updateHandler = new UpdateProductService(repository);
  const deleteHandler = new DeleteProductService(repository);
  const detailQuery = new ProductDetailService(repository);
  const listQuery = new ListProductService(
    repository,
    proxyProductBranchRepo,
    productCategoryRepo
  );
  const byCondQuery = new GetProductByCondService(repository);

  const controller = wrapClassMethods<ProductHttpService>(new ProductHttpService({
    createHandler: createHandler,
    detailQuery: detailQuery,
    updateHandler: updateHandler,
    listQuery: listQuery,
    deleteHandler: deleteHandler,
    bycondQuery: byCondQuery,
    productBranchRepo: proxyProductBranchRepo, // demo proxy pattern
    productCategoryRepo: proxyProductCategoryRepo
  }));

  const introspect = new Introspect(config.rpc.userRPC);

  const verifyGlobal = new VerifyGlobalCommand(introspect);

  const router = Router();

  router.post(
    "/products",
    authGlobalMiddleware(verifyGlobal),
    roleHandlingGlobalMiddleware([UserRole.BRANCH, UserRole.ADMIN]),
    controller.createAPI
  );
  router.get("/products", controller.listAPI);
  router.get("/products/by", controller.byCondAPI);
  router.get("/products/:id", controller.detailAPI);
  router.patch(
    "/products/:id",
    authGlobalMiddleware(verifyGlobal),
    roleHandlingGlobalMiddleware([UserRole.BRANCH, UserRole.ADMIN]),
    controller.updateAPI
  );
  router.delete(
    "/products/:id",
    authGlobalMiddleware(verifyGlobal),
    roleHandlingGlobalMiddleware([UserRole.BRANCH, UserRole.ADMIN]),
    controller.deleteAPI
  );


  // RPC 
  const rpcProductRepository = new RPCProductRepository(sequelize, modelProductName)
  const rpcProductService = wrapClassMethods(new ProductRPCService(rpcProductRepository)) 

  router.get("/rpc/products/:id", rpcProductService.getByIdRPC)
  router.get("/rpc/products", rpcProductService.getbylistRPC)
  router.get("/rpc/products/by", rpcProductService.getByCondRPC)
  return router;
};
