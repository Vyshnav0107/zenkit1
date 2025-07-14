import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

interface Note {
  _id?: string;
  title: string;
  body: string;
  date: string;
  selected?: boolean;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];

  isEditMode = false;
  isDeleteConfirmVisible = false;
  showSearch = false;
  searchTerm = '';
  isCreatingNote = false;
  showFormattingOptions = false;
  newNoteTitle = '';
  newNoteBody = '';
  editingNoteIndex: number | null = null;

  textareaRef!: HTMLTextAreaElement;
  activeTool: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    this.authService.getNotes().subscribe({
      next: (data: Note[]) => {
        // Initialize selected to false for all notes
        this.notes = data.map(note => ({ ...note, selected: false }));
      },
      error: (err: any) => console.error('Failed to load notes:', err),
    });
  }

  get filteredNotes(): Note[] {
    const term = this.searchTerm.toLowerCase().trim();
    return term
      ? this.notes.filter(
          (note) =>
            note.title.toLowerCase().includes(term) ||
            note.body.toLowerCase().includes(term)
        )
      : this.notes;
  }

  get selectedNotesCount(): number {
    return this.notes.filter((note) => note.selected).length;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.clearSelections();
      this.isDeleteConfirmVisible = false;
    }
  }

  onCheckboxChange() {
    this.isDeleteConfirmVisible = false;
  }

  showDeleteCard() {
    const anySelected = this.filteredNotes.some((note) => note.selected);
    if (anySelected) this.isDeleteConfirmVisible = true;
  }

  cancelDelete() {
    this.isDeleteConfirmVisible = false;
  }

  deleteSelectedNotes() {
    const ids = this.notes.filter(n => n.selected && n._id).map(n => n._id!);
    if (ids.length === 0) return;

    this.authService.deleteMultipleNotes(ids).subscribe({
      next: () => {
        this.loadNotes();  // Reload notes after deletion
        this.isEditMode = false;
        this.isDeleteConfirmVisible = false;
      },
      error: (err: any) => console.error('Delete failed:', err),
    });
  }

  clearSelections() {
    this.notes.forEach((note) => (note.selected = false));
  }

  openSearch() {
    this.showSearch = true;
  }

  closeSearch() {
    this.showSearch = false;
    this.searchTerm = '';
  }

  onSearchChange() {
    // Real-time filtering handled by getter
  }

  addNote() {
    this.isCreatingNote = true;
    this.newNoteTitle = '';
    this.newNoteBody = '';
    this.editingNoteIndex = null;

    setTimeout(() => {
      this.textareaRef = document.querySelector('textarea')!;
      this.textareaRef.focus();
    }, 0);
  }

  editNote(index: number) {
    const note = this.notes[index];
    this.newNoteTitle = note.title;
    this.newNoteBody = note.body;
    this.editingNoteIndex = index;
    this.isCreatingNote = true;

    setTimeout(() => {
      this.textareaRef = document.querySelector('textarea')!;
      this.textareaRef.focus();
    }, 0);
  }

  cancelNewNote() {
    this.isCreatingNote = false;
    this.newNoteTitle = '';
    this.newNoteBody = '';
    this.editingNoteIndex = null;
    this.showFormattingOptions = false;
  }

  saveNewNote() {
    const title = this.newNoteTitle.trim();
    const body = this.newNoteBody.trim();

    if (!title && !body) return;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${
      (now.getMonth() + 1).toString().padStart(2, '0')
    }/${now.getFullYear()}`;

    const noteData: Note = {
      title,
      body,
      date: formattedDate,
    };

    if (this.editingNoteIndex !== null) {
      const noteId = this.notes[this.editingNoteIndex]._id;
      if (!noteId) return;

      this.authService.updateNote(noteId, noteData).subscribe({
        next: (updatedNote: Note) => {
          this.loadNotes();  // Reload notes after update
          this.cancelNewNote();
        },
        error: (err: any) => console.error('Update failed:', err),
      });
    } else {
      this.authService.addNote(noteData).subscribe({
        next: () => {
          this.loadNotes();  // Reload notes after creation
          this.cancelNewNote();
        },
        error: (err: any) => console.error('Create failed:', err),
      });
    }
  }

  toggleFormatting() {
    this.showFormattingOptions = !this.showFormattingOptions;
  }

  applyFormat(format: 'bold' | 'italic' | 'underline' | 'heading' | 'bullet') {
    const textarea = this.textareaRef;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.newNoteBody.substring(start, end);
    let formatted = selectedText;

    switch (format) {
      case 'bold':
        formatted = `**${selectedText}**`;
        break;
      case 'italic':
        formatted = `*${selectedText}*`;
        break;
      case 'underline':
        formatted = `<u>${selectedText}</u>`;
        break;
      case 'heading':
        formatted = `# ${selectedText}`;
        break;
      case 'bullet':
        formatted = `• ${selectedText}`;
        break;
    }

    this.newNoteBody =
      this.newNoteBody.substring(0, start) +
      formatted +
      this.newNoteBody.substring(end);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + formatted.length;
      textarea.focus();
    }, 0);
  }

  toggleTool(toolName: string) {
    this.activeTool = this.activeTool === toolName ? null : toolName;
  }

  home() {
    this.activeTool = null;
  }
}