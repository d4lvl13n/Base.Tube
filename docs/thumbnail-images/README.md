# Images à générer — vague 1 (22 octobre 2026)

Ce dossier est la liste de travail de l'agent qui génère les images.

## Les fichiers

- `jobs.csv` / `jobs.json` : une ligne par image à créer. Ils sont recréés à chaque export, ne pas les modifier à la main.
- `originals/` : les fichiers d'origine (PNG), gardés hors du site après conversion.

## Pour l'agent images

**D'abord le pilote :** `jobs-pilot.csv` contient 14 images, 2 par page de jeu. Les générer, les faire valider par Damien, et seulement ensuite lancer le reste de `jobs.csv`.

1. Prendre chaque ligne de `jobs.csv`.
2. Générer l'image avec le texte de la colonne `prompt`, **tel quel**, au format 16:9 (idéalement 1280×720 ou plus).
3. L'enregistrer exactement au chemin de la colonne `dropPath`, relatif au dossier `blog-nextjs/`. Exemple : `public/thumbnails/roblox/03-obby.png`.
4. Règles :
   - **pages de jeux : le vrai jeu**, reconnaissable au premier coup d'œil (vrais personnages, skins, lieux, objets, interface), avec les références IGDB ; logo du jeu permis en petit badge ;
   - direction validée par Damien le 22 octobre : `docs/research/game-thumbnail-refs/style-directions.md` (à lire avant de générer) ;
   - **ne jamais copier** une thumbnail de référence : les prompts sont des idées ouvertes, le modèle reste créatif ;
   - jamais le visage d'une vraie personne (créateur, développeur, célébrité) ; un « streamer » inventé est permis ;
   - le texte écrit sur l'image doit être celui demandé dans le prompt, sans faute.
5. Relire chaque image avant de la garder. Refaire celles où le texte est faux ou illisible.

Les anciennes images des pages de jeux (style « sosie », avant le 22 octobre après-midi) sont archivées dans `archive-v1-lookalike/` : ne pas les réutiliser.

Pour les exemples avec référence IGDB, attacher le fichier source dans le Studio et vérifier la ressemblance du rendu. Garder le prompt initial dans le manifeste et tracer séparément les instructions complémentaires et la provenance de l'asset. Les métadonnées des sources utilisées se trouvent dans `igdb/assets.json` ; aucun identifiant secret ni jeton d'accès ne doit être enregistré dans ces fichiers.

## Ensuite (depuis `blog-nextjs/`)

```bash
node scripts/thumbnail-images.mjs import
```

Cette commande fait trois choses :

- elle convertit chaque image trouvée en WebP 1280×720 de moins de 400 Ko ;
- elle déplace l'original PNG dans `originals/` ;
- elle retire la mention `placeholder: true` de l'image dans la page.

Ensuite, lancer la vérification :

```bash
node scripts/validate-thumbnails.mjs
```

Une galerie peut être indexée par Google seulement quand ces trois conditions sont remplies :

- elle a au moins 12 vraies images ;
- elle n'a plus aucune image provisoire ;
- quelqu'un a changé `status: draft` en `status: published` dans sa page.

Pour mettre à jour la liste des images restantes :

```bash
node scripts/thumbnail-images.mjs export
```
