import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // 👈 aquí está FormGroup
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nit: ['', Validators.required],
      razonSocial: ['', Validators.required],
      telefono: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.authService.register(this.registroForm.value).subscribe({
        next: () => {
          this.toastr.success('Registro exitoso! Por favor inicia sesión');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastr.error('Error en el registro: ' + err.error.message);
        }
      });
    }
  }
}
