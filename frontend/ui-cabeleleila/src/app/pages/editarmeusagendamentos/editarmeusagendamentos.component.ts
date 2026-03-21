import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-editar-agendamento-modal',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Editar Agendamento</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%">
        <mat-label>Nova Data</mat-label>
        <input matInput type="date" [(ngModel)]="data.data">
      </mat-form-field>
      
      <mat-form-field appearance="fill" style="width: 100%">
        <mat-label>Novo Horário</mat-label>
        <input matInput type="time" [(ngModel)]="data.horario">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="salvar()">Salvar Alterações</button>
    </mat-dialog-actions>
  `
})
export class editarmeusagendamentosComponent {
  constructor(
    public dialogRef: MatDialogRef<editarmeusagendamentosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService
  ) {}

  cancelar() {
    this.dialogRef.close();
  }

  salvar() {
    this.api.editarAgendamento(this.data.id, this.data).subscribe({
      next: () => {
        alert('Agendamento atualizado! 🚀');
        this.dialogRef.close(true);
      },
      error: (err) => alert(err.error.detail || 'Erro ao salvar')
    });
  }
}