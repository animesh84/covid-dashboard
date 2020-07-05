import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NumberApiService {
  /******************************** Constructor ***********************************/
  constructor(
    private http: HttpClient
  ) { }
  /******************************** Properties ************************************/
  public numberFactHash: { [key: string]: string } = {};
  private baseApiUrl = environment.production ? '/numberdata/' : 'http://numbersapi.com/';
  /******************************** Methods ***************************************/
  fetchNumFactForList(numList: number[]): Observable<INumberFactHash> {
    const listToSend = numList.filter((num) => !this.numberFactHash[num.toString()]);
    if (listToSend.length) {
      const paramStr = listToSend.join(',');
      return this.http.get<INumberFactHash>(this.baseApiUrl + paramStr).pipe(map((response) => {
        this.numberFactHash = { ...this.numberFactHash, ...response };
        return this.numberFactHash;
      }))
    }
    return of(this.numberFactHash);
  }
}

/********************************* Interfaces **********************************/
interface INumberFactHash {
  [key: string]: string
}