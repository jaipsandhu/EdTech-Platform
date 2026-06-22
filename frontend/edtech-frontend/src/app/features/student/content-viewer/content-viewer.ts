import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import { Auth } from '../../../core/services/auth';
import { timeout } from 'rxjs/operators';

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
  selector: 'app-content-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-viewer.html',
  styleUrl: './content-viewer.css'
})
export class ContentViewer implements OnInit {

  content: any;
  safeUrl: SafeResourceUrl | null = null;

  // Notes
  notes: Note[] = [];
  newNoteTitle = '';
  newNoteContent = '';
  showNotes = false;

  // AI Chat
  showAiPanel = false;
  messages: ChatMessage[] = [
    { text: 'Hello! Ask me anything about this content.', isUser: false }
  ];
  chatInput = '';
  isChatLoading = false;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private auth: Auth,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );
    this.loadContent(id);
  }

  loadContent(id: number): void {
    this.auth.getContentById(id).subscribe({
      next: (data: any) => {
        this.content = data;
        if (data?.fileUrl) {
          // Google Docs viewer — renders PDFs inline without download prompt
          const gdocsUrl =
            'https://docs.google.com/viewer?embedded=true&url=' +
            encodeURIComponent(data.fileUrl);
          this.safeUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(gdocsUrl);
        }
        this.loadNotes(id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadNotes(contentId: number): void {
    this.auth.getNotes(contentId).subscribe({
      next: (data: any) => {
        this.notes = Array.isArray(data) ? data : [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  saveNote(): void {
    if (!this.newNoteTitle.trim() || !this.newNoteContent.trim()) return;
    const payload = {
      title: this.newNoteTitle,
      content: this.newNoteContent,
      contentId: this.content.id
    };
    this.auth.createNote(payload).subscribe({
      next: () => {
        this.loadNotes(this.content.id);
        this.newNoteTitle = '';
        this.newNoteContent = '';
      },
      error: () => alert('Failed to save note')
    });
  }

  deleteNote(noteId: number): void {
    if (!confirm('Delete this note?')) return;
    this.auth.deleteNote(noteId).subscribe({
      next: () => this.loadNotes(this.content.id),
      error: () => alert('Failed to delete note')
    });
  }

  toggleNotes(): void {
    this.showNotes = !this.showNotes;
  }

  toggleAi(): void {
    this.showAiPanel = !this.showAiPanel;
  }

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
      timeout(180000)
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
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  goBack(): void {
    this.router.navigate(['/student']);
  }
}
