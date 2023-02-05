import { Request, Response, Router } from "express";
import VerifyTokenMiddleware from "../../../../../middlewares/VerifyToken";
import { IResponseObject } from "../../../../shared/domain/repositories/IResponseObject";
import { FormController } from "../../../application/controllers/FormController";

export class FormsPrivatelondgeRoutes {
  private readonly router: Router = Router()
  constructor(){
    this.initRoutes();
  }

  private initRoutes = (): void => {
    const formController = new FormController();
    let responseObject: IResponseObject = {code:0, message:'', body:[]}
    // midleware for only londge access
    this.router.use(VerifyTokenMiddleware(['londge']));
    // init routes
    this.router.post('/', async function(req:Request, res: Response) {
      responseObject = await formController.create(req.body);
      res.status(responseObject.code).json(responseObject);
    })
    this.router.get('/:id', async function(req:Request, res: Response) {
      const form_id = Number(req.params.id);
      responseObject = await formController.getById(form_id);
      res.status(responseObject.code).json(responseObject);
    })
    this.router.get('/get-by-londge/:id', async function(req:Request, res: Response) {
      const londge_id = Number(req.params.id)
      responseObject = await formController.getAllByLondge(londge_id)
      res.status(responseObject.code).json(responseObject);
    })
    this.router.get('/last-chapter6/:ruc', async function(req:Request, res: Response) {
      const ruc = Number(req.params.id);
      responseObject = await formController.getLastChapter6(ruc);
      res.status(responseObject.code).json(responseObject);
    })
  }

  getRoutes = (): Router => this.router;
}