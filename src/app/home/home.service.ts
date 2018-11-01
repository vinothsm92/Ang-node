import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


const httpOptions = {
  
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})




export class HomeService {

  constructor(private _http:HttpClient) { }


  GetUserName(): Observable<any> {
    // return this._http.get('http://localhost:8085/GetUser', httpOptions);
    return this._http.get("http://localhost:8085/GetUser",{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

}
