import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home/home.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleComponent } from '../role/role.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  UserName: String;
  constructor(private _HomeService: HomeService, private _http: HttpClient,private _router:Router) { }

  ngOnInit() {
    this._HomeService.GetUserName().subscribe(data => {
     
      if (data == "Un-Authenticated") {
        this._router.navigate(['/']);
      } else{
        this.UserName = data;
      }
      // this._router.navigate(['/']);
      //  this.SignupForm.reset()
    },
      error => {
        console.error(error)

      }
    );
  }

  ngAfterViewInit(){
    
  }


}
