import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Note{
  _id?:string;
  title:string;
  body:string;
  date:string
}
interface Task {
  id?: string;
  _id?:string;
  time: string;
  title: string;
  completed: boolean;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8888/api/auth';
private notesUrl = `${this.baseUrl}/notes`;
  constructor(private http: HttpClient) {}

  // 🔐 Login
 login(data: { email: string; password: string }): Observable<any> {
  return new Observable((observer) => {
    this.http.post(`${this.baseUrl}/login`, data).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('authToken', res.token);
        }
        if (res.fullName) {
          localStorage.setItem('userFullName', res.fullName); // 👈 save full name
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
  return this.http.post(`${this.baseUrl}/forgot-password`, { email }, { responseType: 'text' });
}
  // 🔄 Reset Password
  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/reset-password`, { email, token, newPassword });
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
// Update reminder
updateReminder(id: string, updatedData: any): Observable<any> {
  return this.http.put(`http://localhost:8888/api/reminders/${id}`, updatedData);
}

// Delete reminder
deleteReminder(id: string): Observable<any> {
  return this.http.delete(`http://localhost:8888/api/reminders/${id}`);
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
changePassword(currentPassword: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/change-password`, {
    currentPassword,
    newPassword
  });
}
// 📝 NOTES CRUD
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.notesUrl);
  }

  addNote(note: Note): Observable<any> {
    return this.http.post(this.notesUrl, note);
  }

  updateNote(id: string, updatedNote: Partial<Note>): Observable<any> {
    return this.http.put(`${this.notesUrl}/${id}`, updatedNote);
  }

  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.notesUrl}/${id}`);
  }

  deleteMultipleNotes(noteIds: string[]): Observable<any> {
    return this.http.post(`${this.notesUrl}/delete-many`, { ids: noteIds });
  }
verifyCode(email: string, code: string) {
  return this.http.post<{ valid: boolean }>('http://localhost:8888/api/auth/verify-code', { email, code });
}

getRemindersByDate(date: string): Observable<Task[]> {
  return this.http.get<any[]>(`http://localhost:8888/api/reminders?date=${date}`)
    .pipe(
      map(tasks => tasks.map(task => ({
        ...task,
        id: task._id ?? task.id
      })))
    );
}



}