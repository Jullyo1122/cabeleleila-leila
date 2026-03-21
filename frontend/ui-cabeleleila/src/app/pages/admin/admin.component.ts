import { Component, OnInit } from '@angular/core'; // Adicionei OnInit
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // 👈 Importe o MatDialog
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AgendamentoDialogComponent } from '../agendamento-dialog/agendamento-dialog.component'; // 👈 Importe seu componente de dialog
import { Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule, MatDialogModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  agendamentos: any[] = [];

  // Injetamos o MatDialog aqui
  constructor(
    private service: ApiService, 
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.carregarAgendamentos();
  }

  // Criamos essa função para poder repetir a chamada
  carregarAgendamentos() {
    this.service.getAgendamentos().subscribe({
      next: (data) => {
        this.agendamentos = data;
        console.log('Lista atualizada:', data);
      },
      error: (err) => console.error('Erro ao buscar agendamentos:', err)
    });
  }

  // Função para abrir o modal de agendamento (caso queira abrir por aqui também)
  abrirAgendamento() {
    const dialogRef = this.dialog.open(AgendamentoDialogComponent, {
      width: '400px'
    });

    // A MÁGICA ACONTECE AQUI:
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Se o modal fechou enviando 'true', atualizamos a tabela
        this.carregarAgendamentos();
      }
    });
  }

  editar(agendamento: any) {
  const dialogRef = this.dialog.open(AgendamentoDialogComponent, {
      width: '400px',
      data: { ...agendamento } // Isso aqui envia o dado para o modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.carregarAgendamentos();
    });
}
}