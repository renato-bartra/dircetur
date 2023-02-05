import { Request, Response, Router } from "express";
import { SharedController } from "../../../application/controllers/SharedController";
import { IResponseObject } from "../../../domain/repositories/IResponseObject";

export class SharedPublicRoutes {
  private readonly router: Router = Router();
  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    const sharedController: SharedController = new SharedController();
    this.router.put(
      "/reset-password",
      async function (req: Request, res: Response) {
        const responseObject:IResponseObject = await sharedController.resetPassword(
          req.body.token,
          req.body.password,
          req.body.confirm
        )
        return res.status(responseObject.code).json(responseObject);
      }
    );
    this.router.post(
      '/forgot-password',
      async function (req: Request, res: Response) {
        const responseObject: IResponseObject = await sharedController.forgotPass(
          req.body.email
        )
        return res.status(responseObject.code).json(responseObject);
      }
    )
  }

  getRoutes = (): Router => this.router;
}