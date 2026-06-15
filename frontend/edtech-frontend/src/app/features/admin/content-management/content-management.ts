import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

interface Content {
  id: number;
  title: string;
  uploadedBy: string;
  contentType: string;
  active: boolean;
  fileUrl?: string;
}

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-management.html',
  styleUrl: './content-management.css'
})
export class ContentManagement implements OnInit {

  contents: Content[] = [];
  filteredContents: Content[] = [];
  searchTerm: string = '';
  loading: boolean = true;

  // Upload Modal
  showUploadModal = false;
  selectedFile: File | null = null;
  uploadTitle = '';
  uploadSubject = '';
  uploadDescription = '';
  uploadContentType = 'VIDEO';

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.loading = true;

    this.auth.getAllContent().subscribe({
      next: (data: any) => {
        console.log('✅ Content received:', data);
        this.contents = Array.isArray(data) ? data : [];
        this.filteredContents = [...this.contents];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load content:', err);
        this.loading = false;
      }
    });
  }

  filterContent(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredContents = term
      ? this.contents.filter(c => c.title.toLowerCase().includes(term))
      : [...this.contents];
  }

  openUploadModal() {
    this.showUploadModal = true;
    this.selectedFile = null;
    this.uploadTitle = '';
    this.uploadSubject = '';
    this.uploadDescription = '';
  }

  closeUploadModal() {
    this.showUploadModal = false;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadContent(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.uploadTitle);
    formData.append('subject', this.uploadSubject);
    formData.append('description', this.uploadDescription);
    formData.append('contentType', this.uploadContentType);

    this.auth.uploadContent(formData).subscribe({
      next: () => {
        alert('Content uploaded successfully!');
        this.closeUploadModal();
        this.loadContent();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to upload content');
      }
    });
  }

  activateContent(id: number): void {
    this.auth.activateContent(id).subscribe({
      next: () => this.loadContent(),
      error: (err) => alert('Failed to activate')
    });
  }

  deactivateContent(id: number): void {
    this.auth.deactivateContent(id).subscribe({
      next: () => this.loadContent(),
      error: (err) => alert('Failed to deactivate')
    });
  }

  deleteContent(id: number): void {
    if (!confirm('Delete this content?')) return;

    this.auth.deleteContent(id).subscribe({
      next: () => this.loadContent(),
      error: (err) => alert('Failed to delete')
    });
  }

  trackById(index: number, content: Content): number {
    return content.id;
  }

  viewContent(url?: string): void {

    if (!url) {

      return;

    }

    window.open(url, '_blank');
  }
}



