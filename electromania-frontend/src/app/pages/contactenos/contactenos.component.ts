import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para directivas básicas

@Component({
  selector: 'app-contactenos',
  standalone: true, // <--- ASEGÚRATE DE QUE ESTO ESTÉ AQUÍ
  imports: [CommonModule],
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent {
  nombre: string = 'Ramiro Nogales';
  titulo: string = 'Ingeniero en Sistemas Electrónicos';
  telefono: string = '77436609';
  localidad: string = 'COCHABAMBA - BOLIVIA';
  email: string = 'contacto@electromania.bo';

  openWhatsApp() {
    const numeroCompleto = `+591${this.telefono}`;
    const mensaje = 'Hola, me interesa más información sobre sus servicios';
    const url = `https://wa.me/${numeroCompleto}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  sendEmail() {
    window.location.href = `mailto:${this.email}?subject=Consulta%20ElectroMania&body=Hola,%20me%20interesa%20más%20información%20sobre...`;
  }
}