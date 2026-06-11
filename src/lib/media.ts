export function getPexelsUrl(id: number, w = 800, h = 600): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}

// Fallback hero images per cluster (used when article has no frontmatter.image)
export const CLUSTER_HERO: Record<string, string> = {
  desierto: "/photos/desierto-principal.jpeg",
  marrakech: "/photos/marrakech.jpeg",
  atlas: getPexelsUrl(2246874),
  imperial: "/photos/imperial-fes.jpeg",
  essaouira: "/photos/essaouira-mer.jpeg",
};

export type GalleryCategory = "desierto" | "marrakech" | "atlas" | "imperial" | "essaouira";

export type GalleryPhoto = {
  id: number;
  src: string;
  caption: string;
  category: GalleryCategory;
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // Desierto — photos locales
  { id: 1,  src: "/photos/desierto-principal.jpeg",  caption: "Erg Chebbi, Merzouga",               category: "desierto" },
  { id: 2,  src: "/photos/desierto-hero.jpeg",        caption: "Le Sahara marocain",                 category: "desierto" },
  { id: 3,  src: "/photos/desierto-1.jpeg",           caption: "Dunes de sable doré",                category: "desierto" },
  { id: 4,  src: "/photos/desierto-2.jpeg",           caption: "Expédition dans le Sahara",          category: "desierto" },
  { id: 5,  src: "/photos/desierto-3.jpeg",           caption: "Coucher de soleil sur les dunes",    category: "desierto" },
  { id: 6,  src: "/photos/desierto-4.jpeg",           caption: "Camp sous les étoiles, Merzouga",    category: "desierto" },
  { id: 7,  src: "/photos/desierto-6.jpeg",           caption: "Mer de sable, Erg Chigaga",          category: "desierto" },
  { id: 8,  src: "/photos/desierto-dune.jpeg",        caption: "Dune principale, Sahara",            category: "desierto" },
  { id: 9,  src: "/photos/desierto-dune-2.jpeg",      caption: "Erg Chigaga au crépuscule",          category: "desierto" },
  // Essaouira — photos locales
  { id: 10, src: "/photos/essaouira-mer.jpeg",        caption: "Essaouira et l'Atlantique",          category: "essaouira" },
  { id: 11, src: "/photos/essaouira-mer-2.jpeg",      caption: "Côte atlantique, Essaouira",         category: "essaouira" },
  { id: 12, src: "/photos/essaouira-mer-3.jpeg",      caption: "Port de pêche d'Essaouira",          category: "essaouira" },
  { id: 13, src: "/photos/essaouira-mer-4.jpeg",      caption: "Les alizés d'Essaouira",             category: "essaouira" },
  { id: 14, src: "/photos/essaouira-mer-5.jpeg",      caption: "Plage d'Essaouira",                  category: "essaouira" },
  { id: 15, src: "/photos/essaouira-poisson.jpeg",    caption: "Fruits de mer frais du port",        category: "essaouira" },
  // Villes impériales — photos locales
  { id: 16, src: "/photos/imperial-chefchaouen.jpeg",   caption: "Chefchaouen, la ville bleue",          category: "imperial" },
  { id: 17, src: "/photos/imperial-chefchaouen-2.jpeg", caption: "Ruelles bleues de Chefchaouen",        category: "imperial" },
  { id: 18, src: "/photos/imperial-chefchaouen-3.jpeg", caption: "Détail architectural, Chefchaouen",    category: "imperial" },
  { id: 19, src: "/photos/imperial-chefchaouen-4.jpeg", caption: "Porte de la médina, Chefchaouen",      category: "imperial" },
  { id: 20, src: "/photos/imperial-fes.jpeg",           caption: "Tanneries de Fès",                     category: "imperial" },
  { id: 21, src: "/photos/imperial-fes-2.jpeg",         caption: "Médina de Fès, vue panoramique",        category: "imperial" },
  { id: 22, src: "/photos/imperial-walili.jpeg",        caption: "Volubilis, cité romaine du Maroc",      category: "imperial" },
  // Marrakech — photos locales
  { id: 23, src: "/photos/marrakech.jpeg",           caption: "Marrakech, la ville rouge",          category: "marrakech" },
  { id: 24, src: "/photos/marrakech-hotel.jpeg",     caption: "Riad traditionnel, médina",          category: "marrakech" },
  { id: 25, src: "/photos/marrakech-hotel-2.jpeg",   caption: "Architecture de riad",               category: "marrakech" },
  { id: 26, src: "/photos/marrakech-ambiance.jpeg",  caption: "Ambiance nocturne, Marrakech",       category: "marrakech" },
  { id: 27, src: "/photos/marrakech-ambiance-2.jpeg",caption: "Soirée dans la médina",              category: "marrakech" },
  // Atlas — 1 photo locale + Pexels pour compléter
  { id: 28, src: "/photos/atlas-roches.jpeg",        caption: "Roches rouges de l'Atlas",           category: "atlas" },
  { id: 29, src: getPexelsUrl(2246874, 1200, 900),   caption: "Vue depuis le Toubkal",              category: "atlas" },
  { id: 30, src: getPexelsUrl(5472573, 1200, 900),   caption: "Plateau désertique d'Agafay",        category: "atlas" },
  { id: 31, src: getPexelsUrl(4388164, 1200, 900),   caption: "Village berbère dans la vallée",     category: "atlas" },
  { id: 32, src: getPexelsUrl(1563356, 1200, 900),   caption: "Cascades de Setti Fatma, Ourika",    category: "atlas" },
];

// 6 destination cards for the homepage section
export const DESTINATIONS = [
  {
    key: "desierto",
    slug: "desierto",
    imageId: 1585325,
    label: { es: "Desierto del Sáhara", en: "Sahara Desert", fr: "Désert du Sahara" },
  },
  {
    key: "marrakech",
    slug: "marrakech",
    imageId: 3880961,
    label: { es: "Marrakech", en: "Marrakech", fr: "Marrakech" },
  },
  {
    key: "atlas",
    slug: "atlas",
    imageId: 2246874,
    label: { es: "Atlas", en: "Atlas", fr: "Atlas" },
  },
  {
    key: "essaouira",
    slug: "essaouira",
    imageId: 6157049,
    label: { es: "Essaouira", en: "Essaouira", fr: "Essaouira" },
  },
  {
    key: "fes",
    slug: "imperial",
    imageId: 3889742,
    label: { es: "Fès", en: "Fès", fr: "Fès" },
  },
  {
    key: "agafay",
    slug: null,
    imageId: 5472573,
    label: { es: "Agafay", en: "Agafay", fr: "Agafay" },
  },
] as const;
