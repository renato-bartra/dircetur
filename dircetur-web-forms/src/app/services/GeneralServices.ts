import { Injectable } from "@angular/core";
import { Chapter2 } from "app/core/modules/Chapter2";
import { Chapter3 } from "app/core/modules/Chapter3";
import { Chapter4_1 } from "app/core/modules/Chapter4_1";
import { Chapter4_2 } from "app/core/modules/Chapter4_2";
import { OptionsValues } from "app/core/modules/OptionsValues";

@Injectable({
  providedIn: "root",
})
export class GeneralServices {

  // Return all months in object
  getMonths = (): OptionsValues[] => {
    return [
      { value: 1, viewValue: "Enero" },
      { value: 2, viewValue: "Febrero" },
      { value: 3, viewValue: "Marzo" },
      { value: 4, viewValue: "Abril" },
      { value: 5, viewValue: "Mayo" },
      { value: 6, viewValue: "Junio" },
      { value: 7, viewValue: "Julio" },
      { value: 8, viewValue: "Agosto" },
      { value: 9, viewValue: "Septiembre" },
      { value: 10, viewValue: "Octubre" },
      { value: 11, viewValue: "Noviembre" },
      { value: 12, viewValue: "Diciembre" },
    ]
  };

  // Return all reazons 
  getReazons = (): OptionsValues[] => {
    return [
      { value: 1, viewValue: "Vacaciones, ocio, etc" },
      { value: 2, viewValue: "Visita familiar" },
      { value: 3, viewValue: "Educación" },
      { value: 4, viewValue: "Salud" },
      { value: 5, viewValue: "Religión" },
      { value: 6, viewValue: "Compra, exepto para su reventa" },
      { value: 7, viewValue: "Negocios" },
      { value: 8, viewValue: "Trabajo" },
      { value: 9, viewValue: "Otros" },
    ];
  }

  getNewChapter2 = (): Chapter2 => {
    return {individual: {
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
    }}
  }

  // Get new Chapter 3
  getNewChapter3 = (): Chapter3 => {
    return {1: 0,
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
    }
  }

  // Get new Chapter 4_1
  getNewChapter41 = (): Chapter4_1 => {
    return {arrivals: {
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
      europe: 0
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
      europe: 0
    }}
  }

  // Get new chapter 4_2
  getNewChapter42 = (): Chapter4_2 => {
    return {arrivals: {
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
    }}
  }
}