// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PomodoroTimerComponent } from './pomodoro/pomodoro-timer/pomodoro-timer.component';
import { NotesComponent } from './notes/notes.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { DailyPlannerComponent } from './daily-planner/daily-planner.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomepageComponent,
    children: [
      { path: 'pomodoro', component: PomodoroTimerComponent },
      { path: 'notes', component: NotesComponent },
      { path: 'stopwatch', component: StopwatchComponent },
      { path: 'daily-planner', component: DailyPlannerComponent },
      { path: '', redirectTo: 'pomodoro', pathMatch: 'full' },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
