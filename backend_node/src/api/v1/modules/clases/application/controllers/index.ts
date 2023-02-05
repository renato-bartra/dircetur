import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { IResponseObject } from "../../../shared/domain/repositories/IResponseObject";
import { Clase } from "../../domain/entities/Clase";
import { ClaseRepository } from "../../domain/repositories/ClaseRepository";
import { MySQLClaseRepositori } from "../../infraestructure/implementations/MySQL/MySQLClaseRepository";
import { GetAllUseCase } from "../useCases/GetAllUseCase";
import { GetByIdUseCase } from "../useCases/GetByIdUseCase";

export class ClaseController {
  private data: IResponseObject = { code: 0, message: "", body: [] };
  private readonly claseRepository: ClaseRepository = new MySQLClaseRepositori();
  /* -------------------------------------------------------------------------- */
  /*                               Get all clases                               */
  /* -------------------------------------------------------------------------- */
  getAll = async(): Promise<IResponseObject> => {
    const getAllUseCase: GetAllUseCase = new GetAllUseCase(this.claseRepository);
    try {
      const clases: Clase[] = await getAllUseCase.get();
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: clases,
      };
    } catch (error) {
      this.data = {
        code: 500,
        message: `Server error: ${error}`,
        body: [],
      };
    }
    return this.data;
  }
  /* -------------------------------------------------------------------------- */
  /*                               Get Clase by id                              */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<IResponseObject> => {
    const getByIdUseCase: GetByIdUseCase = new GetByIdUseCase(this.claseRepository);
    try {
      const clase: Clase = await getByIdUseCase.get(id);
      this.data = {
        code: 200,
        message: "",
        body: clase
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException){
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
  }
}