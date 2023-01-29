import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-fiscalizacion',
  templateUrl: './fiscalizacion.component.html',
  styleUrls: ['./fiscalizacion.component.css']
})
export class FiscalizacionComponent implements OnInit {
  public date: Date = new Date();
  public range: FormGroup
  constructor() {}

  ngOnInit(): void {
    this.range = new FormGroup({
      start: new FormControl(new Date(this.date.getFullYear(), this.date.getMonth(), 1)),
      end: new FormControl(new Date(this.date.getFullYear(), this.date.getMonth()+1, 0)),
    });
  }


}
