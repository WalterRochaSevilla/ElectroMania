export const ROUTES = {
  HOME: 'home',
  BIENVENIDA: 'bienvenida',
  LOGIN: 'login',
  REGISTRO: 'registro',
  PRODUCTO: 'producto',
  DETALLE_PRODUCTO: 'detalle-producto',
  SOBRE_NOSOTROS: 'sobre-nosotros',
  CONTACTENOS: 'contactenos',
  MIS_PEDIDOS: 'mis-pedidos',
  PERFIL: 'perfil',
  CONFIGURACION: 'configuracion',
  
  // Admin routes
  DASHBOARD: 'dashboard',
  PRODUCTOS_ADMIN: 'productos-admin',
  USUARIOS_ADMIN: 'usuarios-admin',
  PEDIDOS_ADMIN: 'pedidos-admin',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
