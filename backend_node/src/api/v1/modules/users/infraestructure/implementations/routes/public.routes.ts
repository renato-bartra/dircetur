import { Request, Response, Router } from "express";
import { IResponseObject } from "../../../../shared/domain/repositories/IResponseObject";
import { UserController } from "../../../application/controllers";

export class UsersPublicRoutes {
  private readonly router: Router = Router();
  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    const userController: UserController = new UserController();
    this.router.post("/login", async function (req: Request, res: Response) {
      const responseObject: IResponseObject = await userController.login(
        req.body.email,
        req.body.password
      );
      return res.status(responseObject.code).json(responseObject);
    });
  };

  public getRoutes = (): Router => {
    return this.router;
  };
}
