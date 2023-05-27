import { Component, OnInit } from '@angular/core';
import { Country } from 'app/core/modules/Country';
import { Survey } from 'app/core/modules/Survey';
import { DIRCETURAPIServices } from 'app/services/DIRCETURAPIServices';
import { GeneralServices } from 'app/services/GeneralServices';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.css']
})
export class ViewFormComponent implements OnInit {

  token: string;

  survey: Survey;
  c2TotalPeople: number = 0;
  c2TotalNights: number = 0;
  c2TotalOvrNig: number = 0;
  c2TotalHaBath: number = 0;
  c2TotalHaNBath: number = 0;
  c2TotalHaPlac: number = 0;
  c3Total: number = 0;

  countries: Country[] = [];

  constructor(
    private dataSvc: GeneralServices,
    private apiSvc: DIRCETURAPIServices
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.dataSvc.makedSurvey$.subscribe((survey: Survey) => this.survey = survey);
    
    // Get all countries
    this.apiSvc.get(this.token, 'locations/countries').subscribe((response) => {
      this.countries = this.countries.concat(response.body);      
    })
    
    // Set totals in chapter 2 table
    for(let val of Object.entries(this.survey.chapter2)){
      this.c2TotalPeople += val[1].used.arrivals;
      this.c2TotalNights += val[1].used.occupied;
      this.c2TotalOvrNig += val[1].used.overnight_stay;
    }
    this.c2SumTotals();

    // Set totals in chapter 3 table
    for(let val of Object.entries(this.survey.chapter3)){
      this.c3Total += val[1];
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               Chapter 2 Zone                               */
  /* -------------------------------------------------------------------------- */
  c2SumTotals():void {
    for(let val of Object.entries(this.survey.chapter2)){
      this.c2TotalHaBath += Number(val[1].capability.bathroom);
      this.c2TotalHaNBath += Number(val[1].capability.nobathroom);
      this.c2TotalHaPlac += Number(val[1].capability.places);
    }
  }
  // When some value of chater 2 changes then sum every total value
  c2ChangeValues(room:string, type:string, value:string, event: any):void {
    this.survey.chapter2[room][type][value] = event.target.value;
    this.c2TotalHaBath = this.c2TotalHaNBath = this.c2TotalHaPlac = 0;
    // Sum individual room capability
    this.survey.chapter2.individual.capability.places = 
      Number(this.survey.chapter2.individual.capability.bathroom) +
      Number(this.survey.chapter2.individual.capability.nobathroom);
    // Sum double romm capability
    this.survey.chapter2.double.capability.places = 
      (Number(this.survey.chapter2.double.capability.bathroom) +
      Number(this.survey.chapter2.double.capability.nobathroom))*2;
    // Sum triple room capability
    this.survey.chapter2.triple.capability.places = 
      (Number(this.survey.chapter2.triple.capability.bathroom) +
      Number(this.survey.chapter2.triple.capability.nobathroom))*3;
    // Summ every total
    this.c2SumTotals()
  }

}
