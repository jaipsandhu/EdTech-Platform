import { Routes } from '@angular/router';

import { Signin } from './features/auth/signin/signin';

import { Register } from './features/auth/register/register';

import { ForgotPassword } from './features/auth/forgot-password/forgot-password';

import { AdminDashboard } from './features/admin/dashboard/admin-dashboard/admin-dashboard';

import { StudentManagement } from './features/admin/student-management/student-management';

import { TeacherManagement } from './features/admin/teacher-management/teacher-management';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },

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



];
