import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, modelProductName } from "./repository/mysql/dto";
import {
  ProductCommandRepository,
  ProductQueryRepository,
  ProductRepository,
} from "./repository/mysql/repo";
import { CreateProductService } from "./usecase/create";
import { ProductHttpService } from "./Infrastructure/transport/http-service";
import { UpdateProductService } from "./usecase/update";
import { DeleteProductService } from "./usecase/delete";
import { ProductDetailService } from "./usecase/detail";
import { ListProductService } from "./usecase/list";
import { GetProductByCondService } from "./usecase/bycond";
import {
  ProxyProductBranchRopository,
  RPCProductBranchRopository,
  RPCProductCategoryRopository,
} from "./repository/rpc-repository";
import { config } from "../../share/component/config";

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
  const proxyProductBranchRepo = new ProxyProductBranchRopository(
    productBranchRepo
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
  const listQuery = new ListProductService(repository);
  const byCondQuery = new GetProductByCondService(repository);

  const controller = new ProductHttpService(
    createHandler,
    detailQuery,
    updateHandler,
    listQuery,
    deleteHandler,
    byCondQuery,
    // productBranchRepo,
    proxyProductBranchRepo, // demo proxy pattern
    productCategoryRepo
  );

  const router = Router();

  router.post("/products", controller.createAPI);
  router.get("/products", controller.listAPI);
  router.get("/products/by", controller.byCondAPI);
  router.get("/products/:id", controller.detailAPI);
  router.patch("/products/:id", controller.updateAPI);
  router.delete("/products/:id", controller.deleteAPI);
  return router;
};
