import { Component, OnInit, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ProductosService } from '../../../services/productos.service';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';
import { ThemeService } from '../../../services/theme.service';

interface LowStockProduct {
  id: number;
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
  private themeService = inject(ThemeService);

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  periodoSeleccionado: '7d' | '30d' | '90d' = '7d';

  stats = {
    totalRevenue: 0,
    revenueChange: 0,
    lowStockCount: 0,
    systemStatus: 'Revisando...'
  };

  lowStockProducts: LowStockProduct[] = [];

  constructor() {
    effect(() => {
      const isDark = this.themeService.isDark();
      this.updateChartColors(isDark);
    });
  }

  async ngOnInit() {
    await this.loadDashboardData();
  }

  private updateChartColors(isDark: boolean) {
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const labelColor = isDark ? '#e2e8f0' : '#1e293b';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    if (this.lineChartOptions?.scales) {
      const scales = this.lineChartOptions.scales as Record<string, { ticks?: { color?: string }, grid?: { color?: string } }>;
      if (scales['y']?.ticks) scales['y'].ticks.color = textColor;
      if (scales['y']?.grid) scales['y'].grid.color = gridColor;
      if (scales['x']?.ticks) scales['x'].ticks.color = textColor;
    }

    if (this.barChartOptions?.scales) {
      const scales = this.barChartOptions.scales as Record<string, { ticks?: { color?: string }, grid?: { color?: string } }>;
      if (scales['x']?.ticks) scales['x'].ticks.color = textColor;
      if (scales['x']?.grid) scales['x'].grid.color = gridColor;
      if (scales['y']?.ticks) scales['y'].ticks.color = labelColor;
    }

    this.chart?.update();
  }

  async loadDashboardData() {
    this.stats = await this.productosService.getDashboardStats();
    await this.updateRevenueChart();

    const topProducts = await this.productosService.getTopSellingProducts();
    this.barChartData.labels = topProducts.map(p => p.name);
    this.barChartData.datasets[0].data = topProducts.map(p => p.sold);
    this.chart?.update();

    this.lowStockProducts = await this.productosService.getLowStockProducts();
  }

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

  async updateRevenueChart() {
    const res = await this.productosService.getRevenueStats(this.periodoSeleccionado);
    this.lineChartData.labels = res.labels;
    this.lineChartData.datasets[0].data = res.data;
    this.chart?.update();
  }

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
        ticks: { color: '#94a3b8', font: { weight: 'bold' } }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  public barChartType: ChartType = 'bar';

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

  reabastecer(productId: number) {
    this.router.navigate(['/productos-admin'], { queryParams: { restock: productId } });
  }
}
