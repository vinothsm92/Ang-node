import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

var httpOptions = {
  observe: 'body',
  withCredentials: true,
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private _http: HttpClient) { }


  getRoledata(): Observable<any> {
    return this._http.get('http://localhost:8085/GetRoleInfo', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  postRoledata(body: any): Observable<any> {
    return this._http.post('http://localhost:8085/RoleInfo', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  RoleUpdate(body: any): Observable<any> {
    return this._http.put('http://localhost:8085/UpdateRoleInfo', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

}
