import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { IResponseObject } from "../../../shared/domain/repositories/IResponseObject";
import { Department } from "../../domain/entities/Department";
import { DepartmentRepository } from "../../domain/Repositories/DepartmentRepository";
import { MySQLDepartmentRespository } from "../../infraestructure/implementations/MySQL/MySQLDepartmentRepository";
import { GetAllDepartmentsUseCase } from "../usecases/GetAllDepartmentsUseCase";
import { GetByIdDepartmentUseCase } from "../usecases/GetByIdDepartmentUseCase";

export class DepartmentController {
  private data: IResponseObject = { code: 0, message: "", body: [] };
  private readonly departmentRepository: DepartmentRepository =
    new MySQLDepartmentRespository();
  
  /* -------------------------------------------------------------------------- */
  /*                                   Get All                                  */
  /* -------------------------------------------------------------------------- */
  getAll = async (): Promise<IResponseObject> => {
    const getAllUseCase: GetAllDepartmentsUseCase = new GetAllDepartmentsUseCase(
      this.departmentRepository
    );
    try {
      const response: Department[] = await getAllUseCase.get();
      let cities: object[] = [];
      Object.entries(response).forEach(([key, value], i) => {
        let clase: object = {
          id: value.id,
          deparment: value.department,
        };
        cities[i] = clase;
      });
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: cities,
      };
    } catch (error) {
      this.data = {
        code: 500,
        message: `Server error: ${error}`,
        body: [],
      };
    }
    return this.data;
  };
  /* -------------------------------------------------------------------------- */
  /*                                  get by ID                                 */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<IResponseObject> => {
    const getByIdUseCase: GetByIdDepartmentUseCase = new GetByIdDepartmentUseCase(
      this.departmentRepository
    );
    try {
      const deparment: Department = await getByIdUseCase.get(id);
      this.data = {
        code: 200,
        message: '',
        body:{
          id: deparment.id,
          department: deparment.department
        }
      }
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
  };
}
