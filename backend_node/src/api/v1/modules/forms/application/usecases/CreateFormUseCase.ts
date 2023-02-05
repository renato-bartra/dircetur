import { LondgeLogin } from "../../../londges/domain/entities/LondgeLogin";
import { LondgeRepository } from "../../../londges/domain/repositories/LondgeRepository";
import { DataBaseException } from "../../../shared/domain/exeptions/DataBaseException";
import { DataValidationException } from "../../../shared/domain/exeptions/DataValidationException";
import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { SMTPException } from "../../../shared/domain/exeptions/SMTPException";
import { SMTPManager } from "../../../shared/domain/repositories/SMTPManager";
import { ValidatorManager } from "../../../shared/domain/repositories/ValidatorManager";
import { FormListener } from "../../domain/entities";
import { ExistsFormException } from "../../domain/exceptions/ExistsFormException";
import { PDFException } from "../../domain/exceptions/PDFException";
import { FormsRepository } from "../../domain/repositories/FormsRepository";
import { PDFManager } from "../../domain/repositories/PDFManager";
import { FormExistsByDate } from "../../domain/services/FormExistsByDate";

export class CreateFormUseCase {
  private readonly formExists: FormExistsByDate;
  constructor(
    private readonly formRepo: FormsRepository,
    private readonly pdfManager: PDFManager,
    private readonly smtpManager: SMTPManager,
    private readonly validatorManager: ValidatorManager,
    private readonly LondgeRepo: LondgeRepository
  ) {
    this.formExists = new FormExistsByDate(this.formRepo);
  }

  create = async (form: FormListener): Promise<boolean> => {
    // Validate form data 
    await this.validatorManager.validate(form);
    if (this.validatorManager.error())
      throw new DataValidationException(this.validatorManager.getErrors()); 
    // Search for londge date
    const londge: LondgeLogin | null = 
      await this.LondgeRepo.getByEmail(form.email);
    if (londge === null)
      throw new EntityNotFoundException();
    if (this.LondgeRepo.error())
      throw new DataBaseException(this.LondgeRepo.getError());
    // Get Month of form
    const month = this.pdfManager.getMounth(form.documented_at);
    // Verify if exist form by date and londge
    const existsForm: boolean = await this.formExists.verify(londge.ruc, form.documented_at);
    if (existsForm)
      throw new ExistsFormException(form.trade_name, month);
    // Create pdf
    const pdfFilePath: string = await this.pdfManager.create(londge.id, form);
    if (this.pdfManager.error())
      throw new PDFException(this.pdfManager.getError());
    // Save form
    const formCeated: boolean = await this.formRepo.create(form, londge.id); 
    if (this.formRepo.error())
      throw new DataBaseException(this.formRepo.getError()); 
    if (!formCeated) 
      throw new DataBaseException(this.formRepo.getError());
    // create tranporter smtp
    const transporter = await this.smtpManager.createTransporter();
    if (this.smtpManager.error())
      throw new SMTPException(this.smtpManager.getErrors());
    // Create mail template for download form
    this.smtpManager.setDownloadFormMailTemplate(londge.trade_name, month);
    // Send email
    await this.smtpManager.sendMailWithDocument(
      transporter,
      'rbr1594@gmail.com',
      form.trade_name,
      'Gracias por enviar el formulario mesual de turismo',
      pdfFilePath,
      month
    );
    // Delete pdf
    const deleteForm: boolean = await this.pdfManager.delete(londge.id);
    if (this.pdfManager.error() && !deleteForm)
      throw new PDFException(this.pdfManager.getError());
    return true;
  }
}
