import { NumberApiService } from './../../services/number-api.service';
import { CovidDataService, IDateWiseData } from './../../services/covid-data.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import * as Chart from 'chart.js';
@Component({
  selector: 'covid-chart',
  templateUrl: './covid-chart.component.html',
  styleUrls: ['./covid-chart.component.scss']
})
export class CovidChartComponent implements OnInit, OnDestroy, AfterViewInit {
  /************************************************** Constructor **************************************************/
  constructor(
    private covidDataService: CovidDataService,
    private numberApiService: NumberApiService
  ) { }
  /************************************************** Properties **************************************************/
  public showLoading = true;
  private fetchDateWiseData$ = new Subscription();

  public dateWiseData: IDateWiseData = { dateList: [], activeCasesList: [], confirmedCasesList: [], totalListLength: 0, cursor: -10 };
  public dateRange = 10;

  @ViewChild('chartEl', { static: false }) private chartElement: ElementRef<HTMLCanvasElement>;
  private covidChart;

  private colorCode = { active: 'rgba(207, 0, 15, 1)', confirmed: 'rgba(243, 156, 18, 1)' };
  /************************************************** Methods *****************************************************/
  ngOnInit(): void {
    this.fetchDateWiseData();
  }

  ngOnDestroy(): void {
    this.fetchDateWiseData$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  private renderChart(): void {
    const chartRef = this.chartElement.nativeElement.getContext('2d');
    this.covidChart = new Chart(chartRef, {
      type: 'line',
      data: {
        datasets: [{
          data: [],
          fill: false,
          label: 'Active Cases',
          yAxisID: 'active-cases-axis',
          backgroundColor: this.colorCode.active,
          borderColor: this.colorCode.active
        },
        {
          data: [],
          fill: false,
          label: 'Confirmed Cases',
          yAxisID: 'confirmed-cases-axis',
          backgroundColor: this.colorCode.confirmed,
          borderColor: this.colorCode.confirmed
        }],
        labels: [],
      },
      options: {
        scales: {
          yAxes: [
            {
              id: 'active-cases-axis',
              type: 'linear',
              position: 'left',
              ticks: { beginAtZero: true },
              scaleLabel: { labelString: 'Active Cases', display: true, fontColor: this.colorCode.active, fontSize: 16 }

            },
            {
              id: 'confirmed-cases-axis',
              type: 'linear',
              position: 'right',
              ticks: { beginAtZero: true },
              scaleLabel: { labelString: 'Confirmed Cases', display: true, fontColor: this.colorCode.confirmed, fontSize: 16 }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            afterBody: (tooltipItem) => {
              return this.numberApiService.numberFactHash[tooltipItem[0].value];
            }
          },
          bodySpacing: 10
        }
      }
    });
  }

  private fetchDateWiseData(): void {
    this.showLoading = true;
    this.fetchDateWiseData$.unsubscribe();
    const call$ = this.covidDataService.getDateWiseData(this.dateRange, this.dateWiseData.cursor)
      .pipe(switchMap((response) => {
        this.dateWiseData = response;
        const dataList = this.dateWiseData.activeCasesList.concat(this.dateWiseData.confirmedCasesList);
        return this.numberApiService.fetchNumFactForList(dataList);
      }));

    this.fetchDateWiseData$ = call$.pipe(take(1))
      .subscribe(() => {
        this.updateChartData();
        this.showLoading = false;
      });
  }

  private updateChartData(): void {
    if (this.covidChart) {
      this.covidChart.data.datasets[0].data = this.dateWiseData.activeCasesList;
      this.covidChart.data.datasets[1].data = this.dateWiseData.confirmedCasesList;
      this.covidChart.data.labels = this.dateWiseData.dateList;
      this.covidChart.update();
    }
  }

  public fetchNextPreviousData(mode?: 'next' | 'previous') {
    if (mode === 'next') {
      this.dateWiseData.cursor += this.dateRange;
    }
    else {
      this.dateWiseData.cursor -= this.dateRange;
      this.dateWiseData.cursor = Math.max(this.dateWiseData.cursor, 0);
    }
    this.fetchDateWiseData();
  }

  public dateRangeUpdate() {
    let cursorTemp = this.dateWiseData.cursor;
    cursorTemp = cursorTemp < 0 ? this.dateWiseData.totalListLength + cursorTemp : cursorTemp;
    if (cursorTemp + this.dateRange > this.dateWiseData.totalListLength) {
      cursorTemp = this.dateWiseData.totalListLength - this.dateRange;
    }
    this.dateWiseData.cursor = cursorTemp;
    this.fetchDateWiseData();
  }
}
