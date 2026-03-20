import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-agendamento-dialog',
  standalone: true,
  imports: [MatDialogModule,
  MatButtonModule],
  templateUrl: './agendamento-dialog.component.html',
  styleUrl: './agendamento-dialog.component.css'
})
export class AgendamentoDialogComponent {

}
imports: [
  MatDialogModule,
  MatButtonModule
]