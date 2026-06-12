import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

interface Teacher {
  id: number;
  email: string;
  role: string;
}

@Component({
  selector: 'app-teacher-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-management.html',
  styleUrl: './teacher-management.css'
})
export class TeacherManagement implements OnInit {

  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  showEditModal: boolean = false;
  selectedTeacher: Teacher | null = null;
  editEmail: string = '';
  editRole: string = '';

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.loading = true;
    this.errorMessage = '';

    console.log('📤 Fetching teachers...');

    this.auth.getTeachers().subscribe({
      next: (data: any) => {
        console.log('✅ Teachers received:', data);

        this.teachers = Array.isArray(data) ? data : [];
        this.filteredTeachers = [...this.teachers];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Failed to load teachers:', err);
        this.errorMessage = 'Failed to load teachers. Please check console.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterTeachers(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredTeachers = [...this.teachers];
    } else {
      this.filteredTeachers = this.teachers.filter(teacher =>
        teacher.email.toLowerCase().includes(term)
      );
    }
  }

  editTeacher(teacher: Teacher): void {
    this.selectedTeacher = { ...teacher };
    this.editEmail = teacher.email;
    this.editRole = teacher.role || 'TEACHER';
    this.showEditModal = true;
  }

  saveEdit(): void {
    if (!this.selectedTeacher) return;

    const payload = {
      email: this.editEmail,
      role: this.editRole
    };

    this.auth.updateTeacher(this.selectedTeacher.id, payload).subscribe({
      next: () => {
        console.log('✅ Teacher updated');
        this.loadTeachers();   // Refresh list
        this.closeModal();
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update teacher');
      }
    });
  }

  deleteTeacher(id: number): void {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    this.auth.deleteTeacher(id).subscribe({
      next: () => {
        console.log('✅ Teacher deleted');
        this.loadTeachers();   // Refresh list
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete teacher');
      }
    });
  }

  closeModal(): void {
    this.showEditModal = false;
    this.selectedTeacher = null;
  }

  trackById(index: number, teacher: Teacher): number {
    return teacher.id;
  }
}
