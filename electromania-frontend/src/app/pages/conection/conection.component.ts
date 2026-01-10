import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConectionService } from '../../services/conection.service';
@Component({
  selector: 'app-conection',
  imports: [CommonModule],
  templateUrl: './conection.component.html',
  styleUrl: './conection.component.css'
})
export class ConectionComponent  implements OnInit {

  constructor(public conection: ConectionService) {}
  ngOnInit() {
    console.log('Antes del request');

    this.conection.check().subscribe({
      next: (res) => {
        console.log('Respuesta backend:', res);
      },
      error: (err) => {
        console.error('Error HTTP real:', err);
      }
    });

    console.log('Después del request');
  }
}
