import { DataBaseException } from "../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { FormsLondge } from "../../domain/entities";
import { FormsRepository } from "../../domain/repositories/FormsRepository";

export class GetAllByLondgeFormsUseCase {
  constructor(private readonly formRepo: FormsRepository) {}

  get = async (londge_id: number): Promise<FormsLondge[]> => {
    const forms: FormsLondge[] | null = await this.formRepo.getAllByLondge(londge_id);
    if (this.formRepo.error()) 
      throw new DataBaseException(this.formRepo.getError());
    if (forms === null)
      throw new EntityNotFoundException();
    return forms;
  }
}
