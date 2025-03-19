import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSpendRequestComponent } from './create-spend-request/create-spend-request.component';

const routes: Routes = [
  {path:'createSpendRequest',component:CreateSpendRequestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSpendRequestRoutingModule { }
