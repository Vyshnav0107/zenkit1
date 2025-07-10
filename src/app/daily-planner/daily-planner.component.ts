import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.css']
})
export class DailyPlannerComponent implements OnInit {

  selectedDate: string = new Date().toISOString().substring(0, 10);

  // Stores all tasks keyed by date string (yyyy-mm-dd)
  tasksByDate: { [date: string]: Task[] } = {};

  currentTasks: Task[] = [];
  previousDayCompletedTasks: Task[] = [];

  // UI state
  newTaskTitle: string = '';
  newTaskTime: string = '';
  editTaskTitle: string = '';
  editTaskTime: string = '';
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  editTaskIndex: number = -1;

  dropdownOpen: boolean = false;

  ngOnInit(): void {
    this.loadTasksForDate(this.selectedDate);
  }

  onDateChange(): void {
    this.loadTasksForDate(this.selectedDate);
  }

  // Loads tasks for the selected date, updates currentTasks and previousDayCompletedTasks
  private loadTasksForDate(dateStr: string): void {
    const today = new Date().toISOString().substring(0, 10);
    const prevDate = this.getPreviousDate(dateStr);

    // Load tasks for current and previous day, or empty arrays if none
    this.currentTasks = this.tasksByDate[dateStr] ? [...this.tasksByDate[dateStr]] : [];
    this.previousDayCompletedTasks = this.tasksByDate[prevDate]
      ? this.tasksByDate[prevDate].filter(task => task.completed)
      : [];

    // If selected date is in the past, auto-mark all tasks as completed
    if (dateStr < today) {
      this.currentTasks = this.currentTasks.map(task => ({ ...task, completed: true }));
      this.tasksByDate[dateStr] = [...this.currentTasks]; // Persist auto-completed tasks
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

    const newTask: Task = {
      title: this.newTaskTitle.trim(),
      time: this.newTaskTime,
      completed: false
    };

    if (!this.tasksByDate[this.selectedDate]) {
      this.tasksByDate[this.selectedDate] = [];
    }

    this.tasksByDate[this.selectedDate].push(newTask);
    this.closeAddModal();
    this.loadTasksForDate(this.selectedDate);
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
    // Sync current tasks with tasksByDate when checkbox toggled
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
