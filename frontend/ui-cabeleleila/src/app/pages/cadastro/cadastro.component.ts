import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';




export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

// 🔥 Validador de senha
function senhaMatchValidator(form: AbstractControl) {
  const senha = form.get('senha')?.value;
  const confirmar = form.get('confirmarSenha')?.value;

  return senha === confirmar ? null : { senhaDiferente: true };
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class CadastroComponent {

  constructor(private api: ApiService) {}

  matcher = new MyErrorStateMatcher();

  hide = signal(true);
  hideConfirm = signal(true);

  form = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl('', Validators.required),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmarSenha: new FormControl('', Validators.required),
  }, { validators: senhaMatchValidator });

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  toggleConfirmPassword(event: MouseEvent) {
    this.hideConfirm.set(!this.hideConfirm());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.form.valid) {

      const { confirmarSenha, ...user } = this.form.value;

      this.api.register(user).subscribe({
        next: (res: any) => {
          console.log(res);
          alert(res.message);
          this.form.reset();
        },
        error: (err) => {
          console.error(err);
          alert(err.error.detail);
        }
      });
  }
  }
}