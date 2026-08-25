# FOLO — Contrôle qualité · Lot n° 1

Méthode : chaque slide est inspecté visuellement (rendu 1920×1080) et noté sur 5 critères
(0-10). Tout critère < 8 entraîne une correction avant validation.

## Correctifs appliqués durant le contrôle (itérations internes)

1. **Pied de page** : respiration insuffisante entre contenu et pied de page → marge fixe
   ajoutée dans le système (tous slides).
2. **Slide 03** : la seconde rangée reprenait les numéros 1-4 et un faux état « actif » sur
   SÉLECTIONNER → numérotation corrigée 1-8, état actif uniquement sur COMPRENDRE.
3. **Icône ampoule** : tracé défectueux → remplacée par un tracé filaire propre, cohérent
   avec le jeu d'icônes (trait 2 px, bouts ronds).
4. **Slide 05** : le glyphe « ≈ » absent de la police → remplacé par « ENV. 15 MIN »
   (aucun glyphe manquant toléré).
5. **Slide 10** : césure « chaque / jour ? » sur trois lignes → corps 60 px, largeur
   optimisée, retour à deux lignes équilibrées.

## Grille de notation

| Slide | Type | Lisibilité | Design | Pédagogie | Cohérence | Rédaction | Verdict |
|---|---|---|---|---|---|---|---|
| 01 Couverture | Ouverture | 10 | 9 | 9 | 10 | 10 | ✅ Validé |
| 02 Promesse avant/après | Comparaison | 9 | 9 | 9 | 9 | 10 | ✅ Validé |
| 03 Parcours 8 étapes | Progression | 9 | 9 | 9 | 10 | 10 | ✅ Validé |
| 04 Ouverture module 1 | Ouverture | 10 | 9 | 9 | 10 | 10 | ✅ Validé |
| 05 Objectifs | Objectifs | 9 | 9 | 10 | 10 | 10 | ✅ Validé |
| 06 Définition | Concept | 10 | 9 | 10 | 10 | 10 | ✅ Validé |
| 07 Réflexe FOLO | Méthode | 9 | 9 | 10 | 10 | 10 | ✅ Validé |
| 08 Exemple Ouagadougou | Exemple | 9 | 9 | 10 | 10 | 10 | ✅ Validé |
| 09 Idée ≠ opportunité | Comparaison | 9 | 9 | 10 | 10 | 10 | ✅ Validé |
| 10 Question | Question | 10 | 9 | 10 | 10 | 10 | ✅ Validé |

## Vérifications transversales (charte)

- **Texte** : français contrôlé (orthographe, accents, accords, ponctuation « » et ’) ;
  aucun mot déformé, aucun texte coupé, aucun glyphe manquant ; aucun Lorem Ipsum.
- **Design** : un seul jeu d'icônes filaires ; orange réservé aux accents (titres de
  sections, progression, verbes d'action) ; fonds bleu nuit constants ; motifs
  géométriques (triangles, arcs, grilles de points) discrets et jamais sous le texte.
- **Typographie** : 3 niveaux maximum par slide (Sora titres / Inter corps / Inter
  micro-labels) ; corps minimal 16 px pour les micro-métadonnées, 21 px+ pour tout contenu
  pédagogique — lisible sur ordinateur, vidéoprojecteur, smartphone, vidéo.
- **Pédagogie** : une idée par slide ; charge cognitive faible ; progression
  COMPRENDRE → AGIR respectée ; exemples crédibles (marché de Ouagadougou, chantier de
  Zongo, maquis) sans caricature.
- **Cohérence** : en-tête/pied de page identiques ; double progression (module X sur 8,
  séquence Y sur 4) présente partout sauf couverture ; mêmes cartes, filets, rayons.

## Fichiers livrés

- `renders/lot01/01.png` … `renders/lot01/10.png` (1920×1080, prêts pour la vidéo)
- Sources : `src/` (design system), `scripts/render.js` (reproduction à l'identique)

**Lot n° 1 validé en interne. En attente de la validation du commanditaire avant le lot n° 2.**
