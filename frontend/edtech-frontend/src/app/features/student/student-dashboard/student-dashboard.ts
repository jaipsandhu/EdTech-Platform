import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { timeout } from 'rxjs/operators';
import { Router } from '@angular/router';

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

interface ChatMessage {
  text: string;
  isUser: boolean;
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
  searchTerm: string = '';
  loading: boolean = true;

  // Notes Modal
  showNotesModal = false;
  selectedContent: Content | null = null;
  notes: Note[] = [];
  newNoteTitle = '';
  newNoteContent = '';

  // AI Chat
  messages: ChatMessage[] = [
    { text: "Hello! How can I help you with your studies today?", isUser: false }
  ];
  chatInput: string = '';
  isChatLoading = false;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  logout(): void {

    const confirmed =
      confirm(
        'Are you sure you want to logout?'
      );

    if (!confirmed) {
      return;
    }

    this.auth.logout();

    this.router.navigate(
      ['/signin']
    );
  }

  ngOnInit(): void {
    this.loadContents();
  }

  loadContents(): void {
    this.loading = true;
    this.auth.getStudentContent().subscribe({
      next: (data: any) => {
        this.contents = Array.isArray(data) ? data : [];
        this.filteredContents = [...this.contents];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load contents:', err);
        this.loading = false;
      }
    });
  }

  filterContents(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredContents = term
      ? this.contents.filter(c => c.title.toLowerCase().includes(term))
      : [...this.contents];
  }

  viewContent(content: Content): void {

    this.router.navigate([
      '/student/content',
      content.id
    ]);

  }

  openNotes(content: Content): void {
    this.selectedContent = content;
    this.showNotesModal = true;
    this.loadNotes(content.id);
  }

  loadNotes(contentId: number): void {
    this.auth.getNotes(contentId).subscribe({
      next: (data: any) => this.notes = Array.isArray(data) ? data : [],
      error: (err: any) => console.error('Failed to load notes:', err)
    });
  }

  saveNote(): void {
    if (!this.selectedContent || !this.newNoteTitle || !this.newNoteContent) return;

    const payload = {
      title: this.newNoteTitle,
      content: this.newNoteContent,
      contentId: this.selectedContent.id
    };

    this.auth.createNote(payload).subscribe({
      next: () => {
        this.loadNotes(this.selectedContent!.id);
        this.newNoteTitle = '';
        this.newNoteContent = '';
      },
      error: (err: any) => alert('Failed to save note')
    });
  }

  deleteNote(noteId: number): void {
    if (!confirm('Delete this note?')) return;
    this.auth.deleteNote(noteId).subscribe({
      next: () => {
        if (this.selectedContent) this.loadNotes(this.selectedContent.id);
      },
      error: (err: any) => alert('Failed to delete note')
    });
  }

  closeNotesModal(): void {
    this.showNotesModal = false;
    this.selectedContent = null;
    this.notes = [];
  }

  // ── AI Chat ──
  sendMessage(): void {
    if (!this.chatInput.trim() || this.isChatLoading) return;

    const userMessage = this.chatInput.trim();
    this.messages.push({ text: userMessage, isUser: true });
    this.chatInput = '';
    this.isChatLoading = true;
    this.scrollToBottom();

    const aiMessage: ChatMessage = { text: '', isUser: false };
    this.messages.push(aiMessage);

    this.auth.chatWithAI(userMessage).pipe(
      timeout(180000)   // ← Increase to 3 minutes (180 seconds)
    ).subscribe({
      next: (chunk: string) => {
        aiMessage.text += chunk;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Chat error:', err);
        aiMessage.text = "Sorry, I'm having trouble responding right now.";
        this.isChatLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isChatLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}
