import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';

interface Student {
  id: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './student-management.html',
  styleUrl: './student-management.css'
})
export class StudentManagement implements OnInit {

  students: Student[] = [];
  filteredStudents: Student[] = [];

  searchTerm = '';
  loading = true;
  errorMessage = '';

  showEditModal = false;
  selectedStudent: Student | null = null;

  editEmail = '';
  editRole = '';

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {

    this.loading = true;
    this.errorMessage = '';

    this.auth.getStudents().subscribe({

      next: (data: any) => {

        this.students = Array.isArray(data)
          ? data
          : [];

        this.filteredStudents = [...this.students];

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err: any) => {

        console.error(err);

        this.errorMessage =
          'Failed to load students';

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  filterStudents(): void {

    const term =
      this.searchTerm
        .toLowerCase()
        .trim();

    if (!term) {

      this.filteredStudents =
        [...this.students];

      return;
    }

    this.filteredStudents =
      this.students.filter(student =>
        student.email
          .toLowerCase()
          .includes(term)
      );
  }

  editStudent(student: Student): void {

    this.selectedStudent = {
      ...student
    };

    this.editEmail = student.email;
    this.editRole = student.role;

    this.showEditModal = true;
  }

  saveEdit(): void {

    if (!this.selectedStudent) {
      return;
    }

    const payload = {
      email: this.editEmail,
      role: this.editRole
    };

    this.auth
      .updateStudent(
        this.selectedStudent.id,
        payload
      )
      .subscribe({

        next: () => {

          this.loadStudents();

          this.closeModal();
        },

        error: (err) => {

          console.error(err);

          alert(
            'Failed to update student'
          );
        }
      });
  }

  deleteStudent(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this student?'
      )
    ) {
      return;
    }

    this.auth
      .deleteStudent(id)
      .subscribe({

        next: () => {

          this.loadStudents();
        },

        error: (err) => {

          console.error(err);

          alert(
            'Failed to delete student'
          );
        }
      });
  }

  closeModal(): void {

    this.showEditModal = false;

    this.selectedStudent = null;
  }

  trackById(
    index: number,
    student: Student
  ): number {

    return student.id;
  }
}
