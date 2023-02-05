import { Request, Response, Router } from "express";
import VerifyTokenMiddleware from "../../../../../middlewares/VerifyToken";
import { IResponseObject } from "../../../../shared/domain/repositories/IResponseObject";
import { LondgeController } from "../../../application/controller";

export class LondgePrivateRotes {
  private readonly router: Router = Router()
  constructor(){
    this.initRoutes();
  }

  private initRoutes = (): void => {
    const longeController = new LondgeController();
    let responseObject: IResponseObject = {code:0, message:'', body:[]}
    // midleware for only users access
    this.router.use(VerifyTokenMiddleware(['user']));
    // init routes
    this.router.route('/')
      .get(async function(req:Request, res: Response) {
        responseObject = await longeController.getAll();
        return res.status(responseObject.code).json(responseObject);
      })
      .post(async function(req:Request, res: Response) {
        responseObject = await longeController.create(req.body);
        return res.status(responseObject.code).json(responseObject);
      });
    this.router.route('/:id')
      .get(async function(req:Request, res: Response) {
        const id = Number(req.params.id);
        responseObject = await longeController.getById(id);
        return res.status(responseObject.code).json(responseObject);
      })
      .put(async function(req:Request, res: Response) {
        const id = Number(req.params.id);
        responseObject = await longeController.update(id, req.body);
        return res.status(responseObject.code).json(responseObject);
      });
  }

  getRoutes = (): Router => this.router;
}