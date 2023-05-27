import { DataBaseException } from "../../../shared/domain/exeptions/DataBaseException";
import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { Chapter2 } from "../../domain/entities";
import { FormsRepository } from "../../domain/repositories/FormsRepository";

export class GetLastChapter2ByLondgeUseCase {
  constructor(private readonly formRepo: FormsRepository) {}

  get = async (ruc: number): Promise<Chapter2> => {
    const chapter2: Chapter2 | null =
      await this.formRepo.getLastChapter2ByLondge(ruc);
    if (this.formRepo.error())
      throw new DataBaseException(this.formRepo.getError());
    if (chapter2 === null) throw new EntityNotFoundException();
    return chapter2;
  };
}
