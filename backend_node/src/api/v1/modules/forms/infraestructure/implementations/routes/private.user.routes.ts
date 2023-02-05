import { Request, Response, Router } from "express";
import VerifyTokenMiddleware from "../../../../../middlewares/VerifyToken";
import { IResponseObject } from "../../../../shared/domain/repositories/IResponseObject";
import { FormController } from "../../../application/controllers/FormController";

export class FormsPrivateUserRoutes {
  private readonly router: Router = Router()
  constructor(){
    this.initRoutes();
  }

  private initRoutes = (): void => {
    const formController = new FormController();
    let responseObject: IResponseObject = {code:0, message:'', body:[]}
    // midleware for only londge access
    this.router.use(VerifyTokenMiddleware(['user']));
    // init routes
    this.router.get('/get-by-date', async function (req: Request, res: Response) {
      const [start_date, end_date] = req.body;
      responseObject = await formController.getAllByDate(start_date, end_date);
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
    this.router.delete('/:id', async function(req:Request, res: Response) {
      const form_id = Number(req.params.id);
      responseObject = await formController.delete(form_id);
      res.status(responseObject.code).json(responseObject);
    })
  }

  getRoutes = (): Router => this.router;
}