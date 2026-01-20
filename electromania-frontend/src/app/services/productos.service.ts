import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) { }

  getProductos() {
    return this.httpClient.get(`${environment.API_DOMAIN}/product/all`)
  }

  getCategorias() {
    const categories = [
      'Arduino & Microcontroladores',
      'Sensores',
      'Componentes Pasivos',
      'Motores & Drivers',
      'Pantallas & Displays',
      'Fuentes de Energía',
      'Herramientas',
      'Impresión 3D',
      'Conectividad & Cables',
      'Kits Educativos'
    ];
    return of(categories);
  }

  /* =========================
     MOCK DASHBOARD DATA
  ========================= */
  getDashboardStats() {
    return of({
      totalRevenue: 12450.00,
      revenueChange: 12,
      lowStockCount: 5,
      systemStatus: 'Online'
    });
  }

  getRevenueStats(period: '7d' | '30d' | '90d') {
    // Datos diferentes para cada período
    if (period === '7d') {
      return of({
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        data: [7000, 8500, 6000, 9000, 7500, 9500, 8000]
      });
    } else if (period === '30d') {
      // 4 semanas con datos diferentes
      return of({
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        data: [32000, 28000, 35000, 42000]
      });
    } else {
      // 90 días - 3 meses
      return of({
        labels: ['Mes 1', 'Mes 2', 'Mes 3'],
        data: [98000, 105000, 120000]
      });
    }
  }

  getProductTrendStats(period: '7d' | '30d' | '90d') {
    // Datos COMPLETAMENTE DIFERENTES para cada período
    if (period === '7d') {
      return of({
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        data: [15, 22, 18, 25, 30, 27, 35]
      });
    } else if (period === '30d') {
      return of({
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        data: [120, 145, 160, 180]
      });
    } else {
      // 90 días
      return of({
        labels: ['Mes 1', 'Mes 2', 'Mes 3'],
        data: [350, 420, 390]
      });
    }
  }

  getInventorySummary() {
    return of({
      activeProducts: 124,
      newThisMonth: 12,
      categories: 8
    });
  }

  getTopSellingProducts() {
    return of([
      { name: 'Arduino UNO R3', sold: 120 },
      { name: 'ESP32 DevKit', sold: 95 },
      { name: 'Sensor HC-SR04', sold: 80 },
      { name: 'Servo SG90', sold: 65 }
    ]);
  }

  getLowStockProducts() {
    return of([
      { id: '#089', name: 'Sensor Humedad DHT11', stock: 2, status: 'Crítico' },
      { id: '#102', name: 'Cable Jumper M-M', stock: 5, status: 'Bajo' },
      { id: '#205', name: 'Resistencia 220Ω', stock: 8, status: 'Bajo' },
      { id: '#012', name: 'Display LCD 16x2', stock: 0, status: 'Agotado' }
    ]);
  }
}