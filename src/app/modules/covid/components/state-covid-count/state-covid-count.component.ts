import { CovidDataService, IStateWiseData } from './../../services/covid-data.service';
import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { AllowedStateCode } from '../covid-container/covid-container.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'state-covid-count',
  templateUrl: './state-covid-count.component.html',
  styleUrls: ['./state-covid-count.component.scss']
})
export class StateCovidCountComponent implements OnChanges, OnDestroy {
  /***************************************** Constructor *************************************/
  constructor(
    private covidDataService: CovidDataService
  ) { }
  /***************************************** Properties **************************************/
  @Input() stateCode: AllowedStateCode;

  public showLoading = true;
  public stateWiseData: IStateWiseData = { state: null, statecode: null, active: null, confirmed: null };
  private setStateCountData$ = new Subscription();
  /***************************************** Methods *****************************************/
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.stateCode && changes.stateCode.currentValue) {
      this.setStateCountData();
    }
  }

  ngOnDestroy(): void {
    this.setStateCountData$.unsubscribe();
  }

  private setStateCountData(): void {
    if (this.stateCode) {
      this.setStateCountData$.unsubscribe();
      this.showLoading = true;
      this.setStateCountData$ = this.covidDataService.getStateWiseData(this.stateCode)
        .pipe(take(1))
        .subscribe((response) => {
          this.stateWiseData = response;
          this.showLoading = false;
        })
    }
  }
}
