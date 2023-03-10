import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '@popperjs/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';

@Injectable({
  providedIn: 'root'
})
export class FormService {
 private countryUrl ="http://localhost:8080/api/countries";
 private stateUrl ="http://localhost:8080/api/states";

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] =[];
    for(let theMonth = startMonth; theMonth<=12; theMonth++){
      data.push(theMonth);
    }
    return of (data);
    }

    getCreditCardYears(): Observable<number[]>{
      let data: number[]=[];
      const startYear: number = new Date().getFullYear();
      const endYear: number= startYear+10;

      for(let theYear = startYear; theYear<=endYear;  theYear++){
        data.push(theYear);
      }
      return of(data);
    }
    getCountryData(): Observable<Country[]>{
      return this.httpClient.get<getResponseCountries>(this.countryUrl).pipe(map(response=> response._embedded.countries));
    }
    getStateData(theCountryCode: string): Observable<State[]>{
      const searchStateUrl=`${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
      return this.httpClient.get<getResponseStates>(searchStateUrl).pipe(map(response=> response._embedded.states));
    }
    getState(): Observable<State[]>{
      const searchStateUrl=`${this.stateUrl}/search/findByCountryCode?code=IN`;

      return this.httpClient.get<getResponseStates>(searchStateUrl).pipe(map(response=> response._embedded.states));
    }
}
interface getResponseCountries{
  _embedded:{
    countries: Country[];
  }
}
interface getResponseStates{
  _embedded:{
    states: State[];
  }
}