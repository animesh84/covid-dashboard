import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidContainerComponent } from './components/covid-container/covid-container.component';
import { CovidChartComponent } from './components/covid-chart/covid-chart.component';
import { StateCovidCountComponent } from './components/state-covid-count/state-covid-count.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CovidContainerComponent, CovidChartComponent, StateCovidCountComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    CovidContainerComponent
  ]
})
export class CovidModule { }
