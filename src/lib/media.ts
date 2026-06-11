// Fallback hero images per cluster (used when article has no frontmatter.image)
export const CLUSTER_HERO: Record<string, string> = {
  desierto: "/photos/desierto-principal.jpeg",
  marrakech: "/photos/marrakech.jpeg",
  atlas: "/photos/atlas-roches.jpeg",
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
  // Atlas & guides — photos locales
  { id: 28, src: "/photos/atlas-roches.jpeg",            caption: "Roches rouges de l'Atlas",              category: "atlas" },
  { id: 29, src: "/photos/tour-guide-principal.jpeg",    caption: "Guide local dans l'Atlas",              category: "atlas" },
  { id: 30, src: "/photos/tour-guide-2.jpeg",            caption: "Circuit guidé en montagne",             category: "atlas" },
  { id: 31, src: "/photos/tour-guide-3.jpeg",            caption: "Randonnée dans les vallées berbères",   category: "atlas" },
  { id: 32, src: "/photos/tour-guide-4.jpeg",            caption: "Découverte locale avec guide expert",   category: "atlas" },
  // Desierto — nouvelles photos
  { id: 33, src: "/photos/ait-ben-haddou.jpeg",          caption: "Kasbah d'Aït Ben Haddou (UNESCO)",      category: "desierto" },
  { id: 34, src: "/photos/desert-camp.jpeg",             caption: "Camp de haïmas, Merzouga",              category: "desierto" },
  { id: 35, src: "/photos/desert-camp-1.jpeg",           caption: "Soirée au camp du désert",              category: "desierto" },
  { id: 36, src: "/photos/desert-camp-3.jpeg",           caption: "Nuit sous les étoiles, Erg Chebbi",     category: "desierto" },
  { id: 37, src: "/photos/group-desert.jpeg",            caption: "Groupe en expédition saharienne",       category: "desierto" },
  { id: 38, src: "/photos/owner-desert.jpeg",            caption: "Guide local dans les dunes",            category: "desierto" },
  { id: 39, src: "/photos/quad-desert.jpeg",             caption: "Quad dans les dunes, Merzouga",         category: "desierto" },
  { id: 40, src: "/photos/toyota-desert.jpeg",           caption: "4x4 au camp du désert",                 category: "desierto" },
  // Essaouira — nouvelles photos
  { id: 41, src: "/photos/group-seaside.jpeg",           caption: "Groupe en bord de mer, Essaouira",      category: "essaouira" },
  // Atlas — nouvelles photos
  { id: 42, src: "/photos/agafay.jpeg",                  caption: "Désert rocailleux de l'Agafay",         category: "atlas" },
  { id: 43, src: "/photos/imlil.jpeg",                   caption: "Village d'Imlil, base du Toubkal",      category: "atlas" },
  { id: 44, src: "/photos/ourika.avif",                  caption: "Vallée de l'Ourika, Haut-Atlas",        category: "atlas" },
  { id: 45, src: "/photos/group-mountains.jpeg",         caption: "Randonnée en groupe dans l'Atlas",      category: "atlas" },
  { id: 46, src: "/photos/group-nature.jpeg",            caption: "Excursion nature, Atlas marocain",      category: "atlas" },
  { id: 47, src: "/photos/toyota-atlas-snow.jpeg",       caption: "Toyota Prado dans l'Atlas enneigé",     category: "atlas" },
  { id: 48, src: "/photos/waterfall-ourika.jpeg",        caption: "Cascades de Setti Fatma, Ourika",       category: "atlas" },
  // Marrakech — nouvelles photos
  { id: 49, src: "/photos/hotel-pool-night.jpeg",        caption: "Piscine de riad, nuit à Marrakech",     category: "marrakech" },
  { id: 50, src: "/photos/riad-pool.jpeg",               caption: "Riad avec piscine, Marrakech",          category: "marrakech" },
  { id: 51, src: "/photos/riad.jpeg",                    caption: "Riad traditionnel, médina",             category: "marrakech" },
  { id: 52, src: "/photos/riad-2.jpeg",                  caption: "Architecture intérieure de riad",       category: "marrakech" },
  // Villes impériales — nouvelles photos
  { id: 53, src: "/photos/chefchaouen-2.avif",           caption: "Chefchaouen, cité bleue du Rif",        category: "imperial" },
  { id: 54, src: "/photos/kasbah.jpeg",                  caption: "Kasbah marocaine, route des kasbahs",   category: "imperial" },
];

// 6 destination cards for the homepage section
export const DESTINATIONS = [
  {
    key: "desierto",
    slug: "desierto",
    src: "/photos/desierto-principal.jpeg",
    label: { es: "Desierto del Sáhara", en: "Sahara Desert", fr: "Désert du Sahara" },
  },
  {
    key: "marrakech",
    slug: "marrakech",
    src: "/photos/marrakech.jpeg",
    label: { es: "Marrakech", en: "Marrakech", fr: "Marrakech" },
  },
  {
    key: "atlas",
    slug: "atlas",
    src: "/photos/atlas-roches.jpeg",
    label: { es: "Atlas", en: "Atlas", fr: "Atlas" },
  },
  {
    key: "essaouira",
    slug: "essaouira",
    src: "/photos/essaouira-mer.jpeg",
    label: { es: "Essaouira", en: "Essaouira", fr: "Essaouira" },
  },
  {
    key: "fes",
    slug: "imperial",
    src: "/photos/imperial-fes.jpeg",
    label: { es: "Fès", en: "Fès", fr: "Fès" },
  },
  {
    key: "agafay",
    slug: null,
    src: "/photos/desierto-dune.jpeg",
    label: { es: "Agafay", en: "Agafay", fr: "Agafay" },
  },
] as const;
