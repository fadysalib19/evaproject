import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page2Component } from './page2/page2.component';


const routes: Routes = [
  { path: '', redirectTo: '/page2', pathMatch: 'full' }, // This line sets the default route to redirect to /page2
  { path: 'page2', component: Page2Component },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
