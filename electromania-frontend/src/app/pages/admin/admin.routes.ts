import { Routes } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
export const adminRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        providers: [provideCharts(withDefaultRegisterables())],
    },
];