import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Country } from "../../../core/modules/Country";
import { DIRCETURAPIServices } from "../../../services/DIRCETURAPIServices";
import { Department } from "../../../core/modules/Department";
import { Month } from "../../../core/modules/Month";
import { GeneralServices } from "app/services/GeneralServices";
import { Chapter2 } from "app/core/modules/Chapter2";
import { Chapter3 } from "app/core/modules/Chapter3";
import { Chapter4_1 } from "app/core/modules/Chapter4_1";
import { Chapter4_2 } from "app/core/modules/Chapter4_2";
import { Chapter5 } from "app/core/modules/Chapter5";
import { Reazon } from "app/core/modules/Reazon";
import { Survey } from "app/core/modules/Survey";
import { Chapter6 } from "app/core/modules/Chapter6";
import { Londge } from "app/core/modules/Londge";
import { Router } from "@angular/router";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

@Component({
  selector: "app-new-form",
  templateUrl: "./new-form.component.html",
  styleUrls: ["./new-form.component.css"],
})
export class NewFormComponent implements OnInit {
  // Basic Data
  private token: string;
  private ruc: number;
  private regexNumber = /[0-9]$/;
  currentDate: Date = new Date();
  selectedMonth: number;
  selectedDate: Date;
  minDateInd: Date[] = [];
  minDateDou: Date[] = [];
  minDateSui: Date[] = [];
  minDateTri: Date[] = [];
  minDateBun: Date[] = [];
  minDateOth: Date[] = [];
  private londge: Londge;

  public months: Month[] = this.dataSvc.getMonths();
  public reazons: Reazon[] = this.dataSvc.getReazons();
  public countries: Country[] = []; 
  public departments: Department[] = [];


  // Data for processed emteh form
  private survey: Survey;
  private chapter2: Chapter2 = this.dataSvc.getNewChapter2();
  private chapter3: Chapter3 = this.dataSvc.getNewChapter3();
  private chapter41: Chapter4_1 = this.dataSvc.getNewChapter41(); 
  private chapter42: Chapter4_2 = this.dataSvc.getNewChapter42();
  private chapter5: Chapter5 = this.dataSvc.getNewChapter5();
  private chapter6: Chapter6 = this.dataSvc.getNewChapter6();
  private totalChap5Foreign: number = 0;
  private totalChap5Residente: number = 0;

  // Form Object
  public emtehForm: FormGroup;
  // Form arrays
  individuals: FormArray = new FormArray([]);
  doubles: FormArray = new FormArray([]);
  suits: FormArray = new FormArray([]);
  triples: FormArray = new FormArray([]);
  bungalos: FormArray = new FormArray([]);
  others: FormArray = new FormArray([]);

  constructor(
    private apiSvc: DIRCETURAPIServices,
    private dataSvc: GeneralServices,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.londge = JSON.parse(localStorage.getItem('londgedata'));
    this.ruc = this.londge.ruc;

    // Init Form
    this.emtehForm = new FormGroup({
      individuals: this.individuals,
      doubles: this.doubles,
      suits: this.suits,
      triples: this.triples,
      bungalos: this.bungalos,
      others: this.others,
    });

    // Set max min date values in form
    this.selectedMonth = this.currentDate.getMonth() - 1;
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.selectedMonth, 1);

    // Get all countries
    this.apiSvc.get(this.token, 'locations/countries').subscribe((response) => {
      this.countries.push({id: 0, eid:'peru', description: 'Perú'}); 
      this.countries = this.countries.concat(response.body);      
    })

    // Get all departments
    this.apiSvc.get(this.token, 'locations/departments').subscribe((response) => {
      this.departments.push({id:0, eid: 'extrangero', deparment:'EXTRANGERO'});
      this.departments = this.departments.concat(response.body);
    })

    // Get last chapter 2
    this.apiSvc.get(this.token, `forms/last-chapter2/${this.ruc}`).subscribe((response) => {
      if (response.code === 200){
        this.chapter2 = (<Chapter2>response.body['chapter_2']);
        this.chapter2.individual.used.arrivals = 0;
        this.chapter2.individual.used.occupied = 0;
        this.chapter2.individual.used.overnight_stay = 0;
        this.chapter2.double.used.arrivals = 0;
        this.chapter2.double.used.occupied = 0;
        this.chapter2.double.used.overnight_stay = 0;
        this.chapter2.suit.used.arrivals = 0;
        this.chapter2.suit.used.occupied = 0;
        this.chapter2.suit.used.overnight_stay = 0;
        this.chapter2.triple.used.arrivals = 0;
        this.chapter2.triple.used.occupied = 0;
        this.chapter2.triple.used.overnight_stay = 0;
        this.chapter2.bungalows.used.arrivals = 0;
        this.chapter2.bungalows.used.occupied = 0;
        this.chapter2.bungalows.used.overnight_stay = 0;
        this.chapter2.other.used.arrivals = 0;
        this.chapter2.other.used.occupied = 0;
        this.chapter2.other.used.overnight_stay = 0;
      }
    })

    // Get last chapter 6
    this.apiSvc.get(this.token, `forms/last-chapter6/${this.ruc}`).subscribe((response) => {
      if (response.code === 200)
        this.chapter6 = (<Chapter6>response.body['chapter_6']);
    })
  }

  // If selected contry diferent to Perú then disable departments and select extrangeró
  countryChange(room: string, i:number){
    if ((<FormArray>this.emtehForm.get(room)).at(i).get("country").value !== 'peru'){
      (<FormArray>this.emtehForm.get(room)).at(i).get("department").setValue("extrangero");
      (<FormArray>this.emtehForm.get(room)).at(i).get("department").disable();
    } else {
      (<FormArray>this.emtehForm.get(room)).at(i).get("department").setValue("sanmartin");
      (<FormArray>this.emtehForm.get(room)).at(i).get("department").enable();
    }
  }

  dateChange (): void{
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.selectedMonth, 1);
  }

  // dateIn Change
  dateInChange(room:string, i:number, event: MatDatepickerInputEvent<Date>):void {
    const newDate: Date = event.value;
    (<FormArray>this.emtehForm.get(room))
      .at(i).get("dateOut")
      .setValue(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1));
    (<FormArray>this.emtehForm.get(room))
      .at(i).get("dateOut").enable();
    switch (room){
      case 'individuals':
        this.minDateInd[i] = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
        break;
      case 'doubles':
        this.minDateDou[i] = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
        break;
      case 'suits':
        this.minDateSui[i] = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
        break;
      case 'triples':
        this.minDateTri[i] = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
        break;
      case 'bungalos':
        this.minDateBun[i] = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
        break;
      case 'others':
        this.minDateOth[i] = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
        break;
    }
  }

  // When change de Date Out, change the overnights stay
  dateOutChange(room: string, i:number, event: MatDatepickerInputEvent<Date>):void {
    const dateOut: Date = event.value;
    const dateIn: Date = <Date>(<FormArray>this.emtehForm.get(room))
      .at(i).get("dateIn").value;
    const diffTime = dateOut.getTime() - dateIn.getTime();
    const diffDays = diffTime/(1000 * 3600 * 24);
    (<FormArray>this.emtehForm.get(room))
      .at(i).get("nights").setValue(diffDays);
  }

  // change Dates validators when change mont
  dateFilter = (d: Date | null): boolean => {
    const minDate = new Date(this.currentDate.getFullYear(), this.selectedMonth, 1);
    const maxDate = new Date(this.currentDate.getFullYear(), this.selectedMonth, 31);

    return (d >= minDate) && ( d <= maxDate)
  }

  // Get Form controls inside every form Array
  getNewFormGroup(): FormGroup {
    return new FormGroup({
      country: new FormControl('peru', [Validators.required]),
      department: new FormControl('sanmartin', [Validators.required]),
      dateIn: new FormControl(this.selectedDate, [Validators.required]),
      dateOut: new FormControl(new Date(), [Validators.required]),
      nights: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(this.regexNumber),
      ]),
      people: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(this.regexNumber),
      ]),
      reazon: new FormControl("leisure", [Validators.required]),
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Individuals Zone                              */
  /* -------------------------------------------------------------------------- */
  // Add new indivial room into de form
  addIndividual(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("dateOut").disable();
    control.get("people").disable();
    control.get("nights").disable();
    (<FormArray>this.emtehForm.get("individuals")).push(control);
    this.minDateInd.push(new Date());
  }
  // Remove Indivial room
  removeIndividual(i: number): void {
    (<FormArray>this.emtehForm.get("individuals")).removeAt(i);
    this.minDateInd.splice(i, 1);
  }

  /* -------------------------------------------------------------------------- */
  /*                                Doubles Zone                                */
  /* -------------------------------------------------------------------------- */
  // Add double room
  addDouble(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").setValue(2);
    control.get("people").disable();
    control.get("dateOut").disable();
    control.get("nights").disable();
    this.minDateDou.push(new Date());
    (<FormArray>this.emtehForm.get("doubles")).push(control);
  }
  // Remove double room
  removeDouble(i: number): void {
    (<FormArray>this.emtehForm.get("doubles")).removeAt(i);
    this.minDateDou.splice(i, 1);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Suits zone                                 */
  /* -------------------------------------------------------------------------- */
  // Add Suit room
  addSuit(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").setValue(2);
    control.get("dateOut").disable();
    control.get("nights").disable();
    this.minDateSui.push(new Date());
    (<FormArray>this.emtehForm.get("suits")).push(control);
  }
  // Remove suit room
  removeSuit(i: number): void {
    (<FormArray>this.emtehForm.get("suits")).removeAt(i);
    this.minDateSui.splice(i, 1);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Triple Zone                                */
  /* -------------------------------------------------------------------------- */
  // Add Triple room
  addTriple(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").setValue(3);
    control.get("people").disable();
    control.get("dateOut").disable();
    control.get("nights").disable();
    this.minDateTri.push(new Date());
    (<FormArray>this.emtehForm.get("triples")).push(control);
  }
  // Remove triple room
  removeTriple(i: number): void {
    (<FormArray>this.emtehForm.get("triples")).removeAt(i);
    this.minDateTri.splice(i, 1);
  }

  /* -------------------------------------------------------------------------- */
  /*                                Bungaló zone                                */
  /* -------------------------------------------------------------------------- */
  // Add Bungalo room
  addBungalo(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").setValue(2);
    control.get("dateOut").disable();
    control.get("nights").disable();
    this.minDateBun.push(new Date());
    (<FormArray>this.emtehForm.get("bungalos")).push(control);
  }
  // Remove Bungalo room
  removeBungalo(i: number): void {
    (<FormArray>this.emtehForm.get("bungalos")).removeAt(i);
    this.minDateBun.splice(i, 1);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Otro Zone                                 */
  /* -------------------------------------------------------------------------- */
  // Add Other room
  addOther(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("dateOut").disable();
    control.get("nights").disable();
    this.minDateOth.push(new Date());
    (<FormArray>this.emtehForm.get("others")).push(control);
  }
  // Remove Other room
  removeOther(i: number): void {
    (<FormArray>this.emtehForm.get("others")).removeAt(i);
    this.minDateOth.splice(i, 1);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Make Form                                 */
  /* -------------------------------------------------------------------------- */
  makeForm(): void {
    this.emtehForm.enable();
    for ( const [key, values] of Object.entries(this.emtehForm.value)){
      for (const [id, formVal] of Object.entries(values)){
        // Complete chapter 2
        switch (key) {
          case 'individuals':
            this.chapter2.individual.used.arrivals += formVal['people'];
            this.chapter2.individual.used.occupied += formVal['nights'];
            this.chapter2.individual.used.overnight_stay += formVal['people'] * formVal['nights'];
            break;
          case 'doubles':
            this.chapter2.double.used.arrivals += formVal['people'];
            this.chapter2.double.used.occupied += formVal['nights'];
            this.chapter2.double.used.overnight_stay += formVal['people'] * formVal['nights'];
            break;
          case 'suit':
            this.chapter2.suit.used.arrivals += formVal['people'];
            this.chapter2.suit.used.occupied += formVal['nights'];
            this.chapter2.suit.used.overnight_stay += formVal['people'] * formVal['nights'];
            break;
          case 'triples':
            this.chapter2.triple.used.arrivals += formVal['people'];
            this.chapter2.triple.used.occupied += formVal['nights'];
            this.chapter2.triple.used.overnight_stay += formVal['people'] * formVal['nights'];
            break;
          case 'bungalos':
            this.chapter2.bungalows.used.arrivals += formVal['people'];
            this.chapter2.bungalows.used.occupied += formVal['nights'];
            this.chapter2.bungalows.used.overnight_stay += formVal['people'] * formVal['nights'];
            break;
          case 'others':
            this.chapter2.other.used.arrivals += formVal['people'];
            this.chapter2.other.used.occupied += formVal['nights'];
            this.chapter2.other.used.overnight_stay += formVal['people'] * formVal['nights'];
            break;
        }
        // Complet chapter 3
        this.chapter3[(<Date>formVal['dateIn']).getDate()] += formVal['people'];

        // Complete chapter 4_1
        this.chapter41.arrivals[formVal['country']] += formVal['people'];
        this.chapter41.overnight_stay[formVal['country']] += formVal['people'] * formVal['nights'];
        
        // Complete chapter 4_2
        this.chapter42.arrivals[formVal['department']] += formVal['people'];
        this.chapter42.overnight_stay[formVal['department']] += formVal['people'] * formVal['nights'];

        // Complete chapter 5
        if (formVal['country'] === 'peru'){
          this.chapter5.residente[formVal['reazon']] += formVal['people'];
          this.totalChap5Residente += formVal['people'];
        }else {
          this.chapter5.foreign[formVal['reazon']] += formVal['people'];
          this.totalChap5Foreign += formVal['people'];
        }
      }
    };
    this.chapter5.residente.total = this.totalChap5Residente;
    this.chapter5.foreign.total = this.totalChap5Foreign;
    this.survey = {
      id: 0,
      city: this.londge.city.city,
      clase: this.londge.clase.description,
      email: this.londge.email,
      trade_name: this.londge.trade_name,
      legal_name: this.londge.legal_name,
      legal_representative: this.londge.legal_representative,
      certificate: this.londge.certificate,
      ruc: this.londge.ruc,
      stars: this.londge.stars,
      street: this.londge.street,
      phone: this.londge.phone,
      latitude: this.londge.latitude,
      longitude: this.londge.longitude,
      web_page: this.londge.web_page,
      reservation_email: this.londge.reservation_email,
      documented_at: new Date(this.currentDate.getFullYear(), this.selectedMonth, 15).toLocaleDateString("sv"),
      chapter2: this.chapter2,
      chapter3: this.chapter3,
      chapter4_1: this.chapter41,
      chapter4_2: this.chapter42,
      chapter5: this.chapter5,
      chapter6: this.chapter6,
    };
    // set Survey in data service for use in "view service component"
    this.dataSvc.setSurvey(this.survey);
    this.router.navigate(['lodging/view-form']);
  }
}
