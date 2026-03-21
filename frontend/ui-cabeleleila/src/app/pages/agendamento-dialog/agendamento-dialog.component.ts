import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendamento-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDialogModule,
    MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agendamento-dialog.component.html',
  styleUrl: './agendamento-dialog.component.css'
})
export class AgendamentoDialogComponent {

  constructor(private http: HttpClient) {}

  selected: string = '';

  horas: string[] = [];
  minutos: string[] = [];

  dataSelecionada: Date | null = null;

  ngOnInit() {
    this.gerarHorarios();
  }

  gerarHorarios() {
    // Horas (08 até 18 por exemplo)
    for (let i = 8; i <= 18; i++) {
      this.horas.push(i.toString().padStart(2, '0'));
    }

    // Minutos (de 5 em 5)
    for (let i = 0; i < 60; i += 5) {
      this.minutos.push(i.toString().padStart(2, '0'));
    }
  }

  horaSelecionada: string = '';
  minutoSelecionado: string = '';

  get horarioCompleto(): string {
    if (!this.horaSelecionada || !this.minutoSelecionado) return '';
    return `${this.horaSelecionada}:${this.minutoSelecionado}`;
  }
   // 🚀 SUBMIT
  onSubmit() {

    if (!this.dataSelecionada || !this.horarioCompleto) {
      alert('Preencha todos os campos');
      return;
    }

    const dataFormatada = this.dataSelecionada.toISOString().split('T')[0];

    const payload = {
      data: dataFormatada,
      horario: this.horarioCompleto,
      servico: this.selected,
    };

    console.log(payload);

    this.http.post('http://127.0.0.1:8000/agendamento/agendar', payload)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert('Agendamento realizado 🚀');
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao agendar');
        }
      });
  }
}
