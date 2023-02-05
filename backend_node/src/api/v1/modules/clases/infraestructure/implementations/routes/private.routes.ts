import { Request, Response, Router } from "express";
import { IResponseObject } from "../../../../shared/domain/repositories/IResponseObject";
import { ClaseController } from "../../../application/controllers";
import VerifyTokenMiddleware from "../../../../../middlewares/VerifyToken";

export class ClasePrivateRoutes {
  private readonly router: Router = Router();
  constructor(){
    this.initRoutes();
  }

  private initRoutes = (): void => {
    const claseController: ClaseController = new ClaseController();
    let responseObject: IResponseObject = {code:0, message:'', body:[]};
    // Middlewares: Valida el token de usuario 
    this.router.use(VerifyTokenMiddleware(['user']));
    // Init routes for clases
    this.router.get('/', async function (req:Request, res: Response) {
      responseObject = await claseController.getAll();
      return res.status(responseObject.code).json(responseObject);
    });
    this.router.get('/:id', async function(req:Request, res: Response) {
      responseObject = await claseController.getById(Number(req.params.id));
      return res.status(responseObject.code).json(responseObject);
    })
  }

  getRoutes = (): Router => this.router;
}