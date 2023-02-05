import {
  Chapter2,
  Chapter3,
  Chapter4_1,
  Chapter4_2,
  Chapter5,
  Chapter6,
  Form,
} from "../entities";

export class OrderForm {
  // Order form, because the form maybe will sen in desorder, and that is importan when
  // the pdf is writing
  order = async (form: Form): Promise<Form> => {
    // Orena el capitulo 2
    const orderChapter2: string[] = [
      "individual",
      "double",
      "suit",
      "triple",
      "bungalows",
      "other",
    ];
    let newChapter2 = {
      individual: {},
      double: {},
      suit: {},
      triple: {},
      bungalows: {},
      other: {},
    };
    orderChapter2.forEach((val) => {
      newChapter2[val as keyof Chapter2] = form.chapter2[val as keyof Chapter2];
    });
    // Ordena el capitulo 3
    let oldChapter3 = [form.chapter3 as Chapter3];
    const newChapter3 = oldChapter3.sort((a, b) => Number(a) - Number(b))[0];
    // Ordena el capitulo 4_1
    const orderChapter4 = [
      "argentina",
      "alemania",
      "bielorusia",
      "bolivia",
      "brasil",
      "canada",
      "colombia",
      "southkorea",
      "costarica",
      "chile",
      "china",
      "ecuador",
      "usa",
      "españa",
      "francia",
      "holanda",
      "india",
      "israel",
      "italia",
      "japon",
      "mexico",
      "panama",
      "england",
      "rusia",
      "suiza",
      "turquia",
      "uruguay",
      "venezuela",
      "africa",
      "oceania",
      "america",
      "asia",
      "europe",
    ];
    // Order Chapter 4_1 arrivals
    let newChap4_1Arrivals = {} as Chapter4_1["arrivals"];
    orderChapter4.forEach((val) => {
      newChap4_1Arrivals[val as keyof Chapter4_1["arrivals"]] =
        form.chapter4_1.arrivals[val as keyof Chapter4_1["arrivals"]];
    });
    // Order Chapter 4_1 overnight stay
    let newChap4_1OvNgtSty = {} as Chapter4_1["overnight_stay"];
    orderChapter4.forEach((val) => {
      newChap4_1OvNgtSty[val as keyof Chapter4_1["overnight_stay"]] =
        form.chapter4_1.overnight_stay[
          val as keyof Chapter4_1["overnight_stay"]
        ];
    });
    // Order Chapter 4_2
    const orderChapter4_2 = [
      "metropilitana",
      "lima",
      "amazonas",
      "ancash",
      "apurimac",
      "arequipa",
      "ayacucho",
      "cajamarca",
      "cusco",
      "huancavelica",
      "huanuco",
      "ica",
      "junin",
      "lalibertad",
      "lambayeque",
      "loreto",
      "madrededios",
      "moquegua",
      "pasco",
      "piura",
      "puno",
      "sanmartin",
      "tacna",
      "tumbes",
      "ucayali",
      "total",
    ];
    // Order Chapter 4_2 arrivals
    let newChap4_2Arrivals = {} as Chapter4_2["arrivals"];
    orderChapter4_2.forEach((val) => {
      newChap4_2Arrivals[val as keyof Chapter4_2["arrivals"]] =
        form.chapter4_2.arrivals[val as keyof Chapter4_2["arrivals"]];
    });
    // Order Chapter 4_2 overnight stay
    let newChap4_2OvNgtSty = {} as Chapter4_2["overnight_stay"];
    orderChapter4_2.forEach((val) => {
      newChap4_2OvNgtSty[val as keyof Chapter4_2["overnight_stay"]] =
        form.chapter4_2.overnight_stay[
          val as keyof Chapter4_2["overnight_stay"]
        ];
    });
    // Order Chapter 5
    const orderChapter5 = [
      "total",
      "leisure",
      "visit",
      "education",
      "health",
      "religion",
      "shopping",
      "bussines",
      "work",
      "other",
    ];
    // Order Chapter 5 foreign
    let newChapter5_Foreign = {} as Chapter5["foreign"];
    orderChapter5.forEach((val) => {
      newChapter5_Foreign[val as keyof Chapter5["foreign"]] =
        form.chapter5.foreign[val as keyof Chapter5["foreign"]];
    });
    // Order Chaper 5 residente
    let newChapter5_Resident = {} as Chapter5["residente"];
    orderChapter5.forEach((val) => {
      newChapter5_Resident[val as keyof Chapter5["residente"]] =
        form.chapter5.residente[val as keyof Chapter5["residente"]];
    });
    // Order Chapter 6
    const orderChapter6: string[] = [
      "total",
      "managers",
      "attention",
      "janitor",
      "cleaning",
      "food",
      "bar",
      "other",
    ];
    let newChapter6 = {} as Chapter6;
    orderChapter6.forEach((val) => {
      newChapter6[val as keyof Chapter6] = form.chapter6[val as keyof Chapter6];
    });
    // Create new ordered form
    let newForm: Form = {
      id: form.id,
      documented_at: form.documented_at,
      chapter2: newChapter2 as Chapter2,
      chapter3: newChapter3,
      chapter4_1: {
        arrivals: newChap4_1Arrivals,
        overnight_stay: newChap4_1OvNgtSty,
      },
      chapter4_2:{
        arrivals: newChap4_2Arrivals,
        overnight_stay: newChap4_2OvNgtSty,
      },
      chapter5: {
        foreign: newChapter5_Foreign,
        residente: newChapter5_Resident,
      },
      chapter6: newChapter6
    };
    return newForm;
  };
}
