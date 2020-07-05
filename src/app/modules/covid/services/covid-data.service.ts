import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  /*********************************************** Constructor ***********************************/
  constructor(
    private http: HttpClient
  ) { }
  /*********************************************** Properties ************************************/
  private fetchCovidData$: Observable<ICovidDataResponse>;
  private covidApiUrl = 'https://api.covid19india.org/data.json';
  /*********************************************** Methods ***************************************/
  private fetchCovidData(): Observable<ICovidDataResponse> {
    if (!this.fetchCovidData$) {
      this.fetchCovidData$ = this.http.get<ICovidDataResponse>(this.covidApiUrl)
        .pipe(shareReplay(1));
    }
    return this.fetchCovidData$;
  }

  public getStateWiseData(stateCode: string): Observable<IStateWiseData> {
    return this.fetchCovidData().pipe(map((response) => {
      return response.statewise.find((data) => data.statecode === stateCode);
    }))
  }

  public getDateWiseData(pageSize: number, cursor: number): Observable<IDateWiseData> {
    return this.fetchCovidData().pipe(map((response) => {
      const paginatedData = this.getPaginatedData(response.cases_time_series, pageSize, cursor);
      const dateList = paginatedData.list.map((item) => item.date);
      const activeCasesList = paginatedData.list.map((item) => item.totalconfirmed - item.totaldeceased - item.totalrecovered);
      const confirmedCasesList = paginatedData.list.map((item) => +item.totalconfirmed);
      return { dateList, activeCasesList, confirmedCasesList, cursor: paginatedData.cursor, totalListLength: paginatedData.totalListLength }
    }))
  }

  private getPaginatedData(list: any[], pageSize: number, cursor: number): { list: any[], cursor: number, totalListLength: number } {
    const totalListLength = list.length;
    pageSize = pageSize === null ? 10 : pageSize;
    cursor = cursor === null ? totalListLength - pageSize - 1 : cursor < 0 ? totalListLength + cursor : cursor;
    return { 'list': list.slice(cursor, cursor + pageSize), cursor, totalListLength };
  }
}

/************************************************* Interfaces ************************************/

interface ICovidDataResponse {
  cases_time_series: {
    totalconfirmed: number;
    totaldeceased: number;
    totalrecovered: number;
    date: string;
  }[];
  statewise: {
    active: number;
    confirmed: number;
    state: string;
    statecode: string;
  }[];
}

export interface IStateWiseData {
  state: string;
  statecode: string;
  active: number;
  confirmed: number;
}

export interface IDateWiseData {
  dateList: string[];
  activeCasesList: number[];
  confirmedCasesList: number[];
  totalListLength: number;
  cursor: number;
}