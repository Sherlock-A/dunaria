export function getPexelsUrl(id: number, w = 800, h = 600): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}

// Fallback hero images per cluster (used when article has no frontmatter.image)
export const CLUSTER_HERO: Record<string, string> = {
  desierto: getPexelsUrl(1585325),
  marrakech: getPexelsUrl(3880961),
  atlas: getPexelsUrl(2246874),
  imperial: getPexelsUrl(3889742),
  essaouira: getPexelsUrl(3601426),
};

export type GalleryCategory = "desierto" | "marrakech" | "atlas" | "imperial";

export type GalleryPhoto = {
  id: number;
  src: string;
  caption: string;
  category: GalleryCategory;
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // Desierto
  { id: 1,  src: getPexelsUrl(1585325, 1200, 900), caption: "Erg Chebbi au lever du soleil", category: "desierto" },
  { id: 2,  src: getPexelsUrl(3225517, 1200, 900), caption: "Trek à dos de chameau dans le Sahara", category: "desierto" },
  { id: 3,  src: getPexelsUrl(1703310, 1200, 900), caption: "Dunes dorées à l'heure magique", category: "desierto" },
  { id: 4,  src: getPexelsUrl(2636674, 1200, 900), caption: "Camp sous les étoiles, Merzouga", category: "desierto" },
  { id: 5,  src: getPexelsUrl(3617500, 1200, 900), caption: "Mer de sable, Erg Chigaga", category: "desierto" },
  // Marrakech
  { id: 6,  src: getPexelsUrl(3880961, 1200, 900), caption: "Jemaa el-Fna au crépuscule", category: "marrakech" },
  { id: 7,  src: getPexelsUrl(1579483, 1200, 900), caption: "Ruelle de la médina", category: "marrakech" },
  { id: 8,  src: getPexelsUrl(2187547, 1200, 900), caption: "Cour de riad traditionnel", category: "marrakech" },
  { id: 9,  src: getPexelsUrl(1011302, 1200, 900), caption: "Jardin Majorelle, Marrakech", category: "marrakech" },
  { id: 10, src: getPexelsUrl(3888213, 1200, 900), caption: "Épices du souk, ville rouge", category: "marrakech" },
  // Atlas
  { id: 11, src: getPexelsUrl(2246874, 1200, 900), caption: "Vue depuis le Toubkal", category: "atlas" },
  { id: 12, src: getPexelsUrl(5472573, 1200, 900), caption: "Plateau désertique d'Agafay", category: "atlas" },
  { id: 13, src: getPexelsUrl(4388164, 1200, 900), caption: "Village berbère dans la vallée", category: "atlas" },
  { id: 14, src: getPexelsUrl(1563356, 1200, 900), caption: "Cascades de Setti Fatma, Ourika", category: "atlas" },
  { id: 15, src: getPexelsUrl(3607631, 1200, 900), caption: "Gorges du Todra à l'aube", category: "atlas" },
  // Imperial
  { id: 16, src: getPexelsUrl(3889742, 1200, 900), caption: "Tanneries de Fès, vue depuis les terrasses", category: "imperial" },
  { id: 17, src: getPexelsUrl(2387703, 1200, 900), caption: "Chefchaouen, la ville bleue", category: "imperial" },
  { id: 18, src: getPexelsUrl(1707820, 1200, 900), caption: "Bab Mansour, Meknès", category: "imperial" },
  { id: 19, src: getPexelsUrl(3609811, 1200, 900), caption: "Tour Hassan et Mausolée Mohammed V, Rabat", category: "imperial" },
  { id: 20, src: getPexelsUrl(3601094, 1200, 900), caption: "Volubilis, cité romaine du Maroc", category: "imperial" },
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
