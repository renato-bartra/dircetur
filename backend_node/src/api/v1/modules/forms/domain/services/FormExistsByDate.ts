import { DataBaseException } from "../../../shared/domain/exeptions/DataBaseException";
import { Chapter6 } from "../entities";
import { FormsRepository } from "../repositories/FormsRepository";

export class FormExistsByDate {
  constructor(private readonly formRepo: FormsRepository) {}

  verify = async (ruc: number, date: string): Promise<boolean> => {
    const formExists: Chapter6 | null = await this.formRepo.getLastChapter6ByLondge(
      ruc,
      date
    );
    if (this.formRepo.error())
      throw new DataBaseException(this.formRepo.getError());
    if (formExists !== null)
      return true;
    return false;
  };
}
