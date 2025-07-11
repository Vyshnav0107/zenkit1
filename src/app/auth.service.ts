import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8888/api/auth';

  constructor(private http: HttpClient) {}

  // 🔐 Login
 login(data: { email: string; password: string }): Observable<any> {
  return new Observable((observer) => {
    this.http.post(`${this.baseUrl}/login`, data).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('authToken', res.token);
        }
        observer.next(res);
        observer.complete();
      },
      error: (err) => {
        observer.error(err);
      },
    });
  });
}

  // 📝 Signup
  signup(data: { fullName: string; email: string; password: string }): Observable<any> {
  return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' });
}


  // 🔁 Forgot Password
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  // 🔄 Reset Password
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
  }
  isAuthenticated(): boolean {
  return !!localStorage.getItem('authToken');
}

logout(): void {
  localStorage.removeItem('authToken');
}
addReminder(reminder: { title: string; date: string; time: string; completed: boolean }): Observable<any> {
  return this.http.post('http://localhost:8888/api/reminders', reminder);
}
saveStopwatchData(data: {
  startTime: string;
  endTime: string;
  duration: string;
  laps: string[];
}): Observable<any> {
  return this.http.post('http://localhost:8888/api/stopwatch', data);
}
logPomodoroSession(data: {
  startTime: string;
  endTime: string;
  focusDuration: number;
  breakDuration: number;
}): Observable<any> {
  return this.http.post('http://localhost:8888/api/pomodoro', data);
}

}
