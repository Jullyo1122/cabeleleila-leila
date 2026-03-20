import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post('http://localhost:8000/cadastro/register', user);
  }
  login(user: any) {
  return this.http.post('http://localhost:8000/login/login', user);
}
}