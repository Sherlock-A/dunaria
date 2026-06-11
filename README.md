# Sahara — site de contenu désert marocain (ES / EN / FR)

Site Next.js multilingue de contenu SEO sur le désert marocain. Trafic organique → leads email + réseaux sociaux (pas de paiement).

## Démarrage
```bash
npm install
npm run dev      # http://localhost:3000  → redirige vers /es
```

## Avant de déployer
1. `src/lib/site.ts` → remplacer `SITE_URL` par ton vrai domaine (le placeholder ne doit PAS être utilisé).
2. Brancher la capture email dans `src/components/EmailCapture.tsx`.
3. URL réseaux sociaux dans `SiteFooter.tsx` et `EmailCapture.tsx`.

## Ajouter un article
Créer un fichier `.mdx` dans `content/es/` (ou `en`/`fr`) avec le frontmatter complet.
Voir les exemples existants et **lire `CLAUDE.md`** pour les conventions (surtout la règle `translationKey` pour le hreflang).

## Déploiement
Push sur GitHub → connecter à Vercel → déploiement auto. Puis soumettre `/sitemap.xml` à Google Search Console.

## 📄 Contexte complet
**Tout le contexte stratégique et technique est dans [`CLAUDE.md`](./CLAUDE.md).** Lis-le en premier.
