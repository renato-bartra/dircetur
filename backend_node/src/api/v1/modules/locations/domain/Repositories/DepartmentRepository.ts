import { Department } from "../entities/Department";

export interface DepartmentRepository {
  getAll: () => Promise<Department[]>;
  getById: (id: number) => Promise<Department|null>;
  error: () => boolean;
  getErrors: () => string;
}