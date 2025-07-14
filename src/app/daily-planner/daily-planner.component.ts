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

  this.authService.getRemindersByDate(dateStr).subscribe({
    next: (tasks) => {
      // Map _id to id (if needed)
      const processedTasks = tasks.map(task => ({
        ...task,
        id: task._id ?? task.id  // in case backend sends _id
      }));

      this.tasksByDate[dateStr] = processedTasks;
      this.currentTasks = [...processedTasks];

      // Load previous day's completed tasks
      this.authService.getRemindersByDate(prevDate).subscribe({
        next: (prevTasks) => {
          this.previousDayCompletedTasks = prevTasks
            .filter(task => task.completed)
            .map(task => ({
              ...task,
              id: task._id ?? task.id
            }));
        },
        error: (err) => {
          console.error('Error loading previous day tasks:', err);
          this.previousDayCompletedTasks = [];
        }
      });

      // ✅ If past date, mark all tasks as completed
      if (dateStr < today) {
        this.currentTasks = this.currentTasks.map(task => ({ ...task, completed: true }));
        this.tasksByDate[dateStr] = [...this.currentTasks];
      }
    },
    error: (err) => {
      console.error('Error fetching tasks for date:', err);
      this.currentTasks = [];
    }
  });
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
      console.log('Reminder added:', response);

      // ✅ Map _id from backend to id so frontend can use it
      if (response._id && !response.id) {
        response.id = response._id;
      }

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

  const taskToEdit = this.tasksByDate[this.selectedDate][this.editTaskIndex];

  console.log('Editing Task:', taskToEdit); // ✅ Debug output

  const updatedTask: Task = {
    ...taskToEdit,
    title: this.editTaskTitle.trim(),
    time: this.editTaskTime,
    completed: taskToEdit.completed
  };

  if (taskToEdit.id) {
    this.authService.updateReminder(taskToEdit.id, updatedTask).subscribe({
      next: () => {
        this.tasksByDate[this.selectedDate][this.editTaskIndex] = updatedTask;
        this.closeEditModal();
        this.loadTasksForDate(this.selectedDate);
      },
      error: (err) => console.error('Failed to update task:', err)
    });
  } else {
    console.warn('No ID found for task — cannot update backend.');
  }
}


 removeTask(index: number): void {
  const task = this.tasksByDate[this.selectedDate][index];

  if (task.id) {
    // ✅ Delete from backend first
    this.authService.deleteReminder(task.id).subscribe({
      next: () => {
        console.log('Deleted from backend:', task.id);
        this.tasksByDate[this.selectedDate].splice(index, 1);
        this.loadTasksForDate(this.selectedDate);
      },
      error: (err) => {
        console.error('Error deleting task from backend:', err);
      }
    });
  } else {
    console.warn('Task has no ID — deleting only from frontend');
    this.tasksByDate[this.selectedDate].splice(index, 1);
    this.loadTasksForDate(this.selectedDate);
  }
}


 onCheckboxChange(): void {
  for (const task of this.currentTasks) {
    if (task.id) {
      this.authService.updateReminder(task.id, {
        completed: task.completed
      }).subscribe({
        next: () => console.log(`Updated completed status for task: ${task.id}`),
        error: (err) => console.error(`Failed to update task: ${task.id}`, err)
      });
    }
  }

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
export interface Task {
  id?: string;
  _id?: string;
  time: string;
  title: string;
  completed: boolean;
  date?: string;
}


