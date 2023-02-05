import { DataBaseException } from "../../../shared/domain/exeptions/DataBaseException";
import { DataValidationException } from "../../../shared/domain/exeptions/DataValidationException";
import { FormsListener } from "../../domain/entities";
import { DateValidatorManager } from "../../domain/repositories/DateValidatorManager";
import { FormsRepository } from "../../domain/repositories/FormsRepository";

export class GetByDateFormsUseCase {
  constructor(
    private readonly formRepo: FormsRepository,
    private readonly dateValidatorManager: DateValidatorManager,
  ) {}

  get = async (start_date: string, end_date: string): Promise<FormsListener[]> => {
    // First validate dates format like 'YYYY-mm-dd'
    await this.dateValidatorManager.validate({start_date: start_date, end_date: end_date});
    if(this.dateValidatorManager.error())
      throw new DataValidationException(this.dateValidatorManager.getError());
    // Then get all forms
    const forms: FormsListener[] = await this.formRepo.getAllByDate(start_date, end_date);
    if (this.formRepo.error())
      throw new DataBaseException(this.formRepo.getError());
    return forms;
  }
}
