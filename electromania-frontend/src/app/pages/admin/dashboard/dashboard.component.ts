import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ProductosService } from '../../../services/productos.service';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, AdminSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private productosService = inject(ProductosService);

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  modoOscuro = true;
  periodoSeleccionado: '7d' | '30d' | '90d' = '7d';

  // Stats
  stats = {
    totalRevenue: 0,
    revenueChange: 0,
    lowStockCount: 0,
    systemStatus: 'Revisando...'
  };

  lowStockProducts: LowStockProduct[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // 1. Load KPI Stats
    this.productosService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });

    // 2. Load Revenue Chart
    this.updateRevenueChart();

    // 3. Load Top Selling
    this.productosService.getTopSellingProducts().subscribe(products => {
      this.barChartData.labels = products.map(p => p.name);
      this.barChartData.datasets[0].data = products.map(p => p.sold);
      this.chart?.update();
    });

    // 4. Load Low Stock Table
    this.productosService.getLowStockProducts().subscribe(products => {
      this.lowStockProducts = products;
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
        backgroundColor: 'rgba(99, 102, 241, 0.2)', // Indigo 500 with opacity
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
    this.productosService.getRevenueStats(this.periodoSeleccionado).subscribe(res => {
      this.lineChartData.labels = res.labels;
      this.lineChartData.datasets[0].data = res.data;
      this.chart?.update();
    });
  }

  /* =========================
     CHART 2: TOP SELLING (BAR)
  ========================= */
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Unidades Vendidas',
        backgroundColor: [
          '#6366f1', // Indigo
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
    indexAxis: 'y', // Horizontal bar
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

  /* =========================
     ACTIONS
  ========================= */
  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}