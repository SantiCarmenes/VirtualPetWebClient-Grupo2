export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  stockCount: number;
  variants?: string[];
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Alimento Premium Perros Adultos 15kg",
    description: "Alimento balanceado completo para perros adultos de razas medianas y grandes. Alta digestibilidad y croquetas adaptadas.",
    price: 45999,
    category: "alimentos",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockCount: 45,
    variants: ["Pollo y Carne", "Salmón"]
  },
  {
    id: "p2",
    name: "Collar Ajustable Reflectivo",
    description: "Collar de nylon resistente con costuras reflectivas para paseos nocturnos seguros.",
    price: 4500,
    category: "accesorios",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockCount: 120,
    variants: ["Rojo", "Azul", "Negro"]
  },
  {
    id: "p3",
    name: "Juguete Rascador Gato Torre",
    description: "Torre rascador de 3 niveles con pompones y base de peluche suave. Ideal para mantener a tu gato entretenido.",
    price: 32500,
    category: "juguetes",
    imageUrl: "/placeholder.svg",
    inStock: false,
    stockCount: 0,
  },
  {
    id: "p4",
    name: "Alimento Gato Esterilizado 3kg",
    description: "Fórmula especial para gatos esterilizados, control de peso y cuidado del tracto urinario.",
    price: 18200,
    category: "alimentos",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockCount: 12,
  },
  {
    id: "p5",
    name: "Hueso de Goma Masticable",
    description: "Juguete masticable sabor a carne que ayuda a limpiar los dientes y prevenir el sarro.",
    price: 6800,
    category: "juguetes",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockCount: 34,
  },
  {
    id: "p6",
    name: "Shampoo Hipoalergénico 500ml",
    description: "Shampoo suave para pieles sensibles, con extracto de avena y aloe vera.",
    price: 8900,
    category: "higiene",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockCount: 22,
  },
  {
    id: "p7",
    name: "Cucha Cama Nido Soft",
    description: "Cama circular ultra suave para perros pequeños o gatos. Lavable a máquina.",
    price: 24000,
    category: "accesorios",
    imageUrl: "/placeholder.svg",
    inStock: false,
    stockCount: 0,
    variants: ["S", "M"]
  },
  {
    id: "p8",
    name: "Pipeta Antipulgas Perros 10-20kg",
    description: "Protección mensual contra pulgas, garrapatas y mosquitos. Fácil aplicación.",
    price: 11500,
    category: "higiene",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockCount: 89,
  }
];

export const CATEGORIES = [
  { id: "alimentos", name: "Alimentos" },
  { id: "accesorios", name: "Accesorios" },
  { id: "juguetes", name: "Juguetes" },
  { id: "higiene", name: "Higiene y Salud" }
];

export type OrderStatus = 'RECIBIDO' | 'PREPARANDO' | 'EN_CAMINO' | 'ENTREGADO';

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { productName: string; quantity: number }[];
  shippingAddress: string;
  estimatedDelivery: string;
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-12345",
    date: "2026-05-12T10:30:00Z",
    status: "EN_CAMINO",
    total: 45999,
    items: [
      { productName: "Alimento Premium Perros Adultos 15kg", quantity: 1 }
    ],
    shippingAddress: "San Martín 1234, Piso 2 Depto B, Mar del Plata",
    estimatedDelivery: "2026-05-14T18:00:00Z"
  },
  {
    id: "ORD-12344",
    date: "2026-04-20T14:15:00Z",
    status: "ENTREGADO",
    total: 13400,
    items: [
      { productName: "Collar Ajustable Reflectivo", quantity: 1 },
      { productName: "Shampoo Hipoalergénico 500ml", quantity: 1 }
    ],
    shippingAddress: "San Martín 1234, Piso 2 Depto B, Mar del Plata",
    estimatedDelivery: "2026-04-22T10:00:00Z"
  }
];
