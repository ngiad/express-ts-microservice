import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { setupCategoryModule } from "./modules/category";
import { sequelize } from "./share/component/sequelize";
import { setupBranchModule } from "./modules/branch";
import { setupProductModule } from "./modules/product";
import { setupUserModule } from "./modules/user";
import { performenceMiddleware } from "./share/middleware/performance";

dotenv.config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    const app: Express = express();
    const port = process.env.PORT || 3321;

    app.use(express.json());
    app.use(performenceMiddleware)
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello World");
    })
    app.use("/v1/api", setupCategoryModule(sequelize));
    app.use("/v1/api", setupBranchModule(sequelize));
    app.use("/v1/api", setupProductModule(sequelize));
    app.use("/v1/api", setupUserModule(sequelize));


    app.listen(port, () => {
      console.log(`server is running on : http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
