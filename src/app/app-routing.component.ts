import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectFiveComponent } from './connect-five/connect-five.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';

const routes: Routes = [
  { path: 'tic-tac-toe', component: TicTacToeComponent },
  { path: 'connect-five', component: ConnectFiveComponent },
  { path: '', redirectTo: '/tic-tac-toe', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }