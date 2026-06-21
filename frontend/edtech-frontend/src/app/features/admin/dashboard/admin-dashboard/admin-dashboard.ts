import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { Auth } from '../../../../core/services/auth';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {}

  goToDashboard() {
    this.router.navigate(['/admin']);
  }

  goToStudents() {
    this.router.navigate(['/admin/students']);
  }

  goToTeachers() {
    this.router.navigate(['/admin/teachers']);
  }

  goToContent() {
    this.router.navigate(['/admin/content']);
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
