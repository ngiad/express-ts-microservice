import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { setupCategoryModule } from "./modules/category";
import { sequelize } from "./share/component/sequelize";
import { setupBranchModule } from "./modules/branch";
import { setupProductModule } from "./modules/product";
import { setupUserModule } from "./modules/user";
import { performenceMiddleware } from "./share/middleware/performance";
import { errorResponse } from "./share/utils/ErrorResponse";
import { setupCartModule } from "./modules/cart";
import { Redis, RedisPubSubService } from "./share/component/redis";
import { CART_NOTIFICATION_TO_BRANCH_CHANNEL } from "./share/events";

dotenv.config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    const app: Express = express();
    const port = process.env.PORT || 3321;
    await Redis.start(process.env.REDIS_URL || "");
    await RedisPubSubService.connect(process.env.REDIS_URL || "");

    app.use(express.json());
    app.use(performenceMiddleware)
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello World");
    })
    app.use("/v1/api", setupCategoryModule(sequelize));
    app.use("/v1/api", setupBranchModule(sequelize));
    app.use("/v1/api", setupProductModule(sequelize));
    app.use("/v1/api", setupUserModule(sequelize));
    app.use("/v1/api", setupCartModule(sequelize));


    app.use(errorResponse)


    // test subscribe
    RedisPubSubService.subscribe(CART_NOTIFICATION_TO_BRANCH_CHANNEL, (message) => {
      console.log('-------------------------------- ĐÂY LÀ subscribe MESSAGE -------------------------------');
      console.log(message);
      console.log('-------------------------------- ĐÂY LÀ subscribe MESSAGE -------------------------------');
    });

    app.listen(port, () => {
      console.log(`server is running on : http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
