import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

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

  constructor(private router: Router) {}

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
}
