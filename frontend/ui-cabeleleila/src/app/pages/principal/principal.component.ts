import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgendamentoDialogComponent } from '../agendamento-dialog/agendamento-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, MatDialogModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  constructor(private dialog: MatDialog, private router: Router) { }

  abrirAgendamento() {
    this.dialog.open(AgendamentoDialogComponent, {
      width: '400px'
    });
  }
  irParaAgendamentos() {
  this.router.navigate(['/meusagendamentos']);
}
}
