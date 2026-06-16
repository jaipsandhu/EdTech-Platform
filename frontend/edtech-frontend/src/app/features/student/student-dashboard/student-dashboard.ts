import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

interface Content {
  id: number;
  title: string;
  uploadedBy?: string;
  contentType: string;
  fileUrl: string;
  active: boolean;
}

interface Note {
  id: number;
  title: string;
  content: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit {

  contents: Content[] = [];
  filteredContents: Content[] = [];
  searchTerm = '';
  loading = true;

  // Notes Modal
  showNotesModal = false;
  selectedContent: Content | null = null;
  notes: Note[] = [];

  newNoteTitle = '';
  newNoteContent = '';

  editingNoteId: number | null = null;

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContents();
  }

  loadContents(): void {

    this.loading = true;

    this.auth.getStudentContent().subscribe({

      next: (data: any) => {

        this.contents =
          Array.isArray(data) ? data : [];

        this.filteredContents =
          [...this.contents];

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err: any) => {

        console.error(
          'Failed to load contents:',
          err
        );

        this.loading = false;
      }
    });
  }

  filterContents(): void {

    const term =
      this.searchTerm
        .toLowerCase()
        .trim();

    this.filteredContents = term

      ? this.contents.filter(
        c =>
          c.title
            .toLowerCase()
            .includes(term)
      )

      : [...this.contents];
  }

  viewContent(
    content: Content
  ): void {

    window.open(
      content.fileUrl,
      '_blank'
    );
  }

  openNotes(
    content: Content
  ): void {

    this.selectedContent =
      content;

    this.showNotesModal =
      true;

    this.loadNotes(
      content.id
    );
  }

  loadNotes(
    contentId: number
  ): void {

    this.notes = [];

    this.auth.getNotes(
      contentId
    ).subscribe({

      next: (data: any) => {

        console.log('Notes loaded:', data);

        this.notes =
          Array.isArray(data)
            ? [...data]
            : [];

        this.cdr.markForCheck();

        setTimeout(() => {

          this.cdr.detectChanges();

        }, 0);
      },

      error: (err: any) => {

        console.error(
          'Failed to load notes:',
          err
        );
      }
    });
  }

  startEdit(
    note: Note
  ): void {

    this.editingNoteId =
      note.id;

    this.newNoteTitle =
      note.title;

    this.newNoteContent =
      note.content;
  }

  saveNote(): void {

    if (
      !this.selectedContent ||
      !this.newNoteTitle ||
      !this.newNoteContent
    ) {
      return;
    }

    const payload = {

      title:
      this.newNoteTitle,

      content:
      this.newNoteContent,

      contentId:
      this.selectedContent.id
    };

    if (
      this.editingNoteId !== null
    ) {

      this.auth.updateNote(
        this.editingNoteId,
        payload
      ).subscribe({

        next: () => {

          this.loadNotes(
            this.selectedContent!.id
          );

          this.editingNoteId =
            null;

          this.newNoteTitle =
            '';

          this.newNoteContent =
            '';
        },

        error: (err: any) => {

          console.error(err);

          alert(
            'Failed to update note'
          );
        }
      });

    } else {

      this.auth.createNote(
        payload
      ).subscribe({

        next: () => {

          this.loadNotes(
            this.selectedContent!.id
          );

          this.newNoteTitle =
            '';

          this.newNoteContent =
            '';
        },

        error: (err: any) => {

          console.error(err);

          alert(
            'Failed to save note'
          );
        }
      });
    }
  }

  deleteNote(
    noteId: number
  ): void {

    if (
      !confirm(
        'Delete this note?'
      )
    ) {
      return;
    }

    this.auth.deleteNote(
      noteId
    ).subscribe({

      next: () => {

        if (
          this.selectedContent
        ) {

          this.loadNotes(
            this.selectedContent.id
          );
        }
      },

      error: (err: any) => {

        console.error(err);

        alert(
          'Failed to delete note'
        );
      }
    });
  }

  closeNotesModal(): void {

    this.showNotesModal =
      false;

    this.selectedContent =
      null;

    this.notes = [];

    this.editingNoteId =
      null;

    this.newNoteTitle =
      '';

    this.newNoteContent =
      '';
  }

  trackById(
    index: number,
    item: any
  ): number {

    return item.id;
  }
}
