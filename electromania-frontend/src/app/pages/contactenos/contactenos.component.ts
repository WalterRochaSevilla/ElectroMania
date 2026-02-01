import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contactenos',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.css']
})
export class ContactenosComponent {
  nombre = 'Ramiro Nogales';
  titulo = 'Ingeniero en Sistemas Electrónicos';
  telefono = '77436609';
  localidad = 'COCHABAMBA - BOLIVIA';
  email = 'contacto@electromania.bo';

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