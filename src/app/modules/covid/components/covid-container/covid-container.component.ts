import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'covid-container',
  templateUrl: './covid-container.component.html',
  styleUrls: ['./covid-container.component.scss']
})
export class CovidContainerComponent implements OnInit {
  /******************************************* Constructor ****************************************/
  constructor() { }
  /******************************************* Properties *****************************************/
  public stateList: IState[] = [
    { name: 'Delhi', code: 'DL' },
    { name: 'Maharashtra', code: 'MH' }
  ];

  public selectedStateCode: AllowedStateCode = 'DL';
  /******************************************* Methods ********************************************/
  ngOnInit(): void {
  }
}

/********************************************* Interfaces ****************************************/
interface IState {
  name: string;
  code: AllowedStateCode;
}

export type AllowedStateCode = 'DL' | 'MH';