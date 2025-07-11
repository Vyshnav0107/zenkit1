import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { PomodoroTimerComponent } from './pomodoro/pomodoro-timer/pomodoro-timer.component';
import { HttpClientModule } from '@angular/common/http';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { DailyPlannerComponent } from './daily-planner/daily-planner.component';
import { NotesComponent } from './notes/notes.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'homepage', component: HomepageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LoginComponent,
    NotesComponent,
    PomodoroTimerComponent,
     StopwatchComponent,
    DailyPlannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
        HttpClientModule 

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
