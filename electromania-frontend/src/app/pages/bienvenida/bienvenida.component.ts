import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  categoria: string;
  stock: number;
  oferta: boolean;
  descuento?: number;
}

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit, AfterViewInit {
  @ViewChild('ofertasList', { static: true }) ofertasList!: ElementRef<HTMLDivElement>;
  @ViewChild('destacadosList', { static: true }) destacadosList!: ElementRef<HTMLDivElement>;
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;

  ofertasAbiertas = false;
  backgroundLoaded = false;

  // Productos Destacados
  productosDestacados: Producto[] = [
    {
      id: 1,
      nombre: 'Arduino UNO R4 WiFi',
      precio: 210.00,
      imagen: '/arduino-uno.png',
      descripcion: 'Microcontrolador con WiFi integrado para proyectos IoT',
      categoria: 'Microcontroladores',
      stock: 25,
      oferta: false
    },
    {
      id: 2,
      nombre: 'Servomotor MG996R',
      precio: 45.00,
      imagen: '/servomotor.png',
      descripcion: 'Servomotor de alta torque para robótica',
      categoria: 'Motores',
      stock: 50,
      oferta: false
    },
    {
      id: 3,
      nombre: 'Sensor LiDAR TF-Luna',
      precio: 320.00,
      imagen: '/lidar-sensor.png',
      descripcion: 'Sensor de distancia por láser de alta precisión',
      categoria: 'Sensores',
      stock: 15,
      oferta: false
    },
    {
      id: 4,
      nombre: 'Raspberry Pi 5 8GB',
      precio: 850.00,
      imagen: '/raspberry-pi.png',
      descripcion: 'Placa de desarrollo potente para proyectos avanzados',
      categoria: 'SBC',
      stock: 10,
      oferta: false
    },
    {
      id: 5,
      nombre: 'ESP32 Development Board',
      precio: 120.00,
      imagen: '/esp32.png',
      descripcion: 'Ideal para proyectos IoT y comunicaciones WiFi/Bluetooth',
      categoria: 'IoT',
      stock: 40,
      oferta: false
    },
    {
      id: 6,
      nombre: 'STM32 Blue Pill',
      precio: 75.00,
      imagen: '/stm32.png',
      descripcion: 'Microcontrolador ARM de alto rendimiento',
      categoria: 'Microcontroladores',
      stock: 35,
      oferta: false
    }
  ];

  // Productos en Oferta
  productosOferta: Producto[] = [
    {
      id: 7,
      nombre: 'Driver Stepper TB6600',
      precio: 55.00,
      imagen: '/stepper-driver.png',
      descripcion: 'Controlador para motores paso a paso de hasta 4A',
      categoria: 'Drivers',
      stock: 30,
      oferta: true,
      descuento: 15
    },
    {
      id: 8,
      nombre: 'Motor Nema 23',
      precio: 145.00,
      imagen: '/nema-motor.png',
      descripcion: 'Motor paso a paso de alta precisión Nema 23',
      categoria: 'Motores',
      stock: 20,
      oferta: true,
      descuento: 20
    },
    {
      id: 9,
      nombre: 'Módulo Relé 4 Canales',
      precio: 25.00,
      imagen: '/rele-module.png',
      descripcion: 'Módulo de 4 relés para control de cargas eléctricas',
      categoria: 'Módulos',
      stock: 60,
      oferta: true,
      descuento: 10
    },
    {
      id: 10,
      nombre: 'Kit de Cables Dupont',
      precio: 15.00,
      imagen: '/dupont-cables.png',
      descripcion: 'Kit completo de cables Dupont para prototipado',
      categoria: 'Accesorios',
      stock: 100,
      oferta: true,
      descuento: 25
    },
    {
      id: 11,
      nombre: 'Fuente 12V 10A',
      precio: 65.00,
      imagen: '/power-supply.png',
      descripcion: 'Fuente de alimentación regulada 12V 10A',
      categoria: 'Fuentes',
      stock: 25,
      oferta: true,
      descuento: 18
    },
    {
      id: 12,
      nombre: 'Display OLED 0.96"',
      precio: 35.00,
      imagen: '/oled-display.png',
      descripcion: 'Pantalla OLED I2C de alta resolución',
      categoria: 'Displays',
      stock: 45,
      oferta: true,
      descuento: 12
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkBackgroundImage();
    setTimeout(() => {
      this.initCarruseles();
    }, 100);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkBackgroundImage();
    }, 500);
  }

  checkBackgroundImage() {
    const imgUrl = '/bienvenidafondo.png';
    const img = new Image();

    // Si ya cargó antes, no hacemos nada (evita parpadeo al volver)
    if (this.backgroundLoaded && this.heroSection?.nativeElement) {
      this.applyBackground(this.heroSection.nativeElement, imgUrl);
      return;
    }

    img.onload = () => {
      this.backgroundLoaded = true;
      if (this.heroSection?.nativeElement) {
        this.applyBackground(this.heroSection.nativeElement, imgUrl);
        this.heroSection.nativeElement.classList.remove('fallback-bg');
      }
    };

    img.onerror = () => {
      console.error('❌ No se pudo cargar la imagen de fondo:', imgUrl);
      this.backgroundLoaded = false;
      if (this.heroSection?.nativeElement) {
        this.heroSection.nativeElement.classList.add('fallback-bg');
      }
    };

    img.src = imgUrl;
  }

  applyBackground(element: HTMLElement, url: string) {
    element.style.backgroundImage = `url('${url}')`;
    element.style.backgroundPosition = 'center';
    element.style.backgroundSize = 'cover';
    element.style.backgroundRepeat = 'no-repeat';
  }

  irATienda() {
    this.router.navigate(['/home']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  verDetalles(producto: Producto) {
    this.router.navigate(['/detalle-producto', producto.id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleOfertas() {
    this.ofertasAbiertas = !this.ofertasAbiertas;
  }

  scrollOfertasPrev() {
    this.scrollCarrusel(this.ofertasList.nativeElement, -1);
  }

  scrollOfertasNext() {
    this.scrollCarrusel(this.ofertasList.nativeElement, 1);
  }

  scrollDestacadosPrev() {
    this.scrollCarrusel(this.destacadosList.nativeElement, -1);
  }

  scrollDestacadosNext() {
    this.scrollCarrusel(this.destacadosList.nativeElement, 1);
  }

  private scrollCarrusel(element: HTMLDivElement, direction: number) {
    if (!element) return;

    const scrollAmount = 340;

    element.scrollBy({
      left: scrollAmount * direction,
      behavior: 'smooth'
    });
  }

  initCarruseles() {
    if (this.ofertasList?.nativeElement) {
      this.addDragEvents(this.ofertasList.nativeElement);
    }
    if (this.destacadosList?.nativeElement) {
      this.addDragEvents(this.destacadosList.nativeElement);
    }
  }

  addDragEvents(element: HTMLDivElement) {
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    element.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      element.classList.add('active');
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    });

    element.addEventListener('mouseleave', () => {
      isDown = false;
      element.classList.remove('active');
    });

    element.addEventListener('mouseup', () => {
      isDown = false;
      element.classList.remove('active');
    });

    element.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 2;
      element.scrollLeft = scrollLeft - walk;
    });

    element.addEventListener('touchstart', (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    });

    element.addEventListener('touchend', () => {
      isDown = false;
    });

    element.addEventListener('touchmove', (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - element.offsetLeft;
      const walk = (x - startX) * 2;
      element.scrollLeft = scrollLeft - walk;
    });
  }

  setDefaultImage(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMwYjE2MjIiLz48cGF0aCBkPSJNMTUwIDEwMEwxMDAgMTUwTDE1MCAyMDBMMjAwIDE1MEwxNTAgMTAwWiIgZmlsbD0iIzAwZjJmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5Qcm9kdWN0byBObyBEaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
  }

  getPrecioConDescuento(producto: Producto): number {
    if (producto.oferta && producto.descuento) {
      return producto.precio * (1 - producto.descuento / 100);
    }
    return producto.precio;
  }
}