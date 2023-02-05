import { DataValidationException } from "../../../shared/domain/exeptions/DataValidationException";
import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { TokenException } from "../../../shared/domain/exeptions/TokenException";
import { IResponseObject } from "../../../shared/domain/repositories/IResponseObject";
import { PasswordManager } from "../../../shared/domain/repositories/PasswordManager";
import { SharedRepository } from "../../../shared/domain/repositories/SharedRepository";
import { ValidatorManager } from "../../../shared/domain/repositories/ValidatorManager";
import { JWTManager } from "../../../shared/infraestructure/implementations/JWT/JWTManager";
import { MySQLSharedRepositori } from "../../../shared/infraestructure/implementations/MySQL/MySQLSharedRepositori";
import { PasswordBcrypt } from "../../../shared/infraestructure/implementations/PasswordBcript";
import { Londge } from "../../domain/entities/Londge";
import { LondgeListener } from "../../domain/entities/LondgeListener";
import { LondgeAlreadyExistException } from "../../domain/exceptions/LondgeAlreadyExistException";
import { LondgeRepository } from "../../domain/repositories/LondgeRepository";
import { MySQLLondgeRepository } from "../../infraestructure/implementations/MySQL/MySQLLondgeRepository";
import { ZodLondgeValidator } from "../../infraestructure/implementations/Zod/ZodLondgeManager";
import {
  LondgeCreatorUseCase,
  LondgeDeleteUseCase,
  LondgeGetAllUseCase,
  LondgeGetByIdUseCase,
  LondgeLoginUseCase,
  LondgeUpdateUseCase,
} from "../usecases";

export class LondgeController {
  private data: IResponseObject = { code: 0, message: "", body: [] };
  private readonly londgeRepo: LondgeRepository = new MySQLLondgeRepository();
  private readonly sharedRepo: SharedRepository = new MySQLSharedRepositori();
  private readonly tokenManager: JWTManager = new JWTManager();
  private readonly passwordManager: PasswordManager = new PasswordBcrypt(11);
  private readonly validatorManager: ValidatorManager = new ZodLondgeValidator();

  /* -------------------------------------------------------------------------- */
  /*                               Get All Londges                              */
  /* -------------------------------------------------------------------------- */
  getAll = async (): Promise<IResponseObject> => {
    const getAllUseCase = new LondgeGetAllUseCase(this.londgeRepo);
    try {
      const londges: LondgeListener[] = await getAllUseCase.get();
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: londges,
      };
    } catch (error) {
      this.data = {
        code: 500,
        message: `Server error: Los sentimos hubo un error en el servidor`,
        body: [],
      };
    }
    return this.data;
  };
  /* -------------------------------------------------------------------------- */
  /*                                  Get by id                                 */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<IResponseObject> => {
    const getByIdUseCase = new LondgeGetByIdUseCase(this.londgeRepo);
    try {
      const londge: LondgeListener = await getByIdUseCase.get(id);
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: londge,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        this.data = {
          code: 404,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: ${error}`,
          body: [],
        };
      }
    }
    return this.data;
  };
  /* -------------------------------------------------------------------------- */
  /*                                Create londge                               */
  /* -------------------------------------------------------------------------- */
  create = async (londge: Londge): Promise<IResponseObject> => {
    const createUseCase = new LondgeCreatorUseCase(
      this.londgeRepo,
      this.sharedRepo,
      this.passwordManager,
      this.validatorManager
    );
    try {
      const response: LondgeListener = await createUseCase.create(londge);
      this.data = {
        code: 200,
        message: "El Hospedaje se creó correctamente",
        body: response,
      };
    } catch (error) {
      if (error instanceof DataValidationException) {
        this.data = {
          code: 400,
          message: error.message,
          body: error.getErrors(),
        };
      } else if (error instanceof LondgeAlreadyExistException) {
        this.data = { code: 400, message: error.message, body: [] };
      } else {
        this.data = {
          code: 500,
          message: `Server error: ${error}`,
          body: [],
        };
      }
    }
    return this.data;
  };
  /* -------------------------------------------------------------------------- */
  /*                                Update Londge                               */
  /* -------------------------------------------------------------------------- */
  update = async (id: number, londge: Londge): Promise<IResponseObject> => {
    const updateUseCase = new LondgeUpdateUseCase(
      this.londgeRepo,
      this.validatorManager
    );
    try {
      const response: boolean = await updateUseCase.update(id, londge);
      this.data = {
        code: 200,
        message: "El hospedaje se actualizó correctamente",
        body: londge
      }
    } catch (error) {
      if (error instanceof DataValidationException) {
        this.data = {
          code: 400,
          message: error.message,
          body: error.getErrors(),
        };
      } else if (error instanceof EntityNotFoundException) {
        this.data = {
          code: 404,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: ${error}`,
          body: [],
        };
      }
    }
    return this.data;
  };
  /* -------------------------------------------------------------------------- */
  /*                                Delete Londge                               */
  /* -------------------------------------------------------------------------- */
  delete = async (id: number): Promise<IResponseObject> => {
    const delterUseCase = new LondgeDeleteUseCase(this.londgeRepo);
    try {
      await delterUseCase.delete(id);
      this.data = {
        code: 200,
        message: "El hospedaje se eliminó correctamente",
        body: { success: true },
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        this.data = {
          code: 404,
          message: error.message,
          body: { success: false },
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: ${error}`,
          body: [],
        };
      }
    }
    return this.data;
  };
  /* -------------------------------------------------------------------------- */
  /*                                    Login                                   */
  /* -------------------------------------------------------------------------- */
  login = async (email:string, password: string): Promise<IResponseObject> => {
    const loginUseCase = new LondgeLoginUseCase(
      this.londgeRepo,
      this.passwordManager,
      this.tokenManager
    )
    try {
      const [token, londge] = await loginUseCase.login(email, password);
      this.data = {
        code: 200,
        message: token,
        body: londge
      }
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        this.data = {
          code: 404,
          message: "El email o la contraseña son incorrectos",
          body: [],
        };
      } else if (error instanceof TokenException) {
        this.data = {
          code: 400,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: ${error}`,
          body: [],
        };
      }
    }
    return this.data;
  }
}
