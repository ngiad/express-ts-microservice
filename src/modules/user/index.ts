import { Router } from "express";
import { Sequelize } from "sequelize";
import {
  init,
  modelUserName,
} from "./infrastructure/persistence/sequelize/user.model";
import {
  RPCUserRepository,
  UserCommandRepository,
  UserQueryRepository,
  UserRepository,
} from "./infrastructure/persistence/repositories/user.repositories";
import { UserCreateCommand } from "./application/commands/UserCreate.command";
import { BcryptService } from "./infrastructure/security/bcrypt.service";
import { UserUpdateCommand } from "./application/commands/userUpdate";
import { UserDeleteCommand } from "./application/commands/userDelete.command";
import { UserListQuery } from "./application/queries/list.query";
import { ProxyUserDetailQuery, UserDetailQuery } from "./application/queries/detail.query";
import { UserByCondQuery } from "./application/queries/bycond.query";
import { UserHttpService } from "./infrastructure/transport/http/controllers/user.controller";
import { LoginCommand } from "./application/commands/login.command";
import { JwtService } from "./infrastructure/security/token.service";
import { config } from "../../share/component/config";
import { RegisterCommand } from "./application/commands/register.command";
import { VerifyTokenCommand } from "./application/commands/verifyToken.command";
import {
  authMiddleware,
  roleHandlingMiddleware,
} from "./infrastructure/transport/http/middleware";
import { UserRole } from "./application/dto";
import { RPCUserService } from "./infrastructure/transport/rpc";
import { wrapClassMethods } from "../../share/utils/wrapClassMethods";

export const setupUserModule = (sequelize: Sequelize) => {
  init(sequelize);
  const bcryptService = new BcryptService();
  const jwtService = new JwtService(config.secretKey, "7d");
  const queryueryRepo = new UserQueryRepository(sequelize, modelUserName);
  const commandRepo = new UserCommandRepository(sequelize, modelUserName);

  const repository = new UserRepository(queryueryRepo, commandRepo);
  // command query pattenr
  // command
  const createHandler = new UserCreateCommand(repository, bcryptService);
  const updateHandler = new UserUpdateCommand(repository);
  const deleteHandler = new UserDeleteCommand(repository);

  // query
  const detailQuery = new UserDetailQuery(repository);
  const listQuery = new UserListQuery(repository);
  const byCondQuery = new UserByCondQuery(repository);

  const proxyDetailQuery = new ProxyUserDetailQuery(detailQuery)

  const login = new LoginCommand(repository, bcryptService, jwtService);
  const resister = new RegisterCommand(repository, bcryptService, jwtService);

  const verifyToken = new VerifyTokenCommand(repository, jwtService);

  const controller = wrapClassMethods<UserHttpService>(new UserHttpService({
    createHandler: createHandler,
    detailQuery: proxyDetailQuery,
    updateHandler: updateHandler,
    listQuery: listQuery,
    deleteHandler: deleteHandler,
    bycondQuery: byCondQuery,
    login: login,
    resister: resister
  }));
  
  const router = Router();

  router.post("/auth/login", controller.loginAPI);
  router.post("/auth/resister", controller.registerAPI);
  router.post(
    "/users",
    authMiddleware(verifyToken),
    roleHandlingMiddleware([UserRole.ADMIN]),
    controller.createAPI
  );
  router.get("/users", controller.listAPI);
  router.get("/users/by", controller.byCondAPI);
  router.get("/users/:id", controller.detailAPI);
  router.patch(
    "/users/:id",
    authMiddleware(verifyToken),
    roleHandlingMiddleware([UserRole.ADMIN, UserRole.BRANCH, UserRole.USER]),
    controller.updateAPI
  );
  router.delete(
    "/users/:id",
    authMiddleware(verifyToken),
    roleHandlingMiddleware([UserRole.ADMIN, UserRole.BRANCH, UserRole.USER]),
    controller.deleteAPI
  );

  // rpc
  const rPCUserRepository = new RPCUserRepository(sequelize, modelUserName);
  const rpcUserService = wrapClassMethods<RPCUserService>(new RPCUserService(rPCUserRepository, verifyToken));

  router.post("/rpc/verify", rpcUserService.verifytoken);

  return router;
};
