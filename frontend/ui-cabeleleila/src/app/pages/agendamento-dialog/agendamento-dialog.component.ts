import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // 👈 Adicionei MatDialogRef
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-agendamento-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    CommonModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agendamento-dialog.component.html',
  styleUrl: './agendamento-dialog.component.css'
})
export class AgendamentoDialogComponent implements OnInit {

  // Injetamos o MatDialogRef para conseguir fechar o modal via código
  constructor(
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AgendamentoDialogComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selected: string = '';
  horas: string[] = [];
  minutos: string[] = [];
  dataSelecionada: Date | null = null;
  horaSelecionada: string = '';
  minutoSelecionado: string = '';

  ngOnInit() {
    this.gerarHorarios();
    
    // 💡 SE EXISTIR DATA, PREENCHEMOS O FORMULÁRIO AUTOMATICAMENTE
    if (this.data) {
      this.selected = this.data.servico;
      // Converte a string "2026-03-21" de volta para objeto Date
      this.dataSelecionada = new Date(this.data.data + 'T00:00:00');
      
      const [hora, minuto] = this.data.horario.split(':');
      this.horaSelecionada = hora;
      this.minutoSelecionado = minuto;
    }
  }

  gerarHorarios() {
    for (let i = 8; i <= 18; i++) {
      this.horas.push(i.toString().padStart(2, '0'));
    }
    for (let i = 0; i < 60; i += 5) {
      this.minutos.push(i.toString().padStart(2, '0'));
    }
  }

  get horarioCompleto(): string {
    if (!this.horaSelecionada || !this.minutoSelecionado) return '';
    return `${this.horaSelecionada}:${this.minutoSelecionado}`;
  }

  onSubmit() {
    if (!this.dataSelecionada || !this.horarioCompleto) {
      alert('Preencha todos os campos');
      return;
    }

    // Ajuste de fuso horário para evitar que a data "volte um dia"
    const offset = this.dataSelecionada.getTimezoneOffset();
    const dataCorreta = new Date(this.dataSelecionada.getTime() - (offset * 60 * 1000));
    const dataFormatada = dataCorreta.toISOString().split('T')[0];

    const payload = {
      data: dataFormatada,
      horario: this.horarioCompleto,
      servico: this.selected,
    };

    if (this.data && this.data.id) {
      // EDITAR
      this.apiService.editarAgendamento(this.data.id, payload).subscribe({
        next: () => {
          alert('Agendamento atualizado! 🚀');
          this.dialogRef.close(true);
          
        },
        error: (err) => alert('Erro ao atualizar')
      });
    } else {
      // CRIAR NOVO (seu código original)
      this.apiService.agendar(payload).subscribe({
        next: () => {
          alert('Agendamento realizado 🚀');
          this.dialogRef.close(true);
        },
        error: (err) => alert('Erro ao agendar')
      });
    }
  }
}