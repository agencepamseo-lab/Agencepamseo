# FOLO — Master de production (numérotation, statuts, promesses)
**Document vivant : mis à jour à chaque lot. Source de vérité doc ↔ fichiers.**
**Verrous automatisés associés : `scripts/integrity.mjs`, `scripts/glyphes.mjs`.**

---

## 1. Numérotation générale (fichiers = numéros imprimés)

| Plage | Lot | Contenu | Statut visuel |
|---|---|---|---|
| 01-10 | lot01 | Introduction générale + socle du module 1 (charte desktop v1) | Validé · conservé |
| 11-20 | lot02 | Séquence 1.1 — édition desktop v1 | Validé · **version alternative** (remplacée comme standard par 21-30) |
| 21-30 | lot03 | Séquence 1.1 — **édition mobile (standard)** | Validé · standard |
| 31-41 | lot04 | Séquence 1.2 — édition mobile (11 slides, scission design thinking) | Validé · standard |
| 42-52 | lot05 | Séquence 1.3 — édition mobile (11 slides, scission critères FOLO) | Validé · standard |
| 53-62 | lot06 | Séquence 1.4 « Du problème au test » — édition mobile | **À PRODUIRE** |

Règle : toute future scission/renumérotation = mise à jour du présent master
+ exécution `integrity.mjs` + suppression des orphelins + commit.

Couverture (01) : seule slide sans propriété `page:` (connu et accepté par integrity.mjs).

## 2. Statuts de reprise (issus de l'audit de continuation, doc 14)

- **DÉJÀ VALIDÉ** : docs 01-14 ; design system (`theme/ds/dsm/el/icons`) ; pipeline de
  rendu ; 52 slides ; chartes v1 + rév. 1 (+15 %) + rév. 2 (Mobile First) ; portrait
  `assets/fatou.jpg` ; historique git par lot.
- **À CONTRÔLER** (soldé par le présent master) : statut desktop 11-20 documenté
  ci-dessus ; cohérence doc ↔ fichiers vérifiée par integrity.mjs (OK).
- **À CORRIGER** (soldé en phase hygiène) : orphelin `lot05/41.png` supprimé ;
  glyphe tofu « → » de la slide 23 remplacé (« : le solaire comme réponse ») ;
  verrous integrity + glyphes créés et au vert.
- **À REFAIRE** : rien.
- **À PRODUIRE** : lot 6 (53-62) ; puis ressources §3 ; puis voix-off/kit vidéo ;
  modules 2+ (5 prototypes par nouvelle famille visuelle).

## 3. Registre des promesses (chaque « Télécharger X » = ticket)

| Ressource | Annoncée aux slides | Statut |
|---|---|---|
| Fiche exercice « 3 problèmes » | 15, 24 | À PRODUIRE (PDF) |
| Grille d'idéation | 20, 29 | À PRODUIRE (PDF) |
| Fiche d'évaluation des compétences | 18, 27 | À PRODUIRE (PDF) |
| Guide d'entretien utilisateur | 37, 38 | À PRODUIRE (PDF) |
| Canvas design thinking | 38 | À PRODUIRE (PDF) |
| Grille FOLO de notation | 46 | À PRODUIRE (PDF) |

Règle : un module n'est « terminé » que lorsque son registre de promesses est soldé.

## 4. Journal des verrous

- integrity.mjs : fichiers attendus vs présents (trous/orphelins), `page:` vs plages,
  comptes — au vert le [date de la phase hygiène].
- glyphes.mjs : liste noire (≈ ≠ ≤ ≥ œ Œ flèches ★ € £ ¥ ✓ ✗ + plages emojis) sur les
  textes rendus (commentaires exclus) + règle « pas de trait d'union + espace en
  capitales » — au vert après correction slide 23.
- À exécuter AVANT chaque validation de lot et après toute renumérotation.
