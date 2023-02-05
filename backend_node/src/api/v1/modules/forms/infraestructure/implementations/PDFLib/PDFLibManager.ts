import { PDFDocument, StandardFonts } from "pdf-lib";
import { FormListener } from "../../../domain/entities";
import { copyFile, readFile, writeFile, unlink } from "fs/promises";
import { PDFManager } from "../../../domain/repositories/PDFManager";

export class PDFLibManager implements PDFManager {
  private errorListener: boolean = false;
  private errors: string = "";
  constructor() {}

  create = async (londge_id: number, form: FormListener): Promise<string> => {
    // Get the actual path and goes to documents folder replacing __dirname
    const regex: RegExp =
      /modules\/forms\/infraestructure\/implementations\/PDFLib/gi;
    const pdfPath = __dirname.replace(regex, "documents/");
    // Create and read new pdf filePah
    const pdfFilePath = pdfPath + `EMTEH${londge_id}.pdf`;
    await copyFile(pdfPath + "EMTEH.pdf", pdfFilePath);
    const pdfFile = await readFile(pdfFilePath);
    // Read pdf based on last created pdf
    const pdfDoc = await PDFDocument.load(pdfFile);
    // Get longe data and if null transform to ""
    const coordinates: string = 
      ((form.longitude !== null) ? form.longitude : "") + 
      " - " + 
      ((form.latitude !== null) ? form.latitude : "");
    const phone: string = (form.phone !== null) ? form.phone : "";
    const web_page: string = (form.web_page !== null) ? form.web_page : "";
    const reservation_email: string = 
      (form.reservation_email !== null) ? form.reservation_email : ""; 
    const clase: string = 
      (form.clase === 'Apart Hotel') ? "AH" : form.clase;
    const stars: string = 
      (form.stars === 0) ? "N/C" : form.stars.toString();
    const ruc: string[] = [...form.ruc.toString()]
    const city: string = this.lowerAllExceptFirstLetters(form.city)
    // White new lines in pdf
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];

    // Write Month
    const documentd_month: string = this.getMounth(form.documented_at);
    const RomaBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    firstPage.drawText(documentd_month, {x: 340, y: 756.5, size:16, font: RomaBoldFont});

    // Write Londge data - Chapter 1
    firstPage.drawText(form.legal_name, {x: 133, y: 711.1, size:9.7});
    ruc.forEach((number, i) => {
      firstPage.drawText(number, {x: 465+i*10, y: 711.1, size:9.7});
    })
    firstPage.drawText(form.trade_name, {x: 76, y: 696.6, size:9.7});
    firstPage.drawText(clase, {x: 304, y: 696.6, size:9.7});
    firstPage.drawText(stars, {x: 396, y: 696.6, size:9.7});
    firstPage.drawText(form.certificate, {x: 512, y: 696.6, size:9.7});
    firstPage.drawText(form.street, {x: 76, y: 683.5, size:9.7});
    firstPage.drawText(phone, {x: 396, y: 683.5, size:9.7});
    firstPage.drawText(coordinates, {x: 512, y: 683.5, size:9.7});
    firstPage.drawText("San Martín", {x: 62, y: 671, size:9.7});
    firstPage.drawText("San Martín", {x: 312, y: 671, size:9.7});
    firstPage.drawText(city, {x: 473, y: 671, size:8});
    firstPage.drawText(web_page, {x: 83, y: 659.5, size:9.7});
    firstPage.drawText(reservation_email, {x: 426, y: 659.5, size:9.7});

    // White form Data - Chapter 2
    // Con Baño
    let totalBatrooms: number = 0
    Object.entries(form.chapter2).forEach(([key, type], i) => {
      firstPage.drawText(type.capability.bathroom.toString(), {x: 170, y: 577.5-i*12, size:9.7});
      totalBatrooms += type.capability.bathroom;
    })
    firstPage.drawText(totalBatrooms.toString(), {x:170, y:503.5, size:9.7});
    // Sin Baño
    let totalNoBat: number = 0
    Object.entries(form.chapter2).forEach(([key, type], i) => {
      totalNoBat += type.capability.nobathroom;
      if (key === 'suit') return; // Skip suit because form set that
      firstPage.drawText(type.capability.nobathroom.toString(), {x: 221, y: 577.5-i*12, size:9.7});
    })
    firstPage.drawText(totalNoBat.toString(), {x:221, y:503.5, size:9.7});
    // Número de Plazas Cama
    let totalPlaces: number = 0;
    Object.entries(form.chapter2).forEach(([key, type], i) => {
      firstPage.drawText(type.capability.places.toString(), {x: 272, y: 577.5-i*12, size:9.7});
      totalPlaces += type.capability.places
    })
    firstPage.drawText(totalPlaces.toString(), {x:272, y:503.5, size:9.7});
    // Arribos de personas
    let totalArrivals: number = 0;
    Object.entries(form.chapter2).forEach(([key, type], i) => {
      firstPage.drawText(type.used.arrivals.toString(), {x: 324, y: 577.5-i*12, size: 9.7});
      totalArrivals += type.used.arrivals
    })
    firstPage.drawText(totalArrivals.toString(), {x: 324, y: 503.5, size: 9.7});
    // Habitaciones noche ocupadas
    let totalOcupied: number = 0;
    Object.entries(form.chapter2).forEach(([key, type], i) => {
      firstPage.drawText(type.used.occupied.toString(), {x: 376, y: 577.5-i*12, size:9.7});
      totalOcupied += type.used.occupied
    })
    firstPage.drawText(totalOcupied.toString(), {x:376, y:503.5, size:9.7});
    // Pernoctaciones
    let totalPernocta: number = 0;
    Object.entries(form.chapter2).forEach(([key, type], i) => {
      firstPage.drawText(type.used.overnight_stay.toString(), {x: 427, y: 577.5-i*12, size:9.7});
      totalPernocta += type.used.overnight_stay
    })
    firstPage.drawText(totalPernocta.toString(), {x:427, y:503.5, size:9.7});
    // Costo con baño
    let totalCostWithBat: number = 0;
    Object.entries(form.chapter2).forEach(([key, type], i) => {
      firstPage.drawText(type.cost.bathroom.toString(), {x: 474, y: 577.5-i*12, size:9.7});
      totalCostWithBat += type.cost.bathroom
    })
    // firstPage.drawText(totalCostWithBat.toString(), {x:474, y:503.5, size:9.7});
    // Costo son baño
    let totalCostWithNoBat: number = 0;
    Object.entries(form.chapter2).forEach(([key, type], i) => {
      totalCostWithNoBat += type.cost.nobathroom;
      if (key === 'suit') return; // Skip suit because the form set that
      firstPage.drawText(type.cost.nobathroom.toString(), {x: 531, y: 577.5-i*12, size:9.7});
    })
    // firstPage.drawText(totalCostWithNoBat.toString(), {x:531, y:503.5, size:9.7});

    // Write form data Chapter 3
    let totalMonth: number = 0;
    let y: number = 467.5;
    let i: number = 0
    Object.entries(form.chapter3).forEach(([key, val]) => {
      firstPage.drawText(val.toString(), {x: 71+i*68, y: y, size:9.3});
      i++;
      if (Number(key) % 8 === 0) {y -= 10.7; i=0};
      totalMonth += val;
    })
    firstPage.drawText(totalMonth.toString(), {x: 546, y: y-1, size:9.3});
    
    // Write form data Chapter 4_1
    let totalChapter4_1: number = 0
    Object.entries(form.chapter4_1.arrivals).forEach(([key, val], i) => {
      firstPage.drawText(val.toString(), {x: 183, y: 387-i*10.35, size:9.7});
      totalChapter4_1 += val;
    });
    firstPage.drawText(totalChapter4_1.toString(), {x: 183, y: 42.5, size:9.7});
    totalChapter4_1 = 0;
    Object.entries(form.chapter4_1.overnight_stay).forEach(([key, val], i) => {
      firstPage.drawText(val.toString(), {x: 239, y: 387-i*10.35, size:9.7});
      totalChapter4_1 += val;
    });
    firstPage.drawText(totalChapter4_1.toString(), {x: 239, y: 42.5, size:9.7});

    // Write form data Chapter 4_2
    let totalChapter4_2: number = 0;
    Object.entries(form.chapter4_2.arrivals).forEach(([key, val], i) => {
      firstPage.drawText(val.toString(), {x: 478, y: 367-i*12.9, size:9.7});
      totalChapter4_2 += val;
    });
    firstPage.drawText(totalChapter4_2.toString(), {x: 478, y: 42.5, size:9.7});
    totalChapter4_2 = 0;
    Object.entries(form.chapter4_2.overnight_stay).forEach(([key, val], i) => {
      firstPage.drawText(val.toString(), {x: 534, y: 367-i*12.9, size:9.7});
      totalChapter4_2 += val;
    });
    firstPage.drawText(totalChapter4_2.toString(), {x: 534, y: 42.5, size:9.7});

    // Write form data Chapter 5
    let totalsChapter5: number[] = [];
    // Extrangeros
    Object.entries(form.chapter5.foreign).forEach(([key, val], i) => {
      secondPage.drawText(val.toString(), {x: 157+i*46, y: 785, size:9.7});
      totalsChapter5[i] = val;
    })
    // Residentes
    Object.entries(form.chapter5.residente).forEach(([key, val], i) => {
      secondPage.drawText(val.toString(), {x: 157+i*46, y: 772, size:9.7});
      totalsChapter5[i] += val;
    })
    totalsChapter5.forEach((val, key) => {
      secondPage.drawText(val.toString(), {x: 157+key*46, y: 757, size:9.7});
    })

    // White form data Chapter 6
    let totalsChapter6: number[] = [];
    let totalsChapter6_rows: number[] = [0, 0, 0, 0, 0, 0];
    Object.entries(form.chapter6).forEach(([key, val], i) => {
      secondPage.drawText(val.mens.permanent.toString(), {x: 238+i*50, y: 687, size:9.7});
      totalsChapter6_rows[0] += val.mens.permanent;
      totalsChapter6[i] = val.mens.permanent;
      secondPage.drawText(val.mens.eventual.toString(), {x: 238+i*50, y: 676.4, size:9.7});
      totalsChapter6_rows[1] += val.mens.eventual;
      totalsChapter6[i] += val.mens.eventual;
      secondPage.drawText(val.womens.permanent.toString(), {x: 238+i*50, y: 655.5, size:9.7});
      totalsChapter6_rows[2] += val.womens.permanent;
      totalsChapter6[i] += val.womens.permanent;
      secondPage.drawText(val.womens.eventual.toString(), {x: 238+i*50, y: 644.5, size:9.7});
      totalsChapter6_rows[3] += val.womens.eventual;
      totalsChapter6[i] += val.womens.eventual;
      secondPage.drawText(val.owners.toString(), {x: 238+i*50, y: 634, size:9.7});
      totalsChapter6_rows[4] += val.owners;
      totalsChapter6[i] += val.owners;
      secondPage.drawText(val.unpaids.toString(), {x: 238+i*50, y: 623.4, size:9.7});
      totalsChapter6_rows[5] += val.unpaids;
      totalsChapter6[i] += val.unpaids;
    })
    let c = 0;
    let totalChapter6_row = 0;
    totalsChapter6_rows.forEach(val => {
      if (c !== 0 && c / 2 === 1) c += 1;
      secondPage.drawText(val.toString(), {x: 186, y: 687-c*10.6, size:9.7});
      totalChapter6_row += val;
      c++
    });
    let temp_totalsChapter6: number[] = [totalChapter6_row, ...totalsChapter6];
    temp_totalsChapter6.forEach((total, key) => {
      secondPage.drawText(total.toString(), {x: 186+key*50.4, y: 612.4, size:9.7});
    });

    // White footer
    secondPage.drawText(form.legal_representative.toString(), {x: 50, y: 117, size:8});
    secondPage.drawText(phone, {x: 44, y: 109, size:6.5});
    secondPage.drawText(form.email.toString(), {x: 103, y: 109, size:6.6});
    secondPage.drawText(form.legal_representative.toString(), {x: 410, y: 117, size:8});
    const nowDate = new Date();
    secondPage.drawText(nowDate.getDate().toString(), {x: 458, y: 109, size:7});
    secondPage.drawText((nowDate.getMonth()+1).toString(), {x: 492, y: 109, size:7});
    
    // Save and write changes in pdfFilePath 
    try {
      await writeFile(pdfFilePath, await pdfDoc.save());
      //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      this.errorListener = false;
      return pdfFilePath;
    } catch (error) {
      this.errorListener = true;
      this.errors = 
        'Hubo un error al crear el documento PDF, por favor intenetelo nuevamente';
      return this.errors;
    }
  };

  // Make lower city value
  private lowerAllExceptFirstLetters = (string: string): string => {
    return string.replace(/\S*/g, word =>
      `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`
    );
  }

  getMounth = (date: string): string => {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const d: Date = new Date(date);
    return monthNames[d.getMonth()];
  }

  // Delete file
  delete = async(londge_id: number): Promise<boolean> => {
    // Get the actual path and goes to documents folder replacing __dirname
    const regex: RegExp =
      /modules\/forms\/infraestructure\/implementations\/PDFLib/gi;
    const pdfPath = __dirname.replace(regex, "documents/");
    // Create and read new pdf filePah
    const pdfFilePath = pdfPath + `EMTEH${londge_id}.pdf`;
    try {   
      await unlink(pdfFilePath);
      this.errorListener = false;
      return true;
    } catch (error) {
      this.errorListener = true;
      this.errors = 'Hubo un error al limpiar los archivos temporales';
      return false;      
    }
  };

  error = (): boolean => this.errorListener;
  getError = (): string => this.errors;
}
