import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { Router } from '@angular/router';

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
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css'
})

export class TeacherDashboard implements OnInit {

  contents: Content[] = [];

  filteredContents: Content[] = [];

  searchTerm: string = '';

  loading: boolean = true;

  showUploadModal: boolean = false;

  selectedFile: File | null = null;

  uploadTitle: string = '';

  uploadSubject: string = '';

  uploadDescription: string = '';

  uploadContentType: string = 'PDF';

  loggedInEmail: string = '';

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {


this.loggedInEmail =
  localStorage.getItem('email') || '';

this.loadContent();


  }

  loadContent(): void {


this.loading = true;

this.auth
  .getTeacherContent()
  .subscribe({

    next: (data: any) => {

      console.log(
        'Teacher Content:',
        data
      );

      this.contents =
        Array.isArray(data)
          ? data
          : [];

      this.filteredContents =
        [...this.contents];

      this.loading = false;

      this.cdr.detectChanges();
    },

    error: (err) => {

      console.error(
        'Failed to load content:',
        err
      );

      this.loading = false;
    }

  });


  }

  filterContent(): void {


const term =
  this.searchTerm
    .toLowerCase()
    .trim();

if (!term) {

  this.filteredContents =
    [...this.contents];

  return;
}

this.filteredContents =
  this.contents.filter(content =>

    content.title
      .toLowerCase()
      .includes(term)

  );


  }

  openUploadModal(): void {


this.showUploadModal = true;


  }

  closeUploadModal(): void {


this.showUploadModal = false;

this.selectedFile = null;

this.uploadTitle = '';

this.uploadSubject = '';

this.uploadDescription = '';

this.uploadContentType = 'PDF';


  }

  onFileSelected(event: Event): void {


const input =
  event.target as HTMLInputElement;

if (
  input.files &&
  input.files.length > 0
) {

  this.selectedFile =
    input.files[0];
}

  }

  uploadContent(): void {


if (!this.selectedFile) {

  alert(
    'Please select a file.'
  );

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
  .uploadTeacherContent(formData)
  .subscribe({

    next: () => {

      alert(
        'Content uploaded successfully.'
      );

      this.closeUploadModal();

      this.loadContent();
    },

    error: (err) => {

      console.error(err);

      alert(
        'Failed to upload content.'
      );
    }

  });


  }

  activateContent(id: number): void {


this.auth
  .activateTeacherContent(id)
  .subscribe({

    next: () => {

      this.loadContent();
    },

    error: (err) => {

      console.error(err);
    }

  });


  }

  deactivateContent(id: number): void {


this.auth
  .deactivateTeacherContent(id)
  .subscribe({

    next: () => {

      this.loadContent();
    },

    error: (err) => {

      console.error(err);
    }

  });


  }

  deleteContent(id: number): void {


const confirmed =
  confirm(
    'Delete this content?'
  );

if (!confirmed) {

  return;
}

this.auth
  .deleteTeacherContent(id)
  .subscribe({

    next: () => {

      this.loadContent();
    },

    error: (err) => {

      console.error(err);
    }

  });


  }

  viewContent(
    url?: string
  ): void {

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
