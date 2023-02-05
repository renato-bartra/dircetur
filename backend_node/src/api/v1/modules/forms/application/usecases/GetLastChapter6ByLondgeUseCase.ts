import { DataBaseException } from "../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { Chapter6 } from "../../domain/entities";
import { FormsRepository } from "../../domain/repositories/FormsRepository";

export class GetLastChapter6ByLondgeUseCase {
  constructor(private readonly formRepo: FormsRepository) {}

  get = async (ruc: number): Promise<Chapter6> => {
    const chapter6: Chapter6 | null =
      await this.formRepo.getLastChapter6ByLondge(ruc, '1999-01-01');
    if (this.formRepo.error())
      throw new DataBaseException(this.formRepo.getError());
    if (chapter6 === null) throw new EntityNotFoundException();
    return chapter6;
  };
}
