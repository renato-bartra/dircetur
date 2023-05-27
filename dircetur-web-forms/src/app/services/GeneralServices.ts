import { Injectable } from "@angular/core";
import { Chapter2 } from "app/core/modules/Chapter2";
import { Chapter3 } from "app/core/modules/Chapter3";
import { Chapter4_1 } from "app/core/modules/Chapter4_1";
import { Chapter4_2 } from "app/core/modules/Chapter4_2";
import { Chapter5 } from "app/core/modules/Chapter5";
import { Month } from "app/core/modules/Month";
import { Reazon } from "app/core/modules/Reazon";
import { Survey } from "app/core/modules/Survey";
import { BehaviorSubject, Observable } from "rxjs";
import { initSurvey } from "./initSurvey";
import { Chapter6 } from "app/core/modules/Chapter6";

@Injectable({
  providedIn: "root",
})
export class GeneralServices {
  // Make observable survey for pass current survey from "make from component"
  // to "view form comp"
  private survey$ = new BehaviorSubject<Survey>(initSurvey);

  get makedSurvey$(): Observable<Survey> {
    return this.survey$.asObservable();
  }

  setSurvey(survey: Survey): void {
    this.survey$.next(survey);
  }

  // Return all months in object
  getMonths = (): Month[] => {
    return [
      { value: 0, viewValue: "Enero" },
      { value: 1, viewValue: "Febrero" },
      { value: 2, viewValue: "Marzo" },
      { value: 3, viewValue: "Abril" },
      { value: 4, viewValue: "Mayo" },
      { value: 5, viewValue: "Junio" },
      { value: 6, viewValue: "Julio" },
      { value: 7, viewValue: "Agosto" },
      { value: 8, viewValue: "Septiembre" },
      { value: 9, viewValue: "Octubre" },
      { value: 10, viewValue: "Noviembre" },
      { value: 11, viewValue: "Diciembre" },
    ];
  };

  // Return all reazons
  getReazons = (): Reazon[] => {
    return [
      { value: "leisure", viewValue: "Vacaciones, ocio, etc" },
      { value: "visit", viewValue: "Visita familiar" },
      { value: "education", viewValue: "Educación" },
      { value: "health", viewValue: "Salud" },
      { value: "religion", viewValue: "Religión" },
      { value: "shopping", viewValue: "Compra, exepto para su reventa" },
      { value: "bussines", viewValue: "Negocios o mot. profesionales" },
      { value: "other", viewValue: "Otros" },
    ];
  };

  getNewChapter2 = (): Chapter2 => {
    return {
      individual: {
        capability: {
          bathroom: 0,
          nobathroom: 0,
          places: 0,
        },
        used: {
          arrivals: 0,
          occupied: 0,
          overnight_stay: 0,
        },
        cost: {
          bathroom: 0,
          nobathroom: 0,
        },
      },
      double: {
        capability: {
          bathroom: 0,
          nobathroom: 0,
          places: 0,
        },
        used: {
          arrivals: 0,
          occupied: 0,
          overnight_stay: 0,
        },
        cost: {
          bathroom: 0,
          nobathroom: 0,
        },
      },
      suit: {
        capability: {
          bathroom: 0,
          nobathroom: 0,
          places: 0,
        },
        used: {
          arrivals: 0,
          occupied: 0,
          overnight_stay: 0,
        },
        cost: {
          bathroom: 0,
          nobathroom: 0,
        },
      },
      triple: {
        capability: {
          bathroom: 0,
          nobathroom: 0,
          places: 0,
        },
        used: {
          arrivals: 0,
          occupied: 0,
          overnight_stay: 0,
        },
        cost: {
          bathroom: 0,
          nobathroom: 0,
        },
      },
      bungalows: {
        capability: {
          bathroom: 0,
          nobathroom: 0,
          places: 0,
        },
        used: {
          arrivals: 0,
          occupied: 0,
          overnight_stay: 0,
        },
        cost: {
          bathroom: 0,
          nobathroom: 0,
        },
      },
      other: {
        capability: {
          bathroom: 0,
          nobathroom: 0,
          places: 0,
        },
        used: {
          arrivals: 0,
          occupied: 0,
          overnight_stay: 0,
        },
        cost: {
          bathroom: 0,
          nobathroom: 0,
        },
      },
    };
  };

  // Get new Chapter 3
  getNewChapter3 = (): Chapter3 => {
    return {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      21: 0,
      22: 0,
      23: 0,
      24: 0,
      25: 0,
      26: 0,
      27: 0,
      28: 0,
      29: 0,
      30: 0,
      31: 0,
    };
  };

  // Get new Chapter 4_1
  getNewChapter41 = (): Chapter4_1 => {
    return {
      arrivals: {
        argentina: 0,
        alemania: 0,
        bielorusia: 0,
        bolivia: 0,
        brasil: 0,
        canada: 0,
        colombia: 0,
        southkorea: 0,
        costarica: 0,
        chile: 0,
        china: 0,
        ecuador: 0,
        usa: 0,
        españa: 0,
        francia: 0,
        holanda: 0,
        india: 0,
        israel: 0,
        italia: 0,
        japon: 0,
        mexico: 0,
        panama: 0,
        england: 0,
        rusia: 0,
        suiza: 0,
        turquia: 0,
        uruguay: 0,
        venezuela: 0,
        africa: 0,
        oceania: 0,
        america: 0,
        asia: 0,
        europe: 0,
      },
      overnight_stay: {
        argentina: 0,
        alemania: 0,
        bielorusia: 0,
        bolivia: 0,
        brasil: 0,
        canada: 0,
        colombia: 0,
        southkorea: 0,
        costarica: 0,
        chile: 0,
        china: 0,
        ecuador: 0,
        usa: 0,
        españa: 0,
        francia: 0,
        holanda: 0,
        india: 0,
        israel: 0,
        italia: 0,
        japon: 0,
        mexico: 0,
        panama: 0,
        england: 0,
        rusia: 0,
        suiza: 0,
        turquia: 0,
        uruguay: 0,
        venezuela: 0,
        africa: 0,
        oceania: 0,
        america: 0,
        asia: 0,
        europe: 0,
      },
    };
  };

  // Get new chapter 4_2
  getNewChapter42 = (): Chapter4_2 => {
    return {
      arrivals: {
        metropilitana: 0,
        lima: 0,
        amazonas: 0,
        ancash: 0,
        apurimac: 0,
        arequipa: 0,
        ayacucho: 0,
        cajamarca: 0,
        cusco: 0,
        huancavelica: 0,
        huanuco: 0,
        ica: 0,
        junin: 0,
        lalibertad: 0,
        lambayeque: 0,
        loreto: 0,
        madrededios: 0,
        moquegua: 0,
        pasco: 0,
        piura: 0,
        puno: 0,
        sanmartin: 0,
        tacna: 0,
        tumbes: 0,
        ucayali: 0,
      },
      overnight_stay: {
        metropilitana: 0,
        lima: 0,
        amazonas: 0,
        ancash: 0,
        apurimac: 0,
        arequipa: 0,
        ayacucho: 0,
        cajamarca: 0,
        cusco: 0,
        huancavelica: 0,
        huanuco: 0,
        ica: 0,
        junin: 0,
        lalibertad: 0,
        lambayeque: 0,
        loreto: 0,
        madrededios: 0,
        moquegua: 0,
        pasco: 0,
        piura: 0,
        puno: 0,
        sanmartin: 0,
        tacna: 0,
        tumbes: 0,
        ucayali: 0,
      },
    };
  };

  // Get new chapter 5
  getNewChapter5 = (): Chapter5 => {
    return {
      foreign: {
        total: 0,
        leisure: 0,
        visit: 0,
        education: 0,
        health: 0,
        religion: 0,
        shopping: 0,
        bussines: 0,
        other: 0,
      },
      residente: {
        total: 0,
        leisure: 0,
        visit: 0,
        education: 0,
        health: 0,
        religion: 0,
        shopping: 0,
        bussines: 0,
        other: 0,
      },
    };
  };

  // Get new chapter 6
  getNewChapter6 = (): Chapter6 => {
    return {
      managers: {
        mens: {
          permanent: 0,
          eventual: 0,
        },
        womens: {
          permanent: 0,
          eventual: 0,
        },
        owners: 0,
        unpaids: 0,
      },
      attention: {
        mens: {
          permanent: 0,
          eventual: 0,
        },
        womens: {
          permanent: 0,
          eventual: 0,
        },
        owners: 0,
        unpaids: 0,
      },
      janitor: {
        mens: {
          permanent: 0,
          eventual: 0,
        },
        womens: {
          permanent: 0,
          eventual: 0,
        },
        owners: 0,
        unpaids: 0,
      },
      cleaning: {
        mens: {
          permanent: 0,
          eventual: 0,
        },
        womens: {
          permanent: 0,
          eventual: 0,
        },
        owners: 0,
        unpaids: 0,
      },
      food: {
        mens: {
          permanent: 0,
          eventual: 0,
        },
        womens: {
          permanent: 0,
          eventual: 0,
        },
        owners: 0,
        unpaids: 0,
      },
      bar: {
        mens: {
          permanent: 0,
          eventual: 0,
        },
        womens: {
          permanent: 0,
          eventual: 0,
        },
        owners: 0,
        unpaids: 0,
      },
      other: {
        mens: {
          permanent: 0,
          eventual: 0,
        },
        womens: {
          permanent: 0,
          eventual: 0,
        },
        owners: 0,
        unpaids: 0,
      },
    };
  };
}
