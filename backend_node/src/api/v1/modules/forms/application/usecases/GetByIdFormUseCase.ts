import { DataBaseException } from "../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { FormListener } from "../../domain/entities";
import { FormsRepository } from "../../domain/repositories/FormsRepository";

export class GetByIdFormUseCase {
  constructor(private readonly formRepo: FormsRepository) {}

  get = async (id: number): Promise<FormListener> => {
    const form: FormListener|null = await this.formRepo.getById(id);
    if (this.formRepo.error())
      throw new DataBaseException(this.formRepo.getError());
    if (form === null)
      throw new EntityNotFoundException();
    return form;
  }
}
