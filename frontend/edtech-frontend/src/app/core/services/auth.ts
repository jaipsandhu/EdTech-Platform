import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class Auth {

  private baseUrl = 'http://localhost:8080/home';

  constructor(private http: HttpClient) {}

  signin(data: any) {

    return this.http.post(
      `${this.baseUrl}/signin`,
      data
    );

  }

  register(data: any) {

    return this.http.post(
      `${this.baseUrl}/register`,
      data
    );

  }

  verifyOtp(data: any) {

    return this.http.post(
      `${this.baseUrl}/verify`,
      data
    );

  }

  recovery(data: any) {

    return this.http.post(
      `${this.baseUrl}/recovery`,
      data
    );

  }

  recoveryVerify(data: any) {

    return this.http.post(
      `${this.baseUrl}/rverify`,
      data
    );

  }

  newPassword(data: any) {

    return this.http.post(
      `${this.baseUrl}/newpass`,
      data
    );

  }

}
