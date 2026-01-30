import { environment } from '../../environments/environment';

const BASE = environment.API_DOMAIN;

export const API = {
  BASE,
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    REGISTER: `${BASE}/auth/register`,
  },
  PRODUCTS: {
    ALL: `${BASE}/products/all`,
    PAGE: (page: number) => `${BASE}/products?page=${page}`,
    REGISTER: `${BASE}/products/register`,
    UPDATE: (id: number | string) => `${BASE}/products/update/?id=${id}`,
    DELETE: (id: number | string) => `${BASE}/products/delete/${id}`,
    ADD_IMAGE: `${BASE}/products/addImage`,
  },
  USERS: {
    ALL: `${BASE}/users/all`,
    GET: `${BASE}/users/get`,
  },
  CATEGORY: {
    BASE: `${BASE}/category`,
    BY_ID: (id: number) => `${BASE}/category/${id}`,
    REGISTER: `${BASE}/category/register`,
    ADD_PRODUCT: `${BASE}/category/addProduct`,
  },
  ORDER: {
    BASE: `${BASE}/order`,
    BY_ID: (id: number) => `${BASE}/order/${id}`,
    REGISTER: `${BASE}/order/register`,
  },
  CART: {
    BASE: `${BASE}/cart`,
    CREATE: `${BASE}/cart/create`,
    ADD_PRODUCT: `${BASE}/cart/addProduct`,
    DELETE_PRODUCT: `${BASE}/cart/deleteProduct`,
    UPDATE: `${BASE}/cart/update`,
  },
} as const;
