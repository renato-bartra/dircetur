import { z, ZodError } from "zod";
import { IErrorObject } from "../../../../shared/domain/repositories/IErrorObject";
import { ValidatorManager } from "../../../../shared/domain/repositories/ValidatorManager";
import { FormListener } from "../../../domain/entities";

export class ZodFormManager implements ValidatorManager {
  private errorListener: boolean = false;
  private errors: IErrorObject[] = [];
  validate = async (form: object): Promise<object | null> => {
    // Inicializa las validaciones regex
    const regex_alphanum: RegExp = new RegExp(/^[a-zA-Z0-9\sáéíóúñäëïöüÑ\º\·\#\~\$\%\&\/\(\)\ª\@\.\:\,\;\-\_\+\*]*$/, 'i');
    const regex_name: RegExp = new RegExp(/^[a-zA-Z\sáéíóúñäëïöüÑ]*$/, 'i');
    const regex_ruc: RegExp = new RegExp('^[0-9]*$');
    const regex_latitude: RegExp = new RegExp('^\-[0-9]{1}(\.[0-9]{7})?$');
    const regex_longitude: RegExp = new RegExp('^\-[0-9]{2}(\.[0-9]{7})?$');
    const regex_certificate: RegExp = new RegExp(/^[a-zA_Z0-9\s\-\_\.\:]*$/);
    const regex_date: RegExp = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
    // inicializa el exquema de zod
    const userSchema: z.ZodSchema<FormListener> = z.object({
      id: z.number(),
      city: z.string().regex(regex_name, {message: "La ciudad solo debe contener letras"}),
      clase: z.string().regex(regex_alphanum, {message: "La clase del hospedaje solo debe contener letras"}),
      email: z.string().email({message: "El email debe tener el formato esperado ejm: prueba@prueba.com"}),
      trade_name: z.string().regex(regex_alphanum, {message: "El nombre comercial del hospedaje solo debe contener letras, números y los caracteres º·#~$%&/()ª@.:,;-_+*"}).max(255),
      legal_name: z.string().regex(regex_alphanum, {message:"El nombre legal del hospedaje solo debe contener letras, números y los caracteres º·#~$%&/()ª@.:,;-_´*"}).max(255),
      legal_representative: z.string().regex(regex_name, {message: "El nombre del representante legal solo debe contener letras"}),
      certificate: z.string().regex(regex_certificate, {message:"El número de certificado solo debe contener números, letras y los carateres especiales -_.:"}).max(13, {message: 'El certificado tiene un maximo de 13 difitos'}),
      ruc: z.number().positive().gt(11, {message:"El RUC debe solo debe contener 11 digitos"}),
      stars: z.number().nonpositive().lte(1),
      street: z.string().regex(regex_alphanum, {message:"La dirección del hospedaje solo debe contener letras, números y los caracteres º·#~$%&/()ª@.:,;-_+*"}),
      phone: z.string().regex(regex_ruc, {message:"El telefono solo debe contener números"}).length(9, {message:"El telefono solo debe solo debe contener 9 digitos"}),
      latitude: z.string().regex(regex_latitude, {message: "La latitud solo debe contener un numero negativo ejemp: -6,1234567"}).nullable(),
      longitude: z.string().regex(regex_longitude,{message: "La longitud solo debe contener un numero negativo ejemp: -10,1234567"}).nullable(),
      web_page: z.string().url().nullable(),
      reservation_email: z.string().email({message:"El email para reservaciónes no tiene el formato requedido, ejmp: ejemplo@ejemplo.com"}).nullable(),
      documented_at: z.string().regex(regex_date, {message: "La fecha de documentación debe tener el formato requerido ejem: 1999-12-31"}),
      chapter2: z.object({
        individual: z.object({
          capability: z.object({
            bathroom: z.number(),
            nobathroom: z.number(),
            places: z.number()
          }),
          used: z.object({
            arrivals: z.number(),
            occupied: z.number(),
            overnight_stay: z.number(),
          }),
          cost: z.object({
            bathroom: z.number(),
            nobathroom: z.number()
          })
        }),
        double: z.object({
          capability: z.object({
            bathroom: z.number(),
            nobathroom: z.number(),
            places: z.number()
          }),
          used: z.object({
            arrivals: z.number(),
            occupied: z.number(),
            overnight_stay: z.number(),
          }),
          cost: z.object({
            bathroom: z.number(),
            nobathroom: z.number()
          })
        }),
        suit: z.object({
          capability: z.object({
            bathroom: z.number(),
            nobathroom: z.number(),
            places: z.number()
          }),
          used: z.object({
            arrivals: z.number(),
            occupied: z.number(),
            overnight_stay: z.number(),
          }),
          cost: z.object({
            bathroom: z.number(),
            nobathroom: z.number()
          })
        }),
        triple: z.object({
          capability: z.object({
            bathroom: z.number(),
            nobathroom: z.number(),
            places: z.number()
          }),
          used: z.object({
            arrivals: z.number(),
            occupied: z.number(),
            overnight_stay: z.number(),
          }),
          cost: z.object({
            bathroom: z.number(),
            nobathroom: z.number()
          })
        }),
        bungalows: z.object({
          capability: z.object({
            bathroom: z.number(),
            nobathroom: z.number(),
            places: z.number()
          }),
          used: z.object({
            arrivals: z.number(),
            occupied: z.number(),
            overnight_stay: z.number(),
          }),
          cost: z.object({
            bathroom: z.number(),
            nobathroom: z.number()
          })
        }),
        other: z.object({
          capability: z.object({
            bathroom: z.number(),
            nobathroom: z.number(),
            places: z.number()
          }),
          used: z.object({
            arrivals: z.number(),
            occupied: z.number(),
            overnight_stay: z.number(),
          }),
          cost: z.object({
            bathroom: z.number(),
            nobathroom: z.number()
          })
        }),
      }),
      chapter3: z.object({
        1: z.number(),
        2: z.number(),
        3: z.number(),
        4: z.number(),
        5: z.number(),
        6: z.number(),
        7: z.number(),
        8: z.number(),
        9: z.number(),
        10: z.number(),
        11: z.number(),
        12: z.number(),
        13: z.number(),
        14: z.number(),
        15: z.number(),
        16: z.number(),
        17: z.number(),
        18: z.number(),
        19: z.number(),
        20: z.number(),
        21: z.number(),
        22: z.number(),
        23: z.number(),
        24: z.number(),
        25: z.number(),
        26: z.number(),
        27: z.number(),
        28: z.number(),
        29: z.number(),
        30: z.number(),
        31: z.number()
      }),
      chapter4_1: z.object({
        arrivals: z.object({
          argentina: z.number(),
          alemania: z.number(),
          bielorusia: z.number(),
          bolivia: z.number(),
          brasil: z.number(),
          canada: z.number(),
          colombia: z.number(),
          southkorea: z.number(),
          costarica: z.number(),
          chile: z.number(),
          china: z.number(),
          ecuador: z.number(),
          usa: z.number(),
          españa: z.number(),
          francia: z.number(),
          holanda: z.number(),
          india: z.number(),
          israel: z.number(),
          italia: z.number(),
          japon: z.number(),
          mexico: z.number(),
          panama: z.number(),
          england: z.number(),
          rusia: z.number(),
          suiza: z.number(),
          turquia: z.number(),
          uruguay: z.number(),
          venezuela: z.number(),
          africa: z.number(),
          oceania: z.number(),
          america: z.number(),
          asia: z.number(),
          europe: z.number(),
        }),
        overnight_stay: z.object({
          argentina: z.number(),
          alemania: z.number(),
          bielorusia: z.number(),
          bolivia: z.number(),
          brasil: z.number(),
          canada: z.number(),
          colombia: z.number(),
          southkorea: z.number(),
          costarica: z.number(),
          chile: z.number(),
          china: z.number(),
          ecuador: z.number(),
          usa: z.number(),
          españa: z.number(),
          francia: z.number(),
          holanda: z.number(),
          india: z.number(),
          israel: z.number(),
          italia: z.number(),
          japon: z.number(),
          mexico: z.number(),
          panama: z.number(),
          england: z.number(),
          rusia: z.number(),
          suiza: z.number(),
          turquia: z.number(),
          uruguay: z.number(),
          venezuela: z.number(),
          africa: z.number(),
          oceania: z.number(),
          america: z.number(),
          asia: z.number(),
          europe: z.number(),
        })
      }),
      chapter4_2: z.object({
        arrivals: z.object({
          metropilitana: z.number(),
          lima: z.number(),
          amazonas: z.number(),
          ancash: z.number(),
          apurimac: z.number(),
          arequipa: z.number(),
          ayacucho: z.number(),
          cajamarca: z.number(),
          cusco: z.number(),
          huancavelica: z.number(),
          huanuco: z.number(),
          ica: z.number(),
          junin: z.number(),
          lalibertad: z.number(),
          lambayeque: z.number(),
          loreto: z.number(),
          madrededios: z.number(),
          moquegua: z.number(),
          pasco: z.number(),
          piura: z.number(),
          puno: z.number(),
          sanmartin: z.number(),
          tacna: z.number(),
          tumbes: z.number(),
          ucayali: z.number(),
        }),
        overnight_stay: z.object({
          metropilitana: z.number(),
          lima: z.number(),
          amazonas: z.number(),
          ancash: z.number(),
          apurimac: z.number(),
          arequipa: z.number(),
          ayacucho: z.number(),
          cajamarca: z.number(),
          cusco: z.number(),
          huancavelica: z.number(),
          huanuco: z.number(),
          ica: z.number(),
          junin: z.number(),
          lalibertad: z.number(),
          lambayeque: z.number(),
          loreto: z.number(),
          madrededios: z.number(),
          moquegua: z.number(),
          pasco: z.number(),
          piura: z.number(),
          puno: z.number(),
          sanmartin: z.number(),
          tacna: z.number(),
          tumbes: z.number(),
          ucayali: z.number(),
        })
      }),
      chapter5: z.object({
        foreign: z.object({
          total: z.number(),
          leisure: z.number(),
          visit: z.number(),
          education: z.number(),
          health: z.number(),
          religion: z.number(),
          shopping: z.number(),
          bussines: z.number(),
          other: z.number(),
        }),
        residente: z.object({
          total: z.number(),
          leisure: z.number(),
          visit: z.number(),
          education: z.number(),
          health: z.number(),
          religion: z.number(),
          shopping: z.number(),
          bussines: z.number(),
          other: z.number(),
        })
      }),
      chapter6: z.object({
        managers: z.object({
          mens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          womens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          owners: z.number(),
          unpaids: z.number(),
        }),
        attention: z.object({
          mens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          womens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          owners: z.number(),
          unpaids: z.number(),
        }),
        janitor: z.object({
          mens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          womens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          owners: z.number(),
          unpaids: z.number(),
        }),
        cleaning: z.object({
          mens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          womens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          owners: z.number(),
          unpaids: z.number(),
        }),
        food: z.object({
          mens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          womens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          owners: z.number(),
          unpaids: z.number(),
        }),
        bar: z.object({
          mens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          womens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          owners: z.number(),
          unpaids: z.number(),
        }),
        other: z.object({
          mens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          womens: z.object({
            permanent: z.number(),
            eventual: z.number()
          }),
          owners: z.number(),
          unpaids: z.number(),
        })
      })
    });
    // Validate
    try {
      userSchema.parse(form)
      this.errorListener = false;
      return form;
    } catch (error) {
      this.errorListener = true;
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

  error = (): boolean => this.errorListener;
  getErrors = (): IErrorObject[] => this.errors;
}