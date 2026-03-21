import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  hide = signal(true);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', Validators.required)
  });

  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(private api: ApiService) {}

  onSubmit() {
    if (this.form.valid) {

    const user = {
      email: this.form.value.email!,
      senha: this.form.value.senha!
    };
    this.api.login(user).subscribe({
      next: (res: any) => {
        console.log(res);

        // 🔐 se tiver token (JWT)
        if (res.access_token) {
          localStorage.setItem('access_token', res.access_token);
        }

        alert('Login realizado com sucesso 🚀');
      },
      error: (err) => {
        console.error(err);
        alert(err.error.detail || 'Erro no login');
      }
    });
  }
  }
}