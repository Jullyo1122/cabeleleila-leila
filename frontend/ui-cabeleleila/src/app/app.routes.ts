import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { LoginComponent } from './pages/login/login.component';
import { PrincipalComponent } from './pages/principal/principal.component';


export const routes: Routes = [
    {
        path: 'cadastro', component: CadastroComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'principal', component: PrincipalComponent
    }
];
