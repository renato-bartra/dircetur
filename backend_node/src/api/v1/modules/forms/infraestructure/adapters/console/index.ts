import { LondgeRepository } from "../../../../londges/domain/repositories/LondgeRepository";
import { MySQLLondgeRepository } from "../../../../londges/infraestructure/implementations/MySQL/MySQLLondgeRepository";
import { SMTPManager } from "../../../../shared/domain/repositories/SMTPManager";
import { ValidatorManager } from "../../../../shared/domain/repositories/ValidatorManager";
import { NodeMailerManager } from "../../../../shared/infraestructure/implementations/NodeMailer/NodeMailerManager";
import { CreateFormUseCase } from "../../../application/usecases/CreateFormUseCase";
import { DateValidatorManager } from "../../../domain/repositories/DateValidatorManager";
import { FormsRepository } from "../../../domain/repositories/FormsRepository";
import { PDFManager } from "../../../domain/repositories/PDFManager";
import { MySQLFormRepositori } from "../../implementations/MySQL/MySQLFormRepository";
import { PDFLibManager } from "../../implementations/PDFLib/PDFLibManager"
import { TSDatevalidatorManager } from "../../implementations/TSDateValidator/TSDateValidatorManager";
import { ZodFormManager } from "../../implementations/Zod/ZodFormManager";

const consoleCreate = async () => {
  const formRepo: FormsRepository = new MySQLFormRepositori();
  const londgeRepo: LondgeRepository = new MySQLLondgeRepository();
  const validatorManager: ValidatorManager = new ZodFormManager(); 
  const pdfManager: PDFManager = new PDFLibManager();
  const dateValidator: DateValidatorManager = new TSDatevalidatorManager();
  const smtpManager: SMTPManager = new NodeMailerManager();
  const create = new CreateFormUseCase(
    formRepo, 
    pdfManager, 
    smtpManager, 
    validatorManager, 
    londgeRepo
  );
  const data = await create.create(
    {
      id: 0,
      city: "TINGO DE SAPOSOA",
      clase: "Apart Hotel",
      email: "rustica@rustica.com.pe",
      trade_name: "Rustica",
      legal_name: "Inversiones Inmobiliaria Tarapoto SAC",
      legal_representative: "Oliva Guerrero Paul Geancarlo",
      certificate: "108",
      ruc: 20572278779,
      stars: 0,
      street: "Maronilla III - Sec. Cacatachi (Rústica)",
      phone: "940031566",
      latitude: null,
      longitude: null,
      web_page: "http://www.rusticahoteles.com",
      reservation_email: "rustica@rustica.com.pe",
      documented_at: '2022-07-22',
      chapter2: {
        "individual": {
          "capability": {
            "bathroom": 10,
            "nobathroom": 9,
            "places": 0
          },
          "used": {
            "arrivals": 2,
            "occupied": 4,
            "overnight_stay": 4
          },
          "cost": {
            "bathroom": 100,
            "nobathroom": 0
          }
        },
        "double": {
          "capability": {
            "bathroom": 10,
            "nobathroom": 0,
            "places": 0
          },
          "used": {
            "arrivals": 2,
            "occupied": 4,
            "overnight_stay": 4
          },
          "cost": {
            "bathroom": 100,
            "nobathroom": 0
          }
        },
        "suit": {
          "capability": {
            "bathroom": 10,
            "nobathroom": 0,
            "places": 0
          },
          "used": {
            "arrivals": 2,
            "occupied": 4,
            "overnight_stay": 4
          },
          "cost": {
            "bathroom": 100,
            "nobathroom": 0
          }
        },
        "triple": {
          "capability": {
            "bathroom": 10,
            "nobathroom": 0,
            "places": 0
          },
          "used": {
            "arrivals": 2,
            "occupied": 4,
            "overnight_stay": 4
          },
          "cost": {
            "bathroom": 100,
            "nobathroom": 0
          }
        },
        "bungalows": {
          "capability": {
            "bathroom": 10,
            "nobathroom": 0,
            "places": 0
          },
          "used": {
            "arrivals": 2,
            "occupied": 4,
            "overnight_stay": 4
          },
          "cost": {
            "bathroom": 100,
            "nobathroom": 0
          }
        },
        "other": {
          "capability": {
            "bathroom": 10,
            "nobathroom": 0,
            "places": 0
          },
          "used": {
            "arrivals": 2,
            "occupied": 4,
            "overnight_stay": 4
          },
          "cost": {
            "bathroom": 100,
            "nobathroom": 0
          }
        }
      },
      chapter3: {
        1:2,
        2:0,
        3:0,
        4:0,
        5:0,
        6:0,
        7:0,
        8:5,
        9:0,
        10:0,
        11:0,
        12:0,
        13:0,
        14:0,
        15:0,
        16:0,
        17:0,
        18:0,
        19:0,
        20:0,
        21:0,
        22:0,
        23:0,
        24:0,
        25:0,
        26:0,
        27:0,
        28:0,
        29:0,
        30:0,
        31:0,
      },
      chapter4_1: {
        "arrivals":{
          "argentina":2,
          "alemania":0,
          "bielorusia":0,
          "bolivia":4,
          "brasil":0,
          "canada":0,
          "colombia":0,
          "southkorea":0,
          "costarica":0,
          "chile":0,
          "china":0,
          "ecuador":0,
          "usa":1,
          "españa":0,
          "francia":0,
          "holanda":0,
          "india":0,
          "israel":0,
          "italia":0,
          "japon":0,
          "mexico":0,
          "panama":0,
          "england":0,
          "rusia":0,
          "suiza":0,
          "turquia":0,
          "uruguay":0,
          "venezuela":0,
          "africa":0,
          "oceania":0,
          "america":0,
          "asia":0,
          "europe":0
        },
        "overnight_stay":{
          "argentina":2,
          "alemania":0,
          "bielorusia":0,
          "bolivia":4,
          "brasil":0,
          "canada":0,
          "colombia":0,
          "southkorea":0,
          "costarica":0,
          "chile":0,
          "china":0,
          "ecuador":0,
          "usa":1,
          "españa":0,
          "francia":0,
          "holanda":0,
          "india":0,
          "israel":0,
          "italia":0,
          "japon":0,
          "mexico":0,
          "panama":0,
          "england":0,
          "rusia":0,
          "suiza":0,
          "turquia":0,
          "uruguay":0,
          "venezuela":0,
          "africa":0,
          "oceania":0,
          "america":0,
          "asia":0,
          "europe":0
        }
      },
      chapter4_2: {
        "arrivals":{
          "metropilitana":0,
          "lima":3,
          "amazonas":0,
          "ancash":0,
          "apurimac":0,
          "arequipa":0,
          "ayacucho":0,
          "cajamarca":0,
          "cusco":3,
          "huancavelica":0,
          "huanuco":0,
          "ica":0,
          "junin":0,
          "lalibertad":0,
          "lambayeque":2,
          "loreto":0,
          "madrededios":0,
          "moquegua":0,
          "pasco":0,
          "piura":0,
          "puno":3,
          "sanmartin":2,
          "tacna":0,
          "tumbes":0,
          "ucayali":0,
        },
        "overnight_stay":{
          "metropilitana":0,
          "lima":9,
          "amazonas":0,
          "ancash":0,
          "apurimac":0,
          "arequipa":0,
          "ayacucho":0,
          "cajamarca":0,
          "cusco":11,
          "huancavelica":0,
          "huanuco":0,
          "ica":0,
          "junin":0,
          "lalibertad":0,
          "lambayeque":4,
          "loreto":0,
          "madrededios":0,
          "moquegua":0,
          "pasco":0,
          "piura":0,
          "puno":6,
          "sanmartin":8,
          "tacna":8,
          "tumbes":0,
          "ucayali":0,
        }
      },
      chapter5: {
        "foreign":{
          "total":7,
          "leisure":7,
          "visit":0,
          "education":0,
          "health":0,
          "religion":0,
          "shopping":0,
          "bussines":0,
          "other":0
        },
        "residente":{
          "total":13,
          "leisure":6,
          "visit":0,
          "education":0,
          "health":0,
          "religion":7,
          "shopping":0,
          "bussines":0,
          "other":0
        }
      },
      chapter6: {
        "managers":{
          "mens":{
            "permanent":1,
            "eventual":0
          },
          "womens":{
            "permanent":0,
            "eventual":0
          },
          "owners":0,
          "unpaids":0,
        },
        "attention":{
          "mens":{
            "permanent":0,
            "eventual":1
          },
          "womens":{
            "permanent":1,
            "eventual":0
          },
          "owners":0,
          "unpaids":0,
        },
        "janitor":{
          "mens":{
            "permanent":0,
            "eventual":0
          },
          "womens":{
            "permanent":0,
            "eventual":0
          },
          "owners":0,
          "unpaids":0,
        },
        "cleaning":{
          "mens":{
            "permanent":0,
            "eventual":0
          },
          "womens":{
            "permanent":0,
            "eventual":1
          },
          "owners":0,
          "unpaids":1,
        },
        "food":{
          "mens":{
            "permanent":0,
            "eventual":0
          },
          "womens":{
            "permanent":0,
            "eventual":1
          },
          "owners":0,
          "unpaids":0,
        },
        "bar":{
          "mens":{
            "permanent":0,
            "eventual":0
          },
          "womens":{
            "permanent":0,
            "eventual":0
          },
          "owners":0,
          "unpaids":0,
        },
        "other":{
          "mens":{
            "permanent":0,
            "eventual":0
          },
          "womens":{
            "permanent":0,
            "eventual":0
          },
          "owners":0,
          "unpaids":0,
        }
      },
    }
  );
  console.log(data);
  
}

consoleCreate();