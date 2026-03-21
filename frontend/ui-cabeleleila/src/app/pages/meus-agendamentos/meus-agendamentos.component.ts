import { Component, Inject, PLATFORM_ID} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Para o *ngFor e *ngIf
import { MatCardModule } from '@angular/material/card'; // Para o <mat-card>
import { MatButtonModule } from '@angular/material/button'; // Para o mat-raised-button
import { MatIconModule } from '@angular/material/icon'; // Caso queira usar ícones de cadeado/edição
import { MatTableModule } from '@angular/material/table'; // Se preferir listar em tabela em vez de cards
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Importe estes
import { editarmeusagendamentosComponent } from '../editarmeusagendamentos/editarmeusagendamentos.component';

@Component({
  selector: 'app-meus-agendamentos',
  standalone: true,
  imports: [CommonModule, MatCardModule,MatButtonModule, MatIconModule, MatTableModule, MatDialogModule],
  templateUrl: './meus-agendamentos.component.html',
  styleUrl: './meus-agendamentos.component.css'
})
export class MeusAgendamentosComponent {

  agendamentos: any[] = [];
  isAdmin: boolean = false; // Controle local

  constructor(private api: ApiService,private dialog: MatDialog,@Inject(PLATFORM_ID) private platformId: Object // Injeta aqui também
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.verificarAdmin();
      this.carregarAgendamentos();
    }
  }

  verificarAdmin() {
    // Busca no localStorage ou decodifica o token para saber se é admin
    // Isso evita que o botão apareça bloqueado para a Vanessa (Admin)
    const role = localStorage.getItem('is_admin');
    this.isAdmin = role === '1' || role === 'true';
  }

  carregarAgendamentos() {
    this.api.getMeusAgendamentos().subscribe({
      next: (data) => this.agendamentos = data,
      error: (err) => console.error('Erro ao buscar agendamentos', err)
    });
    }

  podeEditar(dataAgendada: string, horaAgendada: string): boolean {
  if (this.isAdmin) return true; // Vanessa sempre pode!

  const agora = new Date();
  
  // Como sua data já vem como 2026-03-25, o Date() entende direto!
  // Montamos a string completa: "2026-03-25T12:10:00"
  const dataEvento = new Date(`${dataAgendada}T${horaAgendada}`);

  // Se a data for inválida, bloqueia
  if (isNaN(dataEvento.getTime())) {
    console.error("Data inválida recebida:", dataAgendada, horaAgendada);
    return false;
  }

  const diffEmMs = dataEvento.getTime() - agora.getTime();
  const diffEmHoras = diffEmMs / (1000 * 60 * 60);

  // LOG para você conferir no console (F12)
  console.log(`Agendamento: ${dataAgendada} | Horas restantes: ${diffEmHoras.toFixed(1)}h`);

  return diffEmHoras > 48;
}
  editar(agendamento: any) {
    const dialogRef = this.dialog.open(editarmeusagendamentosComponent, {
      width: '400px',
      data: agendamento // Passa os dados do agendamento para o modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarAgendamentos(); // Recarrega a lista se houve alteração
      }
    });

}}
