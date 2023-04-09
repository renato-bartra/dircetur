import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Country } from "../../../core/modules/Country";
import { DIRCETURAPIServices } from "../../../services/DIRCETURAPIServices";
import { Department } from "../../../core/modules/Department";
import { OptionsValues } from "../../../core/modules/OptionsValues";
import { GeneralServices } from "app/services/GeneralServices";
import { Chapter2 } from "app/core/modules/Chapter2";
import { Chapter3 } from "app/core/modules/Chapter3";
import { Chapter4_1 } from "app/core/modules/Chapter4_1";
import { Chapter4_2 } from "app/core/modules/Chapter4_2";

@Component({
  selector: "app-new-form",
  templateUrl: "./new-form.component.html",
  styleUrls: ["./new-form.component.css"],
})
export class NewFormComponent implements OnInit {
  // Basic Data
  private token: string;
  private regexNumber = /[0-9]$/;
  currentDate: Date;
  currentMonth: number;
  
  private generaServices: GeneralServices = new GeneralServices()

  public months: OptionsValues[] = this.generaServices.getMonths();
  public reazons: OptionsValues[] = this.generaServices.getReazons();
  public countries: Country[] = []; 
  public departments: Department[] = [];


  // Data for processed emteh form
  private chapter2: Chapter2 = this.generaServices.getNewChapter2();
  private chapter3: Chapter3 = this.generaServices.getNewChapter3();
  private chapter41: Chapter4_1 = this.generaServices.getNewChapter41(); 
  private chapter42: Chapter4_2 = this.generaServices.getNewChapter42();

  // Form Object
  public emtehForm: FormGroup;
  // Form arrays
  individuals: FormArray = new FormArray([]);
  doubles: FormArray = new FormArray([]);
  suits: FormArray = new FormArray([]);
  triples: FormArray = new FormArray([]);
  bungalos: FormArray = new FormArray([]);
  others: FormArray = new FormArray([]);

  constructor(private apiServices: DIRCETURAPIServices) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth() - 1;
    this.token = localStorage.getItem('token');

    // Init Form
    this.emtehForm = new FormGroup({
      individuals: this.individuals,
      doubles: this.doubles,
      suits: this.suits,
      triples: this.triples,
      bungalos: this.bungalos,
      others: this.others,
    });

    // Get all countries
    this.apiServices.get(this.token, 'locations/countries').subscribe((response) => {
      this.countries.push({id: 0, eid:'', description: 'Perú'}); 
      this.countries = this.countries.concat(response.body);      
    })

    // Get all departments
    this.apiServices.get(this.token, 'locations/departments').subscribe((response) => {
      this.departments.push({id:0, eid: '', deparment:'EXTRANGERO'});
      this.departments = this.departments.concat(response.body);
    })
  }

  // Get Form controls inside every form Array
  getNewFormGroup(): FormGroup {
    return new FormGroup({
      country: new FormControl(0, [Validators.required]),
      department: new FormControl(22, [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
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
      reazon: new FormControl(1, [Validators.required]),
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Individuals Zone                              */
  /* -------------------------------------------------------------------------- */
  // Add new indivial room into de form
  addIndividual(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").disable();
    (<FormArray>this.emtehForm.get("individuals")).push(control);
  }
  // Remove Indivial room
  removeIndividual(i: number): void {
    (<FormArray>this.emtehForm.get("individuals")).removeAt(i);
  }

  /* -------------------------------------------------------------------------- */
  /*                                Doubles Zone                                */
  /* -------------------------------------------------------------------------- */
  // Add double room
  addDouble(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").setValue(2);
    control.get("people").disable();
    (<FormArray>this.emtehForm.get("doubles")).push(control);
  }
  // Remove double room
  removeDouble(i: number): void {
    (<FormArray>this.emtehForm.get("doubles")).removeAt(i);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Suits zone                                 */
  /* -------------------------------------------------------------------------- */
  // Add Suit room
  addSuit(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").setValue(2);
    (<FormArray>this.emtehForm.get("suits")).push(control);
  }
  // Remove suit room
  removeSuit(i: number): void {
    (<FormArray>this.emtehForm.get("suits")).removeAt(i);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Triple Zone                                */
  /* -------------------------------------------------------------------------- */
  // Add Triple room
  addTriple(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").setValue(3);
    control.get("people").disable();
    (<FormArray>this.emtehForm.get("triples")).push(control);
  }
  // Remove triple room
  removeTriple(i: number): void {
    (<FormArray>this.emtehForm.get("triples")).removeAt(i);
  }

  /* -------------------------------------------------------------------------- */
  /*                                Bungaló zone                                */
  /* -------------------------------------------------------------------------- */
  // Add Bungalo room
  addBungalo(): void {
    const control: FormGroup = this.getNewFormGroup();
    control.get("people").setValue(2);
    (<FormArray>this.emtehForm.get("bungalos")).push(control);
  }
  // Remove Bungalo room
  removeBungalo(i: number): void {
    (<FormArray>this.emtehForm.get("bungalos")).removeAt(i);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Otro Zone                                 */
  /* -------------------------------------------------------------------------- */
  // Add Other room
  addOther(): void {
    const control: FormGroup = this.getNewFormGroup();
    (<FormArray>this.emtehForm.get("others")).push(control);
  }
  // Remove Other room
  removeOther(i: number): void {
    (<FormArray>this.emtehForm.get("others")).removeAt(i);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Make Form                                 */
  /* -------------------------------------------------------------------------- */
  enableAllInputs(): void {
    let i = 0
    for(const e of Object.keys((<FormArray>this.emtehForm.get('individuals').value))){
      (<FormArray>this.emtehForm.get('individuals')).at(i)?.enable();
      (<FormArray>this.emtehForm.get('doubles')).at(i)?.enable();
      (<FormArray>this.emtehForm.get('triples')).at(i)?.enable();
      i ++
    }
  }

  makeForm(): void {
    this.enableAllInputs();
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
        this.chapter3[(<Date>formVal['date']).getDate()] += formVal['people'];

        // Complete chapter 4_1
        this.chapter41.arrivals[formVal['country']] += formVal['people'];
        this.chapter41.overnight_stay[formVal['country']] += formVal['people'] * formVal['nights'];
        
        // Complete chapter 4_2
        this.chapter42.arrivals[formVal['department']] += formVal['people'];
        this.chapter42.overnight_stay[formVal['department']] += formVal['people'] * formVal['nights'];

        // Complete chapter 5
        
      }
    };
    console.log(this.chapter3)
  }
}
