import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class Auth {

  private baseUrl =
    'http://localhost:8080/home';

  private adminUrl =
    'http://localhost:8080/admin';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // SIGNIN
  // =========================

  signin(data: any) {

    return this.http.post<any>(

      `${this.baseUrl}/signin`,

      data

    ).pipe(

      tap((response) => {

        console.log(
          'LOGIN RESPONSE:',
          response
        );

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'role',
          response.role
        );

        console.log(
          'TOKEN SAVED:',
          localStorage.getItem('token')
        );

      })

    );
  }

  // =========================
  // REGISTER
  // =========================

  register(data: any) {

    return this.http.post(

      `${this.baseUrl}/register`,

      data
    );
  }

  // =========================
  // VERIFY OTP
  // =========================

  verifyOtp(data: any) {

    return this.http.post(

      `${this.baseUrl}/verify`,

      data
    );
  }

  // =========================
  // RECOVERY
  // =========================

  recovery(data: any) {

    return this.http.post(

      `${this.baseUrl}/recovery`,

      data
    );
  }

  // =========================
  // RECOVERY VERIFY
  // =========================

  recoveryVerify(data: any) {

    return this.http.post(

      `${this.baseUrl}/rverify`,

      data
    );
  }

  // =========================
  // NEW PASSWORD
  // =========================

  newPassword(data: any) {

    return this.http.post(

      `${this.baseUrl}/newpass`,

      data
    );
  }

  // =========================
  // JWT HEADER
  // =========================

  private getAuthHeaders() {

    const token =
      localStorage.getItem('token');

    console.log(
      'TOKEN USED:',
      token
    );

    return {

      headers: new HttpHeaders({

        Authorization:
          `Bearer ${token}`
      })
    };
  }

  // =========================
  // STUDENTS
  // =========================

  getStudents() {

    return this.http.get<any[]>(

      `${this.adminUrl}/students`,

      this.getAuthHeaders()

    ).pipe(

      tap((data) => {

        console.log(
          'STUDENTS RESPONSE:',
          data
        );

      })

    );
  }

  updateStudent(
    id: number,
    payload: any
  ) {

    return this.http.put(

      `${this.adminUrl}/students/${id}`,

      payload,

      this.getAuthHeaders()
    );
  }

  deleteStudent(id: number) {

    return this.http.delete(

      `${this.adminUrl}/students/${id}`,

      this.getAuthHeaders()
    );
  }

  // =========================
  // TEACHERS
  // =========================

  getTeachers() {

    return this.http.get<any[]>(

      `${this.adminUrl}/teachers`,

      this.getAuthHeaders()

    ).pipe(

      tap((data) => {

        console.log(
          'TEACHERS RESPONSE:',
          data
        );

      })

    );
  }

  updateTeacher(
    id: number,
    payload: any
  ) {

    return this.http.put(

      `${this.adminUrl}/teachers/${id}`,

      payload,

      this.getAuthHeaders()
    );
  }

  deleteTeacher(id: number) {

    return this.http.delete(

      `${this.adminUrl}/teachers/${id}`,

      this.getAuthHeaders()
    );
  }

}
