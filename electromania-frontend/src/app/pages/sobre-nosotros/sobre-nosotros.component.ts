import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Si necesitas cargar datos externos
  }
}