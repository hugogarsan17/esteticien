export type Service = {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  price: number;
  duration: number; // minutos
};

export const SERVICES: Service[] = [
  // ================= FACIALES =================
  {
    id: 1,
    category: "Tratamientos Faciales",
    subcategory: "Higiene Facial",
    title: "Higiene facial",
    price: 40,
    duration: 60,
  },
  {
    id: 2,
    category: "Tratamientos Faciales",
    subcategory: "Higiene + Ácidos",
    title: "Higiene + tratamiento de ácidos",
    price: 55,
    duration: 75,
  },
  {
    id: 3,
    category: "Tratamientos Faciales",
    subcategory: "Rejuvenecimiento",
    title: "Tratamiento Derma IR",
    price: 60,
    duration: 60,
  },
  {
    id: 4,
    category: "Tratamientos Faciales",
    subcategory: "Rejuvenecimiento",
    title: "Radiofrecuencia facial",
    price: 50,
    duration: 50,
  },

  // ================= CORPORALES =================
  {
    id: 5,
    category: "Tratamientos Corporales",
    subcategory: "Reductores",
    title: "Lipo-láser",
    price: 45,
    duration: 45,
  },
  {
    id: 6,
    category: "Tratamientos Corporales",
    subcategory: "Circulatorios",
    title: "Presoterapia",
    price: 40,
    duration: 40,
  },
  {
    id: 7,
    category: "Tratamientos Corporales",
    subcategory: "Reafirmantes",
    title: "Diatermia",
    price: 55,
    duration: 50,
  },
  {
    id: 8,
    category: "Tratamientos Corporales",
    subcategory: "Reductores",
    title: "Masaje reductor",
    price: 45,
    duration: 50,
  },

  // ================= MAQUILLAJE =================
  {
    id: 9,
    category: "Maquillaje",
    subcategory: "Social",
    title: "Maquillaje",
    price: 70,
    duration: 60,
  },
  {
    id: 10,
    category: "Maquillaje",
    subcategory: "Bodas",
    title: "Maquillaje novia",
    price: 120,
    duration: 90,
  },
  {
    id: 11,
    category: "Maquillaje",
    subcategory: "Bodas",
    title: "Pack de boda",
    price: 180, // aprox (desde)
    duration: 150,
  },
  {
    id: 12,
    category: "Maquillaje",
    subcategory: "Eventos",
    title: "Maquillaje de fiesta",
    price: 80,
    duration: 60,
  },
  {
    id: 13,
    category: "Maquillaje",
    subcategory: "A domicilio",
    title: "Maquillaje a domicilio",
    price: 100, // desde
    duration: 75,
  },

  // ================= PESTAÑAS =================
  {
    id: 14,
    category: "Pestañas",
    subcategory: "Lifting",
    title: "Lifting de pestañas + tinte",
    price: 35,
    duration: 45,
  },
  {
    id: 15,
    category: "Pestañas",
    subcategory: "Tinte",
    title: "Tinte de pestañas",
    price: 20,
    duration: 30,
  },
  {
    id: 16,
    category: "Pestañas",
    subcategory: "Tinte",
    title: "Tinte de cejas",
    price: 20,
    duration: 30,
  },

  // ================= MANICURA =================
  {
    id: 17,
    category: "Manicura",
    subcategory: "Esmaltado",
    title: "Manicura esmalte normal",
    price: 15,
    duration: 30,
  },
  {
    id: 18,
    category: "Manicura",
    subcategory: "Esmaltado",
    title: "Manicura semipermanente",
    price: 20,
    duration: 45,
  },
  {
    id: 19,
    category: "Manicura",
    subcategory: "Uñas artificiales",
    title: "Uñas acrílicas",
    price: 35,
    duration: 75,
  },

  // ================= PEDICURA =================
  {
    id: 20,
    category: "Pedicura",
    subcategory: "Básica",
    title: "Pedicura completa",
    price: 25,
    duration: 45,
  },

  // ================= DEPILACIÓN =================
  {
    id: 21,
    category: "Depilación",
    subcategory: "Láser",
    title: "Láser de diodo",
    price: 45,
    duration: 30,
  },
  {
    id: 22,
    category: "Depilación",
    subcategory: "Cera",
    title: "Depilación facial con cera",
    price: 15,
    duration: 20,
  },
];
