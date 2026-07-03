## Contexte

La prelander est déjà en ligne via Lovable (https://mediabuyingacademy.lovable.app), mais le projet est configuré comme une app **TanStack Start full-stack** avec Nitro ciblant Cloudflare Worker par défaut. GitHub Pages ne sert que des fichiers statiques (HTML/CSS/JS), donc il faut reconfigurer le build pour sortir un site statique pur.

## Réponse à ta question : quoi demander la prochaine fois ?

Pour que Lovable génère ça directement déployable sur GitHub Pages, dis ceci dès le premier prompt :

> "Crée une prelander 100% statique (pas de SSR, pas de TanStack Start, pas de server functions). Utilise Vite + React pur avec export statique (`vite build` qui sort un `index.html` + assets). Ajoute dès le départ un workflow GitHub Actions `.github/workflows/deploy.yml` pour déployer automatiquement sur GitHub Pages à chaque push."

Sinon, Lovable appliquera son template par défaut (TanStack Start + edge worker), et tu devras refaire cette adaptation.

---

## Plan technique — modifications à apporter

### 1. Config Vite : export statique + base URL GitHub Pages

Modifier `vite.config.ts` pour :
- Surclasser le preset Nitro (`cloudflare` → `static`).
- Activer le prerender de la route `/` (SSG) pour générer un `index.html` statique.
- Ajouter `base` si le repo est un projet page (sous-chemin `/nom-repo/`). Pour un site utilisateur (`username.github.io`), pas besoin de `base`.

### 2. Workflow GitHub Actions

Créer `.github/workflows/deploy.yml` :
- Trigger sur push `main`.
- Checkout → install Node/Bun → build (`vite build` en mode statique).
- Upload artifact → deploy via `actions/deploy-pages` sur la branche `gh-pages`.

### 3. Vérification du build

Lancer `vite build` localement et vérifier que le dossier `dist/` (ou `.output/public/` selon le preset) contient :
- Un `index.html` fonctionnel
- Les assets JS/CSS bundlés
- Les images (portrait, logo) accessibles

### 4. Ajustements potentiels

- Si le preset Nitro de Lovable ne peut pas être surchargé proprement, il faudra contourner la config wrapper (`@lovable.dev/vite-tanstack-config`) en important directement les plugins Vite nécessaires.
- Le router TanStack Start en mode statique doit avoir `defaultSsr: false` ou `defaultPreload: 'intent'` adapté.
- Le `href` du CTA (`https://mediabuyingacademy.com`) reste une URL externe absolue — aucun problème pour le statique.

## Livrables
- `vite.config.ts` mis à jour
- `.github/workflows/deploy.yml` créé
- Build testé et validé en local