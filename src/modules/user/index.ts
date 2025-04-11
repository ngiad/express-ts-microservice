import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, modelUserName } from "./infrastructure/persistence/sequelize/user.model";
import {
  UserCommandRepository,
  UserQueryRepository,
  UserRepository,
} from "./infrastructure/persistence/repositories/user.repositories";
import { UserCreateCommand } from "./application/commands/UserCreate.command";
import { BcryptService } from "./infrastructure/security/bcrypt.service";
import { UserUpdateCommand } from "./application/commands/userUpdate";
import { UserDeleteCommand } from "./application/commands/userDelete.command";
import { UserListQuery } from "./application/queries/list.query";
import { UserDetailQuery } from "./application/queries/detail.query";
import { UserByCondQuery } from "./application/queries/bycond.query";
import { UserHttpService } from "./infrastructure/transport/http/controllers/user.controller";
import { LoginCommand } from "./application/commands/login.command";
import { JwtService } from "./infrastructure/security/token.service";
import { config } from "../../share/component/config";
import { RegisterCommand } from "./application/commands/register.command";

export const setupUserModule = (sequelize: Sequelize) => {
  init(sequelize);
  const bcryptService = new BcryptService();
  const jwtService = new JwtService(config.secretKey,'7d')
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


  const login = new LoginCommand(repository,bcryptService,jwtService)
  const resister = new RegisterCommand(repository,bcryptService,jwtService)  
  const controller = new UserHttpService(
    createHandler,
    detailQuery,
    updateHandler,
    listQuery,
    deleteHandler,
    byCondQuery,
    login,
    resister
  );
  const router = Router();

  router.post("/auth/login",controller.loginAPI)
  router.post("/auth/resister",controller.registerAPI)
  router.post("/users", controller.createAPI);
  router.get("/users", controller.listAPI);
  router.get("/users/by", controller.byCondAPI);
  router.get("/users/:id", controller.detailAPI);
  router.patch("/users/:id", controller.updateAPI);
  router.delete("/users/:id", controller.deleteAPI);

  // rpc


  return router;
};
