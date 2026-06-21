import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { Auth } from '../../../core/services/auth';

interface Teacher {
  id: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './teacher-management.html',
  styleUrl: './teacher-management.css'
})
export class TeacherManagement implements OnInit {

  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];

  searchTerm = '';

  loading = true;
  errorMessage = '';

  showEditModal = false;

  selectedTeacher: Teacher | null = null;

  editEmail = '';
  editRole = '';

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {

    this.auth.getTeachers().subscribe({

      next: (data: any) => {

        this.teachers = data || [];
        this.filteredTeachers = [...this.teachers];

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: () => {

        this.loading = false;
        this.errorMessage = 'Failed to load teachers';

        this.cdr.detectChanges();
      }
    });
  }

  filterTeachers(): void {

    const term =
      this.searchTerm
        .toLowerCase()
        .trim();

    this.filteredTeachers =
      this.teachers.filter(t =>
        t.email.toLowerCase().includes(term)
      );
  }

  editTeacher(teacher: Teacher): void {

    this.selectedTeacher = teacher;

    this.editEmail = teacher.email;
    this.editRole = teacher.role;

    this.showEditModal = true;
  }

  saveEdit(): void {

    if (!this.selectedTeacher) return;

    this.auth.updateTeacher(
      this.selectedTeacher.id,
      {
        email: this.editEmail,
        role: this.editRole
      }
    ).subscribe({

      next: () => {

        this.closeModal();

        this.loadTeachers();
      }
    });
  }

  deleteTeacher(id: number): void {

    this.auth.deleteTeacher(id)
      .subscribe(() => {

        this.loadTeachers();
      });
  }

  closeModal(): void {

    this.showEditModal = false;
  }

  trackById(
    index: number,
    teacher: Teacher
  ): number {

    return teacher.id;
  }
  logout(): void {

    const confirmed = confirm(
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
