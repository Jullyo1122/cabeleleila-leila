import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Adicione Inject e PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Adicione isPlatformBrowser
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Injeta o ID da plataforma
  ) { }

  private getHeaders() {
    let token = '';

    // Verifica se estamos no navegador antes de acessar o localStorage
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('access_token') || '';
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  register(user: any) {
    return this.http.post(`${this.API_URL}/cadastro/register`, user);
  }

  login(user: any) {
    return this.http.post(`${this.API_URL}/login/login`, user);
  }

  agendar(payload: any) {
    return this.http.post(`${this.API_URL}/agendamento/agendar`, payload, {
      headers: this.getHeaders()
    });
  }

  getAgendamentos(): Observable<any> {
    return this.http.get(`${this.API_URL}/agendamento/agendamentos`);
  }

  getMeusAgendamentos() {
    return this.http.get<any[]>(`${this.API_URL}/agendamento/meus-agendamentos`, {
      headers: this.getHeaders()
    });
  }
  // No ApiService
  editarAgendamento(id: number, dados: any) {
    return this.http.put(`${this.API_URL}/agendamento/editar/${id}`, dados, {
      headers: this.getHeaders()
    });
  }
}