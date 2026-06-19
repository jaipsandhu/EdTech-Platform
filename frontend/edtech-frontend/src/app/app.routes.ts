import { Routes } from '@angular/router';

import { Landing } from './features/landing/landing/landing';

import { Signin } from './features/auth/signin/signin';
import { Register } from './features/auth/register/register';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';

import { AdminDashboard } from './features/admin/dashboard/admin-dashboard/admin-dashboard';
import { StudentManagement } from './features/admin/student-management/student-management';
import { TeacherManagement } from './features/admin/teacher-management/teacher-management';
import { ContentManagement } from './features/admin/content-management/content-management';

import { TeacherDashboard } from './features/teacher/teacher-dashboard/teacher-dashboard';
import { StudentDashboard } from './features/student/student-dashboard/student-dashboard';

export const routes: Routes = [

  // Landing Page
  {
    path: '',
    component: Landing
  },

  // Auth
  {
    path: 'signin',
    component: Signin
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'forgot-password',
    component: ForgotPassword
  },

  // Admin
  {
    path: 'admin',
    component: AdminDashboard
  },

  {
    path: 'admin/students',
    component: StudentManagement
  },

  {
    path: 'admin/teachers',
    component: TeacherManagement
  },

  {
    path: 'admin/content',
    component: ContentManagement
  },

  // Teacher
  {
    path: 'teacher',
    component: TeacherDashboard
  },

  // Student
  {
    path: 'student',
    component: StudentDashboard
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }

];
