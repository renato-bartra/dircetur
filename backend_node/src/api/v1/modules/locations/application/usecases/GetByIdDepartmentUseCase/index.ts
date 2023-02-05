import { DataBaseException } from "../../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../../shared/domain/exeptions/EntityNotFoundException";
import { Department } from "../../../domain/entities/Department";
import { DepartmentRepository } from "../../../domain/Repositories/DepartmentRepository";

export class GetByIdDepartmentUseCase {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  get = async (id: number): Promise<Department> => {
    const department: Department | null = await this.departmentRepository.getById(id);
    if (this.departmentRepository.error())
      throw new DataBaseException(this.departmentRepository.getErrors());
    if (department === null) throw new EntityNotFoundException();
    return department;
  };
}
