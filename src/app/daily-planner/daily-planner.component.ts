import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.css']
})
export class DailyPlannerComponent implements OnInit {

  selectedDate: string = new Date().toISOString().substring(0, 10);
  tasksByDate: { [date: string]: Task[] } = {};

  currentTasks: Task[] = [];
  previousDayCompletedTasks: Task[] = [];

  newTaskTitle: string = '';
  newTaskTime: string = '';
  editTaskTitle: string = '';
  editTaskTime: string = '';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  editTaskIndex: number = -1;

  dropdownOpen: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTasksForDate(this.selectedDate);
  }

  onDateChange(): void {
    this.loadTasksForDate(this.selectedDate);
  }

  private loadTasksForDate(dateStr: string): void {
    const today = new Date().toISOString().substring(0, 10);
    const prevDate = this.getPreviousDate(dateStr);

    this.currentTasks = this.tasksByDate[dateStr] ? [...this.tasksByDate[dateStr]] : [];
    this.previousDayCompletedTasks = this.tasksByDate[prevDate]
      ? this.tasksByDate[prevDate].filter(task => task.completed)
      : [];

    if (dateStr < today) {
      this.currentTasks = this.currentTasks.map(task => ({ ...task, completed: true }));
      this.tasksByDate[dateStr] = [...this.currentTasks];
    }
  }

  getPreviousDate(dateStr: string): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    return date.toISOString().substring(0, 10);
  }

  openAddModal(): void {
    this.newTaskTitle = '';
    this.newTaskTime = '';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(index: number): void {
    const task = this.currentTasks[index];
    this.editTaskTitle = task.title;
    this.editTaskTime = task.time;
    this.editTaskIndex = index;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  addTask(): void {
    if (!this.newTaskTitle.trim() || !this.newTaskTime) return;

    this.addTaskToBackend(this.newTaskTitle.trim(), this.selectedDate, this.newTaskTime);

    this.closeAddModal();
  }

 addTaskToBackend(title: string, date: string, time: string = ''): void {
  const newTask = {
    title: title,
    date: date,
    time: time,
    completed: false
  };

  this.authService.addReminder(newTask).subscribe({
    next: (response) => {
      console.log('Reminder added successfully:', response);

      if (!this.tasksByDate[date]) {
        this.tasksByDate[date] = [];
      }

      this.tasksByDate[date].push(response);
      this.loadTasksForDate(this.selectedDate);
    },
    error: (err) => {
      console.error('Error adding reminder:', err);
    }
  });
}

  updateTask(): void {
    if (!this.editTaskTitle.trim() || !this.editTaskTime) return;

    const updatedTask: Task = {
      title: this.editTaskTitle.trim(),
      time: this.editTaskTime,
      completed: this.currentTasks[this.editTaskIndex].completed
    };

    this.tasksByDate[this.selectedDate][this.editTaskIndex] = updatedTask;
    this.closeEditModal();
    this.loadTasksForDate(this.selectedDate);
  }

  removeTask(index: number): void {
    this.tasksByDate[this.selectedDate].splice(index, 1);
    this.loadTasksForDate(this.selectedDate);
  }

  onCheckboxChange(): void {
    this.tasksByDate[this.selectedDate] = [...this.currentTasks];
  }

  hasCompletedTasks(): boolean {
    return this.currentTasks.some(task => task.completed);
  }

  deleteCompletedTasks(): void {
    this.tasksByDate[this.selectedDate] = this.currentTasks.filter(task => !task.completed);
    this.loadTasksForDate(this.selectedDate);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 200);
  }

  signOut(): void {
    alert('Signed out!');
    // TODO: Replace with real sign-out logic
  }
}

interface Task {
  time: string;
  title: string;
  completed: boolean;
}
