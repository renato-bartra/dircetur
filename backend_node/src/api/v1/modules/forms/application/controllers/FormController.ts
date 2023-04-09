import { LondgeRepository } from "../../../londges/domain/repositories/LondgeRepository";
import { MySQLLondgeRepository } from "../../../londges/infraestructure/implementations/MySQL/MySQLLondgeRepository";
import { DataValidationException } from "../../../shared/domain/exeptions/DataValidationException";
import { EntityNotFoundException } from "../../../shared/domain/exeptions/EntityNotFoundException";
import { SMTPException } from "../../../shared/domain/exeptions/SMTPException";
import { IResponseObject } from "../../../shared/domain/repositories/IResponseObject";
import { SMTPManager } from "../../../shared/domain/repositories/SMTPManager";
import { ValidatorManager } from "../../../shared/domain/repositories/ValidatorManager";
import { NodeMailerManager } from "../../../shared/infraestructure/implementations/NodeMailer/NodeMailerManager";
import { Chapter6, FormListener, FormsListener, FormsLondge } from "../../domain/entities";
import { ExistsFormException } from "../../domain/exceptions/ExistsFormException";
import { PDFException } from "../../domain/exceptions/PDFException";
import { DateValidatorManager } from "../../domain/repositories/DateValidatorManager";
import { FormsRepository } from "../../domain/repositories/FormsRepository";
import { PDFManager } from "../../domain/repositories/PDFManager";
import { MySQLFormRepositori } from "../../infraestructure/implementations/MySQL/MySQLFormRepository";
import { PDFLibManager } from "../../infraestructure/implementations/PDFLib/PDFLibManager";
import { TSDatevalidatorManager } from "../../infraestructure/implementations/TSDateValidator/TSDateValidatorManager";
import { ZodFormManager } from "../../infraestructure/implementations/Zod/ZodFormManager";
import { CreateFormUseCase } from "../usecases/CreateFormUseCase";
import { DeleteFormUseCase } from "../usecases/DeleteFormUseCase";
import { GetAllByLondgeFormsUseCase } from "../usecases/GetAllByLondgeFormsUseCase";
import { GetByDateFormsUseCase } from "../usecases/GetByDateFormsUseCase";
import { GetByIdFormUseCase } from "../usecases/GetByIdFormUseCase";
import { GetLastChapter6ByLondgeUseCase } from "../usecases/GetLastChapter6ByLondgeUseCase";

export class FormController {
  private data: IResponseObject = { code: 0, message: "", body: [] };
  private readonly formRepo: FormsRepository = new MySQLFormRepositori();
  private readonly londgeRepo: LondgeRepository = new MySQLLondgeRepository();
  private readonly validatorManager: ValidatorManager = new ZodFormManager(); 
  private readonly pdfManager: PDFManager = new PDFLibManager();
  private readonly dateValidator: DateValidatorManager = new TSDatevalidatorManager();
  private readonly smtpManager: SMTPManager = new NodeMailerManager();

  /* -------------------------------------------------------------------------- */
  /*                            Get All Forms By Date                           */
  /* -------------------------------------------------------------------------- */
  getAllByDate = async (start_date: string, end_date:string): Promise<IResponseObject> => {
    const getByDate = new GetByDateFormsUseCase(this.formRepo, this.dateValidator);
    try {
      const forms: FormsListener[] = await getByDate.get(start_date, end_date);
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: forms,
      };
    } catch (error) {
      if (error instanceof DataValidationException) {
        this.data = {
          code: 400,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: Los sentimos hubo un error en el servidor`,
          body: [],
        };
      }
    }
    return this.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                         Get list forms By Londge id                        */
  /* -------------------------------------------------------------------------- */
  getAllByLondge = async (londge_id: number): Promise<IResponseObject> => {
    const getByLondge = new GetAllByLondgeFormsUseCase(this.formRepo);
    try {
      const forms: FormsLondge[] = await getByLondge.get(londge_id);
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: forms,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        this.data = {
          code: 404,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: Los sentimos hubo un error en el servidor`,
          body: [],
        };
      }
    }
    return this.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                               Get Form By Id                               */
  /* -------------------------------------------------------------------------- */
  getById = async (id: number): Promise<IResponseObject> => {
    const getById = new GetByIdFormUseCase(this.formRepo);
    try {
      const form: FormListener = await getById.get(id);
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: form,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        this.data = {
          code: 404,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: Los sentimos hubo un error en el servidor`,
          body: [],
        };
      }
    }
    return this.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                       Get Last Chapter 6 by londge Id                      */
  /* -------------------------------------------------------------------------- */
  getLastChapter6 = async (ruc: number): Promise<IResponseObject> => {
    const getLast = new GetLastChapter6ByLondgeUseCase(this.formRepo);
    try {
      const chapter6: Chapter6 = await getLast.get(ruc);
      this.data = {
        code: 200,
        message: "un gran poder conlleva una gran responsabilidad",
        body: chapter6,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        this.data = {
          code: 404,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: Los sentimos hubo un error en el servidor`,
          body: [],
        };
      }
    }
    return this.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                               Create new form                              */
  /* -------------------------------------------------------------------------- */
  create = async (form: FormListener): Promise<IResponseObject> => {
    const getLast = new CreateFormUseCase(
      this.formRepo, 
      this.pdfManager,
      this.smtpManager,
      this.validatorManager,
      this.londgeRepo
    );
    try {
      await getLast.create(form);
      this.data = {
        code: 200,
        message: 
          "El formulario fue creado, podrá ver el formulario en su bandeja de entrada de su correo electrónico",
        body: [],
      };
    } catch (error) {
      console.log(error)
      if (error instanceof DataValidationException) {
        return this.data = {
          code: 400,
          message: error.message,
          body: error.getErrors(),
        };
      }
      if (error instanceof EntityNotFoundException) {
        return this.data = {
          code: 404,
          message: error.message,
          body: [],
        };
      }
      if (error instanceof ExistsFormException) {
        return this.data = {
          code: 405,
          message: error.message,
          body: [],
        };
      }
      if (error instanceof PDFException) {
        return this.data = {
          code: 503,
          message: error.message,
          body: [],
        };
      }
      if (error instanceof SMTPException) {
        return this.data = {
          code: 506,
          message: error.message,
          body: [],
        };
      }
      this.data = {
        code: 500,
        message: `Server error: Los sentimos hubo un error en el servidor`,
        body: [],
      };
    }
    return this.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Delete form                                */
  /* -------------------------------------------------------------------------- */
  delete = async (id: number): Promise<IResponseObject> => {
    const deleteForm = new DeleteFormUseCase(this.formRepo);
    try {
      await deleteForm.delete(id);
      this.data = {
        code: 200,
        message: "El formulario fue desabilitado",
        body: [],
      };
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        this.data = {
          code: 404,
          message: error.message,
          body: [],
        };
      } else {
        this.data = {
          code: 500,
          message: `Server error: Los sentimos hubo un error en el servidor`,
          body: [],
        };
      }
    }
    return this.data;
  }
}