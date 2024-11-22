import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/common/home/home.component';
import { DeviceListComponent } from './components/device/device-list/device-list.component';
import { DeviceCreateComponent } from './components/device/device-create/device-create.component';
import { DeviceEditComponent } from './components/device/device-edit/device-edit.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'home', component:HomeComponent},
  {path:'device', component:DeviceListComponent},
  {path:'device-create', component:DeviceCreateComponent},
  {path:'device-edit/:id', component:DeviceEditComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
