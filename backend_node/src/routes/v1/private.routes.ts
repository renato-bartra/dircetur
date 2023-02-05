import { Router } from "express";
import { LocationPrivateRoutes } from "../../api/v1/modules/locations/infraestructure/implementations/routes/private.routes";
import { ClasePrivateRoutes } from "../../api/v1/modules/clases/infraestructure/implementations/routes/private.routes";
import { UserPrivateRoutes } from "../../api/v1/modules/users/infraestructure/implementations/routes/private.routes";
import { LondgePrivateRotes } from "../../api/v1/modules/londges/infraestructure/implementations/routes/private.routes";
import { FormsPrivatelondgeRoutes } from "../../api/v1/modules/forms/infraestructure/implementations/routes/private.londge.routes";
import { FormsPrivateUserRoutes } from "../../api/v1/modules/forms/infraestructure/implementations/routes/private.user.routes";

export class PrivateRoutes {
  private readonly router: Router = Router();
  private readonly userRouter: UserPrivateRoutes = new UserPrivateRoutes();
  private readonly claseRouter: ClasePrivateRoutes = new ClasePrivateRoutes();
  private readonly locationRoutes: LocationPrivateRoutes = 
    new LocationPrivateRoutes();
  private readonly londgeRoutes: LondgePrivateRotes = new LondgePrivateRotes();
  private readonly formLondgeRoutes: FormsPrivatelondgeRoutes = 
    new FormsPrivatelondgeRoutes(); 
    private readonly formUserRoutes: FormsPrivateUserRoutes = 
    new FormsPrivateUserRoutes(); 

  constructor() {
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.use("/users", this.userRouter.getRoutes());
    this.router.use("/clases", this.claseRouter.getRoutes());
    this.router.use("/locations", this.locationRoutes.getRoutes());
    this.router.use('/londges', this.londgeRoutes.getRoutes());
    this.router.use("/forms", this.formLondgeRoutes.getRoutes());
    this.router.use("/forms", this.formUserRoutes.getRoutes());
  };

  public getRoutes = (): Router => {
    return this.router;
  };
}
