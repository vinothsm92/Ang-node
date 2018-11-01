
import { Routes } from '@angular/router'
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RoleComponent } from './role/role.component';

export const AppRoute: Routes = [

  //{ path: '', redirectTo:'', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  {
    path: 'Home', component: HomeComponent, children: [
      {
        path: 'Role', component: RoleComponent, outlet: "FCS"
      }]
  },
  //{
  //   path: 'Home', component: HomeComponent, 
  //   children: [
  //     {
  //       path: 'First', component: FirstComponent,outlet:"FCS"
  //     },
  //     {
  //       path: 'Second', component: SecondComponent,outlet:"FCS"
  //     }
  //     ,
  //     {
  //       path: 'Third', component: ThirdComponent,outlet:"FCS"
  //     }
  //   ]
  // },Antikhippe stack over flow

  { path: '**', component: LoginComponent }

]



// const routes: Routes = [
//   { path: '', redirectTo:'/login', pathMatch: 'full' },
//   { path: 'explorer', component:ExplorerQuizComponent },
//   { path:'login', component: LoginComponent}];