import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


const httpOptions = {
  
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private _http: HttpClient) { }

 
  postuserdata(body: any): Observable<any> {
    return this._http.post('http://localhost:8085/signup', body, httpOptions);
  }
  postlogindata(body: any): Observable<any> {
    return this._http.post('http://localhost:8085/login', body, {
      observe:'body',
     withCredentials :true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }
  postforgotpwd(body: any): Observable<any> {
    return this._http.post('http://localhost:8085/Forgotpwd', body, httpOptions);
  }
}
