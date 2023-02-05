import { Request, Response, Router } from "express";
import VerifyTokenMiddleware from "../../../../../middlewares/VerifyToken";
import { IResponseObject } from "../../../../../modules/shared/domain/repositories/IResponseObject";
import {
  CityController,
  CountryController,
  DepartmentController,
} from "../../../application/controllers";

export class LocationPrivateRoutes {
  private readonly router: Router = Router();
  constructor() {
    this.initRoutes();
  }

  private initRoutes = (): void => {
    const cityController: CityController = new CityController();
    const countryController: CountryController = new CountryController();
    const departmentController: DepartmentController =
      new DepartmentController();
    let responseObject: IResponseObject = {code:0, message:'', body:[]};
    // init middleware send roles 
    this.router.use(VerifyTokenMiddleware(['user', 'londge']));
    // Init routes
    this.router.get('/departments', async function (req:Request, res: Response) {
      responseObject = await departmentController.getAll();
      return res.status(responseObject.code).json(responseObject);
    });
    this.router.get('/departments/:id', async function (req:Request, res: Response) {
      responseObject = await departmentController.getById(Number(req.params.id));
      return res.status(responseObject.code).json(responseObject);
    });
    this.router.get('/cities', async function (req:Request, res: Response) {
      responseObject = await cityController.getAll();
      return res.status(responseObject.code).json(responseObject);
    });
    this.router.get('/cities/:id', async function (req:Request, res: Response) {
      responseObject = await cityController.getById(Number(req.params.id));
      return res.status(responseObject.code).json(responseObject);
    });
    this.router.get('/countries', async function (req:Request, res: Response) {
      responseObject = await countryController.getAll();
      return res.status(responseObject.code).json(responseObject);
    });
    this.router.get('/countries/:id', async function (req:Request, res: Response) {
      responseObject = await countryController.getById(Number(req.params.id));
      return res.status(responseObject.code).json(responseObject);
    });
  };

  getRoutes = (): Router => this.router 
}
