# CLAUDE.md — Contexte du projet

> Ce fichier est lu automatiquement par Claude Code au démarrage de chaque session.
> Il contient tout le contexte nécessaire pour comprendre le projet et continuer le travail.
> Garde-le à jour quand des décisions importantes changent.

---

## 1. Le projet en une phrase

Site de contenu SEO multilingue (ES / EN / FR) sur le thème du **désert / Sahara marocain**, dont le but est de capter du trafic organique international et de le convertir en **leads email + abonnés réseaux sociaux** — PAS en ventes directes (aucun moyen de paiement pour l'instant).

## 2. Contexte business

- Le propriétaire travaille dans le voyage et veut lancer un projet de média de voyage à la **Evaneos**.
- **Modèle économique** : média-first. Le trafic SEO ne va PAS vers un checkout. Il va vers :
  1. **Capture email** (lead magnet : « Itinéraire 4 jours Marrakech → Merzouga, PDF gratuit »)
  2. **Réseaux sociaux** (Instagram / TikTok — contenu désert très visuel)
- Monétisation prévue **plus tard** : affiliation (GetYourGuide, Booking, assurances) et/ou mise en relation avec agences locales (commission). La société n'est pas encore constituée.
- Donc : **ne jamais ajouter de système de paiement, panier, ou checkout.** Toute conversion = email ou follow social.

## 3. Stratégie SEO (à respecter dans tout le contenu)

### Niche choisie
Le **désert marocain** (Sahara). Cœur géographique : Merzouga, Erg Chebbi, Erg Chigaga, Zagora, M'Hamid, vallée du Drâa, Aït Ben Haddou, Ouarzazate, gorges du Dadès.

### Langues — ordre de priorité
1. **Espagnol (es)** = langue pilote. Travailler le contenu ES en premier et le plus à fond.
2. **Anglais (en)** = ensuite (plus gros volume mondial, concurrence plus forte).
3. **Français (fr)** = en dernier (volume élevé mais saturé d'agences FR).

⚠️ Ne PAS produire les 3 langues en parallèle dès le début. On construit le cluster complet en ES, on valide qu'il ranke, PUIS on traduit/adapte vers EN et FR (on réutilise ~80 % du travail).

### Architecture de contenu : modèle pilier + clusters
- **1 page pilier** large par grand thème (ex. « Viajar al desierto de Marruecos: guía completa »).
- **~15 articles satellites** précis autour, qui répondent chacun à UNE question concrète et pointent vers le pilier + 2-3 autres satellites (maillage interne).
- Cible des requêtes **informationnelles** (« mejor época para ir al desierto »), PAS transactionnelles (verrouillées par les gros acteurs).

### Cluster « désert » — articles prévus (ES)
- [PILIER] Viajar al desierto de Marruecos: guía completa  ← existe (desierto-marruecos-guia.mdx)
- Mejor época para ir al desierto de Marruecos  ← existe (mejor-epoca-desierto-marruecos.mdx)
- Merzouga o Zagora: cuál elegir
- Cómo llegar a Merzouga desde Marrakech
- Qué llevar al desierto del Sáhara
- Dormir en el desierto: campamentos (de básico a lujo)
- Itinerario 3 días Marrakech – desierto – Marrakech
- Itinerario 4 días por el sur de Marruecos
- ¿Es seguro viajar al desierto de Marruecos?
- Cuánto cuesta una excursión al desierto
- Aït Ben Haddou y Ouarzazate: qué ver
- Erg Chebbi vs Erg Chigaga
- Qué hacer en el desierto (camello, quad, estrellas…)
- Desierto de Marruecos con niños
- Fotos del desierto: mejores spots

### CTA par type d'article
- Articles pilier + itinéraires → CTA **email** (`cta: "email"` dans le frontmatter)
- Articles très visuels (photos, dormir, qué hacer) → CTA **social** (`cta: "social"`)

### Outils de données (manipulés par l'humain, pas par Claude Code)
- **Ahrefs / Spectre SEO** : recherche de mots-clés, volumes, KD, analyse concurrents. L'humain exporte les CSV.
- **Google Search Console** + **GA4 / Plausible** : à brancher une fois en ligne.
- **Google Trends** : saisonnalité (le désert est très saisonnier : pic printemps/automne).
- Sources gratuites de questions réelles : « Autres questions posées » Google, AlsoAsked, Reddit (r/Morocco, r/travel).

## 4. Stack technique

| Brique | Choix |
|---|---|
| Framework | Next.js 14.2.5 (App Router) |
| i18n | next-intl 3.x, locales `es`/`en`/`fr`, `localePrefix: "always"` |
| Contenu | MDX via `next-mdx-remote/rsc` + `gray-matter` (frontmatter) |
| Style | Tailwind CSS + `@tailwindcss/typography` (classe `prose`) |
| Rendu | 100 % statique (SSG) — `generateStaticParams` partout |
| Hébergement cible | Vercel |
| Email | À brancher : Brevo / MailerLite / ConvertKit (TODO dans EmailCapture.tsx) |

### Identité visuelle Dunaria

**Palette (tokens Tailwind)**

| Token | Valeur | Usage |
|---|---|---|
| `night` | `#0B0F1A` | Fond nav/footer, texte principal |
| `night-700` | `#1F2738` | Texte secondaire, body copy |
| `night-600` | `#38415A` | Texte tertiaire, métadonnées |
| `gold` | `#C8A45D` | Accent principal, CTA, liens |
| `gold-600` | `#B8924A` | Hover sur gold |
| `gold-400` | `#D6B878` | Accent sur fond sombre |
| `sand-100` | `#FAF5EC` | Fond page (body background) |
| `sand-200` | `#F3E9D6` | Fond cards / EmailCapture |
| `sand-300` | `#EBDBBF` | Séparateurs, bordures légères |
| `atlas` | `#2D6CDF` | Liens informatifs (usage futur) |

**Typographie (Google Fonts via `next/font`)**

| Variable CSS | Police | Weights | Usage |
|---|---|---|---|
| `--font-display` | Spectral | 400, 500, 600 | Titres h1–h3, classe Tailwind `font-display` |
| `--font-sans` | Hanken Grotesk | 400, 500, 600 | Corps de texte, classe `font-sans` (défaut body) |
| `--font-mono` | IBM Plex Mono | 400, 500 | Eyebrows, métadonnées, classe `font-mono` |

**Composants brand**
- `src/components/Logo.tsx` — icône SVG désert/soleil, props `variant="light|dark"` + `className`
- `src/app/icon.svg` — favicon (détecté automatiquement par Next.js App Router)
- `src/app/opengraph-image.tsx` — image OG par défaut (ImageResponse 1200×630)

## 5. Architecture des fichiers

```
src/
  app/
    layout.tsx                 # root layout (pass-through)
    sitemap.ts                 # sitemap.xml dynamique + hreflang
    robots.ts                  # robots.txt
    [locale]/
      layout.tsx               # <html lang>, providers, header/footer
      page.tsx                 # homepage par locale (liste articles)
      blog/[slug]/page.tsx     # PAGE ARTICLE — cœur SEO (metadata, hreflang, JSON-LD)
  components/
    SiteHeader.tsx             # header + sélecteur de langue (client)
    SiteFooter.tsx             # footer + liens sociaux
    EmailCapture.tsx           # formulaire lead magnet (variant "email" | "social")
  i18n/
    routing.ts                 # config next-intl (locales, defaultLocale)
    request.ts                 # chargement des messages par locale
  lib/
    site.ts                    # SITE_URL, locales, hreflangMap — CONFIG CENTRALE
    content.ts                 # lecture MDX, frontmatter, getTranslations()
  middleware.ts                # routing next-intl
content/
  es/  en/  fr/                # articles .mdx, un dossier par langue
messages/
  es.json  en.json  fr.json    # chaînes d'UI (pas le contenu des articles)
```

## 6. Conventions de contenu — IMPORTANT

### Frontmatter MDX obligatoire (chaque article)
```yaml
---
title: "Titre optimisé avec le mot-clé principal"
description: "Meta description ~150 caractères avec le mot-clé."
translationKey: "identifiant-partage-entre-traductions"   # ⚠️ voir ci-dessous
date: "2026-01-15"          # ISO
cluster: "desierto"         # nom du cluster
cta: "email"                # "email" ou "social"
author: "Sahara"
image: "https://..."        # optionnel (Open Graph)
---
```

### ⚠️ Règle critique : `translationKey`
Deux articles qui sont des **traductions l'un de l'autre** DOIVENT partager le même `translationKey`.
C'est ce qui génère les balises **hreflang** automatiquement (dans `blog/[slug]/page.tsx` et `sitemap.ts` via `getTranslations()`).
Exemple : la pilier ES (`desierto-marruecos-guia.mdx`) et la pilier EN (`morocco-desert-guide.mdx`) ont toutes deux `translationKey: "desierto-guia-pilar"`.
Si tu crées une traduction, RÉUTILISE le translationKey de l'original. Si tu crées un nouvel article, INVENTE un nouveau translationKey unique.

### Style rédactionnel
- Ton concret, vécu, utile — PAS de remplissage générique « IA ».
- Structure H2/H3 claire, réponses directes aux questions.
- Maillage interne : lier vers le pilier et 2-3 satellites du même cluster.
- Longueur : pilier 1500-2500 mots, satellites 800-1500 mots.
- Toujours finir par un CTA cohérent avec le champ `cta`.

## 7. À FAIRE de la part de l'humain (pas Claude Code)

1. Fournir les assets vidéo (`public/hero.mp4`) ou utiliser le fallback Pexels déjà configuré.
2. Mettre les vraies URL Instagram/TikTok dans `SiteFooter.tsx` et `EmailCapture.tsx` (lien `#` actuellement).
3. Fournir les exports Ahrefs/Spectre pour valider les mots-clés réels.
4. Remplacer `src/app/icon.svg` par un PNG 512×512 + apple-touch-icon PNG pour une meilleure compatibilité mobile.
5. Configurer les variables `.env.local` pour activer Supabase + Brevo :
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJ...
   BREVO_API_KEY=xkeysib-...
   BREVO_LIST_ID=2          # ID de la liste principale Brevo
   ```
6. Exécuter le SQL suivant dans le dashboard Supabase pour créer la table `contacts` :
   ```sql
   CREATE TABLE contacts (
     id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email         TEXT NOT NULL UNIQUE,
     locale        TEXT NOT NULL DEFAULT 'es',
     source        TEXT,
     interest_tags TEXT[] DEFAULT '{}',
     created_at    TIMESTAMPTZ DEFAULT now(),
     last_seen_at  TIMESTAMPTZ DEFAULT now()
   );
   CREATE INDEX ON contacts(email);
   CREATE INDEX ON contacts USING GIN(interest_tags);
   ```
7. Créer dans Brevo Automations les segments : `TAGS contient "desierto"`, `TAGS contient "marrakech"`, `LOCALE = "es/en/fr"`.
8. Remplacer les IDs Pexels dans `src/lib/media.ts` par ses propres photos ou celles obtenues via Pexels (IDs actuels = photos génériques Morocco).

## 8. État d'avancement du contenu (mis à jour)

### Cluster « desierto » — articles par langue

| translationKey | ES | EN | FR |
|---|---|---|---|
| desierto-guia-pilar | ✅ | ✅ | ⬜ |
| desierto-mejor-epoca | ✅ | ✅ | ⬜ |
| desierto-llegar-merzouga | ✅ | ✅ | ⬜ |
| desierto-merzouga-zagora | ✅ | ✅ | ⬜ |
| desierto-que-llevar | ✅ | ✅ | ⬜ |
| desierto-dormir-campamentos | ✅ | ✅ | ⬜ |
| desierto-itinerario-3-dias | ✅ | ✅ | ⬜ |
| desierto-itinerario-4-dias | ✅ | ✅ | ⬜ |
| desierto-seguridad | ✅ | ✅ | ⬜ |
| desierto-costos-excursion | ✅ | ✅ | ⬜ |
| desierto-ait-ben-haddou | ✅ | ✅ | ⬜ |
| desierto-erg-chebbi-chigaga | ✅ | ✅ | ⬜ |
| desierto-actividades | ✅ | ✅ | ⬜ |
| desierto-familias-ninos | ✅ | ✅ | ⬜ |
| desierto-fotos-spots | ✅ | ✅ | ⬜ |

### Cluster « marrakech » — articles par langue

| translationKey | ES | EN | FR |
|---|---|---|---|
| marrakech-guia-pilar | ✅ | ✅ | ✅ |
| marrakech-que-ver | ✅ | ✅ | ✅ |
| marrakech-medina | ✅ | ✅ | ✅ |
| marrakech-jemaa-fna | ✅ | ✅ | ✅ |
| marrakech-souks | ✅ | ✅ | ✅ |
| marrakech-riads | ✅ | ✅ | ✅ |
| marrakech-comer | ✅ | ✅ | ✅ |
| marrakech-itinerario-2-dias | ✅ | ✅ | ✅ |
| marrakech-excursiones | ✅ | ✅ | ✅ |
| marrakech-seguridad | ✅ | ✅ | ✅ |

### Cluster « atlas » — articles par langue (Sprint 6)

| translationKey | ES | EN | FR |
|---|---|---|---|
| atlas-guia-pilar | ✅ | ✅ | ✅ |
| atlas-toubkal | ✅ | ✅ | ✅ |
| atlas-imlil | ✅ | ✅ | ✅ |
| atlas-ourika | ✅ | ✅ | ✅ |
| atlas-dades-todra | ✅ | ✅ | ✅ |
| atlas-agafay | ✅ | ✅ | ✅ |
| atlas-tichka | ✅ | ✅ | ✅ |
| atlas-trekking-beginners | ✅ | ✅ | ✅ |
| atlas-valles-secretos | ✅ | ✅ | ✅ |
| atlas-mejor-epoca | ✅ | ✅ | ✅ |

### Cluster « imperial » — articles par langue (Sprint 7)

| translationKey | ES | EN | FR |
|---|---|---|---|
| imperial-guia-pilar | ✅ | ✅ | ✅ |
| imperial-fes-guia | ✅ | ✅ | ✅ |
| imperial-fes-medina | ✅ | ✅ | ✅ |
| imperial-chefchaouen | ✅ | ✅ | ✅ |
| imperial-meknes | ✅ | ✅ | ✅ |
| imperial-rabat | ✅ | ✅ | ✅ |
| imperial-itinerario-4-dias | ✅ | ✅ | ✅ |
| imperial-itinerario-7-dias | ✅ | ✅ | ✅ |
| imperial-marrakech-fes | ✅ | ✅ | ✅ |
| imperial-artesania | ✅ | ✅ | ✅ |

### Tâches techniques — état

| Tâche | État |
|---|---|
| Cluster désert ES (15 articles) | ✅ Complet |
| Cluster désert EN (15 articles) | ✅ Complet |
| Cluster désert FR (15 articles) | ✅ Complet |
| Cluster marrakech ES (10 articles) | ✅ Complet |
| Cluster marrakech EN (10 articles) | ✅ Complet |
| Cluster marrakech FR (10 articles) | ✅ Complet |
| Page cluster `/[locale]/marrakech` | ✅ Sprint 4 |
| Filtre blog par cluster (`BlogFilter.tsx`) | ✅ Sprint 4 |
| Route API `/api/subscribe` (Brevo + MailerLite) | ✅ Implémentée |
| **Sprint 5 — Visuels** | |
| `next.config.mjs` remotePatterns Pexels/Unsplash/CDN | ✅ Sprint 5 |
| `src/lib/media.ts` — CLUSTER_HERO + DESTINATIONS + getPexelsUrl | ✅ Sprint 5 |
| `src/lib/motion.ts` — slideInLeft/Right, scaleIn, floatVariants | ✅ Sprint 5 |
| `src/components/ScrollVideo.tsx` — scroll-scrubbed video | ✅ Sprint 5 |
| `src/components/ImageGallery.tsx` — grid + lightbox AnimatePresence | ✅ Sprint 5 |
| `src/components/icons/` — 5 SVG (Compass, Camel, Dune, Riad, Star) | ✅ Sprint 5 |
| `VideoHero.tsx` — Pexels poster fallback + preload="none" + indicator fade | ✅ Sprint 5 |
| `ArticleCard.tsx` — CLUSTER_HERO fallback + badge coloré cluster | ✅ Sprint 5 |
| Section destinations 6 cards homepage | ✅ Sprint 5 |
| **Sprint 5 — Geo SEO** | |
| `layout.tsx` — LocalBusiness + TouristInformationCenter JSON-LD + geo meta | ✅ Sprint 5 |
| `desierto/page.tsx` — TouristAttraction schema (31.0998, -3.9742) | ✅ Sprint 5 |
| `marrakech/page.tsx` — TouristAttraction schema (31.6295, -7.9811) | ✅ Sprint 5 |
| `Testimonials.tsx` — AggregateRating JSON-LD (4.9★, 4 avis) | ✅ Sprint 5 |
| **Sprint 5 — CRM Pipeline** | |
| `@supabase/supabase-js` installé | ✅ Sprint 5 |
| `/api/subscribe` — Supabase upsert + source/tags + Brevo TAGS attribute | ✅ Sprint 5 |
| `EmailCapture.tsx` — prop `source` + passée dans le body | ✅ Sprint 5 |
| Pages → source : homepage, blog-cluster, tours | ✅ Sprint 5 |
| Locale switcher slug-aware (translationKey) | ✅ Implémenté |
| Page cluster `/[locale]/desierto` | ✅ Existait déjà |
| Sprint 3 (Mobile, A11y, SEO, WhatsApp FAB, RTL) | ✅ Complet |
| **Sprint 6 — Cluster Atlas** | |
| Cluster atlas ES/EN/FR (10 articles × 3) | ✅ Sprint 6 |
| Page cluster `/[locale]/atlas` + TouristAttraction JSON-LD | ✅ Sprint 6 |
| `RelatedArticles.tsx` — composant articles liés | ✅ Sprint 6 |
| `media.ts` + `ArticleCard` badge atlas + messages `cluster_atlas` | ✅ Sprint 6 |
| `layout.tsx` — preconnect Pexels | ✅ Sprint 6 |
| **Sprint 7 — SEO Tech + Cluster Imperial** | |
| BlogFilter chip atlas ajouté | ✅ Sprint 7 |
| BreadcrumbList 4 niveaux (Home→Blog→Cluster→Article) | ✅ Sprint 7 |
| `FAQSection.tsx` + FAQPage JSON-LD | ✅ Sprint 7 |
| FAQSection intégrée dans desierto/marrakech/atlas/imperial | ✅ Sprint 7 |
| Cluster imperial ES/EN/FR (10 articles × 3) | ✅ Sprint 7 |
| Page cluster `/[locale]/imperial` + TouristAttraction JSON-LD (Fès) | ✅ Sprint 7 |
| `media.ts` imperial CLUSTER_HERO + fes slug → "imperial" | ✅ Sprint 7 |
| `ArticleCard` badge purple imperial | ✅ Sprint 7 |
| Messages `cluster_imperial` ES/EN/FR | ✅ Sprint 7 |
| BlogFilter chip imperial ajouté | ✅ Sprint 7 |
| Build cible ~230 pages SSG | ✅ Sprint 7 |

### Prochaines étapes pour Claude Code

1. **Cluster desierto FR** — 15 articles FR désert avec translationKeys alignés (⬜ encore à faire).
2. **Cinquième cluster** — Essaouira ou côte atlantique. Même structure : page cluster + 10 articles ES/EN/FR.
3. **Assets visuels** — Remplacer les IDs Pexels dans `media.ts` par les vraies photos (variables `DESTINATIONS` + `CLUSTER_HERO`).
4. **Supabase table merge** — Pour fusionner les interest_tags (au lieu de les remplacer) au lieu d'un simple upsert, créer une SQL function `upsert_contact` dans Supabase qui utilise `array(SELECT DISTINCT unnest(a.interest_tags || b.interest_tags))`.
5. **Séquences Brevo** — Configurer les automations year-round : bienvenue + séquences désert/marrakech/saison (voir plan Sprint 5).

## 9. Commandes

```bash
npm install      # installer
npm run dev      # dev local (localhost:3000 → redirige vers /es)
npm run build    # build de prod (vérifie SSG + types) — DOIT passer avant tout commit
npm start        # servir le build de prod
```

## 10. Comment ajouter une nouvelle langue (ex : arabe)

Pour activer une nouvelle locale, **5 modifications dans cet ordre** :

1. **`src/lib/site.ts`** — ajouter le code dans `locales`, `localeNames`, et `hreflangMap` :
   ```ts
   export const locales = ["es", "en", "fr", "ar"] as const;
   // localeNames: ar: "العربية"
   // hreflangMap: ar: "ar"
   ```

2. **`messages/ar.json`** — le fichier existe déjà (`messages/ar.json`), complet en arabe. Pour une autre langue, copier ce template et traduire toutes les valeurs.

3. **`content/ar/`** — le dossier existe déjà. Placer les articles `.mdx` dedans en respectant le frontmatter (`translationKey` doit correspondre aux versions ES/EN/FR).

4. **`src/app/opengraph-image.tsx`** (optionnel) — pas de changement nécessaire, il est locale-agnostique.

5. **`npm run build`** — doit afficher N × 3 + N nouvelles pages SSG pour la locale ajoutée.

**Ce qui se met à jour automatiquement :**
- `routing.ts` — lit `locales` depuis `site.ts`, rien à toucher
- `layout.tsx` — `dir="rtl"` appliqué si la locale est dans `RTL_LOCALES` (`["ar", "he", "fa"]`)
- `sitemap.ts` — itère `locales`, hreflang inclus
- `generateStaticParams` sur toutes les pages — itère `locales`

⚠️ **Ne pas oublier :** si les articles n'existent pas encore dans `content/ar/`, les pages `/ar/blog/[slug]` ne seront pas générées (SSG ne crée que les pages qui ont du contenu — c'est le comportement attendu).

---

## 11. Règles pour Claude Code

- **Toujours faire `npm run build` avant de considérer une tâche terminée** — le build vérifie le typage et le SSG.
- Ne jamais introduire de paiement / checkout / e-commerce.
- Respecter la règle `translationKey` pour tout nouvel article.
- Ne pas casser le rendu statique : garder `generateStaticParams` sur les pages dynamiques.
- Le contenu se travaille en ES en priorité, sauf demande explicite contraire.
- Garder ce fichier (CLAUDE.md) à jour si une décision d'architecture change.
