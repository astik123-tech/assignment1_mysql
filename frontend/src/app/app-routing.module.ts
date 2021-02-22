import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './service/auth.guard';
import { NewUserComponent } from './view/new-user/new-user.component';
import { UserListComponent } from './view/user-list/user-list.component';

const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'employee-list',
    canActivate: [AuthGuard],
    component:UserListComponent
  },
  {
    path:'employee-user',
    canActivate: [AuthGuard],
    component:NewUserComponent 
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
