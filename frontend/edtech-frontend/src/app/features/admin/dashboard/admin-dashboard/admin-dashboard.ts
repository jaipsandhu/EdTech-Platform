import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

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
