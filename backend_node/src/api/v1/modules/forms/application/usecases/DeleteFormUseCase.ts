import { DataBaseException } from "../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { FormsRepository } from "../../domain/repositories/FormsRepository";

export class DeleteFormUseCase {
  constructor(private readonly formRepo: FormsRepository) {}
  
  delete = async (id: number): Promise<boolean> => {
    const deleter: boolean = await this.formRepo.delete(id);
    if (this.formRepo.error())
      throw new DataBaseException(this.formRepo.getError());
    if (!deleter) throw new EntityNotFoundException();
    return deleter;
  };
}
