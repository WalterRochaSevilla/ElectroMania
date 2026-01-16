import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../services/productos.service';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit, AfterViewInit {
  private router = inject(Router);

  @ViewChild('ofertasList', { static: true }) ofertasList!: ElementRef<HTMLDivElement>;
  @ViewChild('destacadosList', { static: true }) destacadosList!: ElementRef<HTMLDivElement>;
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;

  ofertasAbiertas = false;
  backgroundLoaded = false;

  // Productos Destacados
  productosDestacados: Product[] = [
    {
      product_id: 1,
      product_name: 'Arduino UNO R4 WiFi',
      price: 210.00,
      images: ['/arduino-uno.png'],
      description: 'Microcontrolador con WiFi integrado para proyectos IoT',
      stock: 25,
      state: false
    },
    {
      product_id: 2,
      product_name: 'Servomotor MG996R',
      price: 45.00,
      images: ['/servomotor.png'],
      description: 'Servomotor de alta torque para robótica',
      stock: 50,
      state: false
    },
    {
      product_id: 3,
      product_name: 'Sensor LiDAR TF-Luna',
      price: 320.00,
      images: ['/lidar-sensor.png'],
      description: 'Sensor de distancia por láser de alta precisión',
      stock: 15,
      state: false
    },
    {
      product_id: 4,
      product_name: 'Raspberry Pi 5 8GB',
      price: 850.00,
      images: ['/raspberry-pi.png'],
      description: 'Placa de desarrollo potente para proyectos avanzados',
      stock: 10,
      state: false
    },
    {
      product_id: 5,
      product_name: 'ESP32 Development Board',
      price: 120.00,
      images: ['/esp32.png'],
      description: 'Ideal para proyectos IoT y comunicaciones WiFi/Bluetooth',
      stock: 40,
      state: false
    },
    {
      product_id: 6,
      product_name: 'STM32 Blue Pill',
      price: 75.00,
      images: ['/stm32.png'],
      description: 'Microcontrolador ARM de alto rendimiento',
      stock: 35,
      state: false
    }
  ];

  // Productos en Oferta
  productosOferta: Product[] = [
    {
      product_id: 7,
      product_name: 'Driver Stepper TB6600',
      price: 55.00,
      images: ['/stepper-driver.png'],
      description: 'Controlador para motores paso a paso de hasta 4A',
      stock: 30,
      state: true
    },
    {
      product_id: 8,
      product_name: 'Motor Nema 23',
      price: 145.00,
      images: ['/nema-motor.png'],
      description: 'Motor paso a paso de alta precisión Nema 23',
      stock: 20,
      state: true
    },
    {
      product_id: 9,
      product_name: 'Módulo Relé 4 Canales',
      price: 25.00,
      images: ['/rele-module.png'],
      description: 'Módulo de 4 relés para control de cargas eléctricas',
      stock: 60,
      state: true
    },
    {
      product_id: 10,
      product_name: 'Kit de Cables Dupont',
      price: 15.00,
      images: ['/dupont-cables.png'],
      description: 'Kit completo de cables Dupont para prototipado',
      stock: 100,
      state: true
    },
    {
      product_id: 11,
      product_name: 'Fuente 12V 10A',
      price: 65.00,
      images: ['/power-supply.png'],
      description: 'Fuente de alimentación regulada 12V 10A',
      stock: 25,
      state: true
    },
    {
      product_id: 12,
      product_name: 'Display OLED 0.96"',
      price: 35.00,
      images: ['/oled-display.png'],
      description: 'Pantalla OLED I2C de alta resolución',
      stock: 45,
      state: true
    }
  ];

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

  verDetalles(producto: Product) {
    if (producto.product_id) {
      this.router.navigate(['/detalle-producto', producto.product_id]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  getPrecioConDescuento(producto: Product): number {
    // Assuming hardcoded 15% discount for offer products for now as 'descuento' is not in standard Interface yet or managed via 'state'
    if (this.productosOferta.includes(producto)) {
      return producto.price * 0.85;
    }
    return producto.price;
  }
}