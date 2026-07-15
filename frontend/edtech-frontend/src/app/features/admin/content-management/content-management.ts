import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

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
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './content-management.html',
  styleUrl: './content-management.css'
})
export class ContentManagement implements OnInit {

  contents: Content[] = [];
  filteredContents: Content[] = [];

  searchTerm = '';
  loading = true;

  showUploadModal = false;

  selectedFile: File | null = null;

  uploadTitle = '';
  uploadSubject = '';
  uploadDescription = '';
  uploadContentType = 'PDF';

  // NEW
  fileAccept = '.pdf';

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {

    this.loading = true;

    this.auth.getAllContent().subscribe({

      next: (data: any) => {

        this.contents =
          Array.isArray(data)
            ? data
            : [];

        this.filteredContents = [...this.contents];

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: () => {

        this.loading = false;
      }

    });

  }

  filterContent(): void {

    const term =
      this.searchTerm
        .toLowerCase()
        .trim();

    this.filteredContents =
      term
        ? this.contents.filter(content =>
          content.title
            .toLowerCase()
            .includes(term))
        : [...this.contents];

  }

  openUploadModal(): void {

    this.showUploadModal = true;

    this.selectedFile = null;

    this.uploadTitle = '';
    this.uploadSubject = '';
    this.uploadDescription = '';

    this.uploadContentType = 'PDF';

    this.updateFileAccept();

  }

  closeUploadModal(): void {

    this.showUploadModal = false;

  }

  // NEW
  onContentTypeChange(): void {

    this.selectedFile = null;

    this.updateFileAccept();

  }

  // NEW
  updateFileAccept(): void {

    switch (this.uploadContentType) {

      case 'PDF':
        this.fileAccept = '.pdf';
        break;

      case 'VIDEO':
        this.fileAccept = 'video/*';
        break;

      case 'DOCUMENT':
        this.fileAccept = '.doc,.docx,.txt';
        break;

      default:
        this.fileAccept = '';
    }

  }

  onFileSelected(event: any): void {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    let valid = false;

    switch (this.uploadContentType) {

      case 'PDF':

        valid =
          file.name.toLowerCase().endsWith('.pdf');

        break;

      case 'VIDEO':

        valid =
          file.type.startsWith('video/');

        break;

      case 'DOCUMENT':

        valid =
          file.name.toLowerCase().endsWith('.doc') ||
          file.name.toLowerCase().endsWith('.docx') ||
          file.name.toLowerCase().endsWith('.txt');

        break;

    }

    if (!valid) {

      alert(
        'Please select a valid ' +
        this.uploadContentType +
        ' file.'
      );

      event.target.value = '';

      this.selectedFile = null;

      return;

    }

    this.selectedFile = file;

  }

  uploadContent(): void {

    if (!this.selectedFile) {

      return;

    }

    const formData =
      new FormData();

    formData.append(
      'file',
      this.selectedFile
    );

    formData.append(
      'title',
      this.uploadTitle
    );

    formData.append(
      'subject',
      this.uploadSubject
    );

    formData.append(
      'description',
      this.uploadDescription
    );

    formData.append(
      'contentType',
      this.uploadContentType
    );

    this.auth
      .uploadContent(formData)
      .subscribe({

        next: () => {

          this.closeUploadModal();

          this.loadContent();

        }

      });

  }

  activateContent(id: number): void {

    this.auth
      .activateContent(id)
      .subscribe(() => {

        this.loadContent();

      });

  }

  deactivateContent(id: number): void {

    this.auth
      .deactivateContent(id)
      .subscribe(() => {

        this.loadContent();

      });

  }

  deleteContent(id: number): void {

    if (!confirm('Delete this content?')) {

      return;

    }

    this.auth
      .deleteContent(id)
      .subscribe(() => {

        this.loadContent();

      });

  }

  viewContent(url?: string): void {

    if (!url) {

      return;

    }

    window.open(
      url,
      '_blank'
    );

  }

  trackById(
    index: number,
    content: Content
  ): number {

    return content.id;

  }

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

}
