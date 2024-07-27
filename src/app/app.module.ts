import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { AppRoutingModule } from './app-routing.component';
import { ConnectFiveComponent } from './connect-five/connect-five.component';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  { path: 'tic-tac-toe', component: TicTacToeComponent },
  { path: 'connect-five', component: ConnectFiveComponent },
  { path: '', redirectTo: '/tic-tac-toe', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent, TicTacToeComponent, ConnectFiveComponent],
  imports: [BrowserModule, AppRoutingModule, RouterModule.forRoot(routes)],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
