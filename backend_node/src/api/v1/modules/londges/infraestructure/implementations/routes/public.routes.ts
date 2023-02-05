import { Request, Response, Router } from "express";
import { IResponseObject } from "../../../../shared/domain/repositories/IResponseObject";
import { LondgeController } from "../../../application/controller";

export class LondgePublicRoutes {
  private readonly router: Router = Router()
  constructor(){
    this.initRoutes();
  }

  private initRoutes = (): void => {
    const londgeController = new LondgeController();
    let responseObject: IResponseObject = {code:0, message:'', body:[]};
    // init routes
    this.router.post('/login', async function(req:Request, res: Response) {
      const responseObject = await londgeController.login(
        req.body.email,
        req.body.password
      );
      return res.status(responseObject.code).json(responseObject);
    })
  }

  public getRoutes = (): Router => {
    return this.router;
  };
}