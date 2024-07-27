import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { AppRoutingModule } from './app-routing.component';
import { ConnectFiveComponent } from './connect-five/connect-five.component';

@NgModule({
  declarations: [AppComponent, TicTacToeComponent, ConnectFiveComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
