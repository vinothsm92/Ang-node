//Angular Module Config
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes ,RouterModule} from '@angular/router'
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//Route Config
import { AppRoute } from './app.route';

//Service Config
  import { ServicePackages } from './app.ServiceMaster';
 
import { MessageService } from 'primeng/components/common/messageservice';
//Component Config
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';


//Primeng Config
import {AccordionModule} from 'primeng/accordion';
import {KeyFilterModule} from 'primeng/keyfilter';
import { DialogModule } from 'primeng/Dialog';
import {ButtonModule} from 'primeng/button';
import { RoleComponent } from './role/role.component'
import {PanelModule} from 'primeng/panel';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table'; 
import {DropdownModule} from 'primeng/dropdown';
import { ManageUserComponent } from './manage-user/manage-user.component';
 



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RoleComponent,
    ManageUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    AccordionModule,
    KeyFilterModule,
    DialogModule,
    ButtonModule,
    PanelModule,
    CheckboxModule,
    InputTextareaModule,
    ToastModule,
    TableModule,
    DropdownModule,
    RouterModule.forRoot(AppRoute)
  ],
  providers: [ServicePackages,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
