import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ProductosService } from '../../../services/productos.service';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';
import { AuthService } from '../../../services/auth.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BaseChartDirective, AdminSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild('productChart') productChart: BaseChartDirective | undefined;

  modoOscuro = true;
  periodoSeleccionado: '7d' | '30d' | '90d' = '7d';
  periodoSeleccionadoProductos: '7d' | '30d' | '90d' = '7d';

  stats = {
    totalRevenue: 0,
    revenueChange: 0,
    lowStockCount: 0,
    systemStatus: 'Revisando...'
  };

  inventorySummary = {
    activeProducts: 0,
    newThisMonth: 0,
    categories: 0
  };

  lowStockProducts: any[] = [];

  constructor(
    private router: Router,
    private productosService: ProductosService,
    public authService: AuthService
  ) { }
  
  reabastecerProducto(id: string) {
    if (this.authService.canEdit()) {
       if (confirm('¿Reabastecer este producto?')) {
        console.log('Reabasteciendo producto:', id);
       }
      }else{
        console.log('Empleado: Solicitar permiso para reabastecer');
        alert('Contacta al administrador para reabastecer productos');
      }

  }

  ngOnInit() {
    this.loadDashboardData();
    this.updateProductTrendChart(); 
  }

  loadDashboardData() {
    this.productosService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });

    this.updateRevenueChart();
    this.updateProductTrendChart();

    this.productosService.getTopSellingProducts().subscribe(products => {
      this.barChartData.labels = products.map(p => p.name);
      this.barChartData.datasets[0].data = products.map(p => p.sold);
      this.chart?.update();
    });

    this.productosService.getLowStockProducts().subscribe(products => {
      this.lowStockProducts = products;
    });

    this.productosService.getInventorySummary().subscribe(summary => {
      this.inventorySummary = summary;
    });
  }

  /* =========================
     CHART 1: REVENUE (LINE)
  ========================= */
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Ventas (Bs.)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#6366f1',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 0.8)',
        fill: 'origin',
        tension: 0.4
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4
      }
    },
    scales: {
      y: {
        position: 'left',
        grid: {
          color: 'rgba(255,255,255,0.05)'
        },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: {
          display: false
        },
        ticks: { color: '#94a3b8' }
      }
    },
    plugins: {
      legend: { display: false }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  public lineChartType: ChartType = 'line';

  updateRevenueChart() {
    this.productosService.getRevenueStats(this.periodoSeleccionado).subscribe((res: any) => {
      this.lineChartData.labels = res.labels;
      this.lineChartData.datasets[0].data = res.data;
      this.chart?.update();
    });
  }

  /* =========================
     CHART 2: PRODUCT TREND (LINE) - TOTALMENTE FUNCIONAL
  ========================= */
  public lineChartProductData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [15, 22, 18, 25, 30, 27, 35],
        label: 'Productos Registrados',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: '#22c55e',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#22c55e',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 197, 94, 0.8)',
        fill: 'origin',
        tension: 0.4
      }
    ],
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  };

  public lineChartProductOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4
      }
    },
    scales: {
      y: {
        position: 'left',
        beginAtZero: true,
        grid: {
          color: 'rgba(255,255,255,0.05)'
        },
        ticks: { 
          color: '#94a3b8',
          callback: function(value) {
            return Number(value).toFixed(0);
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: { color: '#94a3b8' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Productos: ${context.parsed.y}`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  public lineChartProductType: ChartType = 'line';

  updateProductTrendChart() {
      this.productosService.getProductTrendStats(this.periodoSeleccionadoProductos).subscribe((res: any) => {
      this.lineChartProductData = {
      ...this.lineChartProductData,
      labels: res.labels,
      datasets: [{
        ...this.lineChartProductData.datasets[0],
        data: res.data
        }]
        };
        if (this.productChart && this.productChart.chart) {
           this.productChart.chart.update('none');
           }
    });
  }

  /* =========================
     CHART 3: TOP SELLING (BAR)
  ========================= */
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Unidades Vendidas',
        backgroundColor: [
          '#6366f1',
          '#818cf8',
          '#a5b4fc',
          '#c7d2fe'
        ],
        borderRadius: 4
      }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#e2e8f0', font: { weight: 'bold' } }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  public barChartType: ChartType = 'bar';

  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}