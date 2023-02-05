import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { Department } from "../../../domain/entities/Department";
import { DepartmentRepository } from "../../../domain/Repositories/DepartmentRepository";

export class GetAllDepartmentsUseCase {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  get = async (): Promise<Department[]> => {
    const cities: Department[] = await this.departmentRepository.getAll();
    if (this.departmentRepository.error())
      throw new DataBaseException(this.departmentRepository.getErrors());
    return cities;
  };
}