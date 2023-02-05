import { z, ZodError } from "zod";
import { IErrorObject } from "../../../../shared/domain/repositories/IErrorObject";
import { ValidatorManager } from "../../../../shared/domain/repositories/ValidatorManager";
import { Londge } from "../../../domain/entities/Londge";

export class ZodLondgeValidator implements ValidatorManager {
  private errorValidator: boolean = false;
  private errors: IErrorObject[] = [];
  
  validate = async (user: object): Promise<object | null> => {
    // Inicializa las validaciones regex
    const regex_alphanum: RegExp = new RegExp(/^[a-zA-Z0-9\sáéíóúñäëïöüÑ\º\·\#\~\$\%\&\/\(\)\ª\@\.\:\,\;\-\_\+\*]*$/, 'i');
    const regex_name: RegExp = new RegExp(/^[a-zA-Z\sáéíóúñäëïöüÑ]*$/, 'i');
    const regex_ruc: RegExp = new RegExp('^[0-9]*$');
    const regex_latitude: RegExp = new RegExp('^\-[0-9]{1}(\.[0-9]{7})?$');
    const regex_longitude: RegExp = new RegExp('^\-[0-9]{2}(\.[0-9]{7})?$');
    const regex_certificate: RegExp = new RegExp(/^[a-zA_Z0-9\s\-\_\.\:]*$/)
    // inicializa el exquema de zod
    const userSchema: z.ZodSchema<Londge> = z.object({
      id: z.number(),
      city_id: z.number(),
      clase_id: z.number(),
      password: z.string(),
      email: z.string().email({message:"El email no tiene el formato requedido, ejmp: ejemplo@ejemplo.com"}),
      trade_name: z.string().regex(regex_alphanum, {message:"El nombre comercial solo debe contener letras, números y los caracteres º·#~$%&/()ª@.:,;-_+*"}).max(255),
      legal_name: z.string().regex(regex_alphanum, {message:"El nombre legal solo debe contener letras, números y los caracteres º·#~$%&/()ª@.:,;-_´*"}).max(255),
      legal_representative: z.string().regex(regex_name, {message: "El nombre del representante legal solo debe contener letras"}),
      certificate: z.string().regex(regex_certificate, {message:"El número de certificado solo debe contener números, letras y los carateres especiales -_.:"}).max(13, {message: 'El certificado tiene un maximo de 13 difitos'}),
      ruc: z.number().positive().gt(11, {message:"El RUC debe solo debe contener 11 digitos"}),
      stars: z.number().nonpositive().lte(1),
      street: z.string().regex(regex_alphanum, {message:"La dirección solo debe contener letras, números y los caracteres º·#~$%&/()ª@.:,;-_+*"}),
      phone: z.string().regex(regex_ruc, {message:"El telefono solo debe contener números"}).length(9, {message:"El telefono solo debe solo debe contener 9 digitos"}),
      latitude: z.string().regex(regex_latitude, {message: "La latitud solo debe contener un numero negativo ejemp: -6,1234567"}).nullable(),
      longitude: z.string().regex(regex_longitude,{message: "La longitud solo debe contener un numero negativo ejemp: -10,1234567"}).nullable(),
      web_page: z.string().url().nullable(),
      reservation_email: z.string().email({message:"El email para reservaciónes no tiene el formato requedido, ejmp: ejemplo@ejemplo.com"}).nullable(),
    });
    // Validate
    try {
      userSchema.parse(user)
      this.errorValidator = false;
      return user;
    } catch (error) {
      this.errorValidator = true;
      if (error instanceof ZodError) {
        const errors = error.formErrors;
        Object.entries(errors.fieldErrors).forEach(([key, value], i) => {
          if(this.errors[i] === undefined) this.errors[i] = {attribute: '', message:''}
          this.errors[i].attribute = key.toString();
          this.errors[i].message = value.toString();
        })
      }
      return null;
    }
  }

  error = (): boolean => this.errorValidator;
  getErrors = (): IErrorObject[] => this.errors;
}