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
        localStorage.setItem(
          'email',
          response.email
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


  getAllContent() {

    return this.http.get<any[]>(

      `${this.adminUrl}/content`,

      this.getAuthHeaders()

    ).pipe(

      tap((data) => {

        console.log(
          'CONTENT RESPONSE:',
          data
        );

      })

    );
  }

  activateContent(id: number) {

    return this.http.put(

      `${this.adminUrl}/content/activate/${id}`,

      {},

      this.getAuthHeaders()
    );
  }

  deactivateContent(id: number) {

    return this.http.put(

      `${this.adminUrl}/content/deactivate/${id}`,

      {},

      this.getAuthHeaders()
    );
  }

  deleteContent(id: number) {

    return this.http.delete(

      `${this.adminUrl}/content/${id}`,

      this.getAuthHeaders()
    );
  }

  uploadContent(formData: FormData) {

    return this.http.post(

      `${this.adminUrl}/content/upload`,

      formData,

      this.getAuthHeaders()

    );
  }

  getTeacherContent() {

    return this.http.get(

      'http://localhost:8080/teacher',

      this.getAuthHeaders()
    );
  }

  activateTeacherContent(id: number) {

    return this.http.put(

      `http://localhost:8080/teacher/activate/${id}`,

      {},

      this.getAuthHeaders()
    );
  }

  deactivateTeacherContent(id: number) {

    return this.http.put(

      `http://localhost:8080/teacher/deactivate/${id}`,

      {},

      this.getAuthHeaders()
    );
  }

  deleteTeacherContent(id: number) {

    return this.http.delete(

      `http://localhost:8080/teacher/${id}`,

      this.getAuthHeaders()
    );
  }
  uploadTeacherContent(formData: FormData) {

    return this.http.post(

      'http://localhost:8080/teacher/upload',

      formData,

      this.getAuthHeaders()
    );
  }


  // Student Routes
  getStudentContent() {

    return this.http.get(

      'http://localhost:8080/student',

      this.getAuthHeaders()
    );
  }

  getNotes(contentId: number) {

    return this.http.get(

      `http://localhost:8080/student/notes/${contentId}`,

      this.getAuthHeaders()
    );
  }

  createNote(payload: any) {

    return this.http.post(

      'http://localhost:8080/student/notes',

      payload,

      this.getAuthHeaders()
    );
  }

  deleteNote(noteId: number) {

    return this.http.delete(

      `http://localhost:8080/student/notes/${noteId}`,

      this.getAuthHeaders()
    );
  }



  updateNote(
    id: number,
    payload: any
  ) {

    return this.http.put(

      `http://localhost:8080/student/notes/${id}`,

      payload,

      this.getAuthHeaders()

    );
  }

  chatWithAI(message: string) {
    const token = localStorage.getItem('token');
    return this.http.get(`http://localhost:8080/chat`, {
      params: { message },
      responseType: 'text',
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

}
