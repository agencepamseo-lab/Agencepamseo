# FOLO ACADEMY — Audit de continuation de la production
**Rôle : directeur de production pédagogique · architecte · contrôleur qualité**
**Méthode : audit sur faits observés (dépôt, rendus, historique git, itérations QC). Aucune production, aucune modification, aucune suppression pendant l'audit.**

---

## 1. Résumé exécutif

La production FOLO existe, elle est traçable et elle tient debout : 52 slides valides,
5 lots, charte gelée (v1 + révisions 1 et 2), pipeline de rendu déterministe, historique
git par lot. Les défauts rencontrés sont tous d'origine **technique ou logique**
(moteur de rendu, numérotation, débordements) — **aucun défaut de texte français n'a été
livré**, ce qui valide le choix fondateur « texte = moteur typographique, jamais
d'image IA ». La faiblesse structurelle réelle est l'**hygiène de production à l'échelle**
(fichier orphelin après renumérotation, promesses de ressources non suivies) et
l'**absence totale de chaîne audio/vidéo interne**. La reprise doit se faire **sans rien
refaire** : nettoyage d'hygiène, verrous automatisés, puis lot 6 (séquence 1.4).

---

## 2. État réel de la production

| Périmètre | État factuel |
|---|---|
| Slides valides | 52 (01-10 intro/socle · 11-20 = 1.1 desktop · 21-30 = 1.1 mobile · 31-41 = 1.2 mobile · 42-52 = 1.3 mobile) |
| Fichiers PNG sur disque | 53 → **1 orphelin : `renders/lot05/41.png`** (contenu périmé pré-retrofit) |
| Module 1 | 75 % (séquence 1.4 non produite) |
| Modules 2-8 | Non produits (architecture existe, doc 01) |
| Ressources promises dans les slides | 6 templates annoncés, **0 produit** (fiche 3 problèmes, grille d'idéation, fiche évaluation compétences, guide d'entretien, canvas DT, grille FOLO) |
| Audio / vidéo | Néant (hors capacité, cf. §7) |
| Documentation | 13 docs (ingénierie, storyboards, QC, chartes, audit 13) |
| Traçabilité | 8 commits thématiques ; chaque lot = commit = référence opposable |

---

## 3. Travail déjà réalisé (conservable)

- Ingénierie pédagogique complète (8 modules, entonnoir de livrables) — doc 01.
- Design system codé : `theme.js` (tokens), `ds.js` (chrome desktop), `dsm.js`
  (composants mobiles), `el.js` (garde-fous moteur), `icons.js` (24 icônes, 1 style).
- Pipeline de rendu déterministe `scripts/render.js` (Satori + resvg, 1920×1080).
- Charte v1 + révision 1 (+15 % mobile) + révision 2 (Mobile First intégral) — doc 06.
- 52 slides QC-notées ≥ 9/10 ; 1 portrait d'étude de cas archivé (`assets/fatou.jpg`).
- Deux audits (docs 13 et le présent doc).

---

## 4. Incidents observés — transformation en règles

| # | Itération | Défaut | Détecté | Pourquoi pas plus tôt | Correction | Règle anti-récurrence |
|---|---|---|---|---|---|---|
| 1 | Pré-lots (smoke) | div sans display explicite / spans inline tronqués / children vides | Tests moteur | Limites du moteur inconnues au départ | Helpers `el.js` + `validate.mjs` | Tout nouveau moteur = smoke tests avant production |
| 2 | Ctrl lot 1 | Contenu/pied de page en collision | QC visuel | Calcul vertical non simulé | Marge système footer | Gabarits de hauteur + item QC « pied de page préservé » |
| 3 | Ctrl lot 1 | Numéros 1-4 répétés + faux état actif (2e rangée) | QC visuel | Bug d'index dans le code | Offset d'index | Item QC « numéros imprimés = attendus » |
| 4 | Ctrl lot 1 | Icône ampoule défectueuse (tracé ad hoc) | QC visuel | Icône dessinée hors bibliothèque | Tracé bibliothèque | Icônes issues uniquement d'`icons.js` |
| 5 | Ctrl lot 1 | Glyphe « ≈ » absent (sous-ensemble police) | QC visuel | Subset latin non testé | « ENV. 15 MIN » | Liste blanche de glyphes testée par script avant lot |
| 6 | Ctrl lot 2 | Flèches horizontales dans flux verticaux | QC visuel | Sens du flux non vérifié | Icône arrowDown | Item QC « direction des flèches = sens du flux » |
| 7 | Ctrl lot 2 | Espace mangée après « AUTO-ÉVALUATION » | QC visuel | Comportement moteur (trait d'union + espace, capitales) | Reformulation | Jamais trait d'union + espace dans libellés capitales |
| 8 | Ctrl lot 2 | Césure sauvage « …EN / OR » | QC visuel | Largeur non contrôlée | Lignes forcées | Tout badge = lignes explicites |
| 9 | Ctrl lot 3 | Blocs non centrés ; badge minuteur sur footer | QC visuel | Centrage flex mal maîtrisé | alignSelf/margins ; badge 142 px | Gabarit centrage mobile dans `dsm.js` |
| 10 | Ctrl lot 4 | Bandeau orange sur footer (slide 34) | QC visuel | Densité +15 % non resimulée | Compression espacements | Après tout changement d'échelle : re-QC des slides denses |
| 11 | Ctrl lot 5 | Aucun défaut bloquant | — | — | — | Preuve que les règles 2-10 ont appris au système |
| 12 | Retrofit | **Orphelin `lot05/41.png`** après renumérotation | Audit présent | Rendu n'efface jamais ; pas de script d'intégrité | Non corrigé pendant l'audit (interdit) | Script d'intégrité fichiers/numéros après chaque renumérotation |

Constat : **le QC visuel post-rendu a intercepté 100 % des défauts avant livraison** ;
le seul défaut résiduel est un défaut d'hygiène fichier, détectable uniquement par
contrôle automatisé. D'où la règle structurante : *QC visuel + QC automatisé sont
complémentaires, ni l'un ni l'autre ne suffit.*

---

## 5. Capacités — classification factuelle

✅ **FIABLE** : analyse pédagogique ; architecture ; storyboard ; rédaction FR ;
production PNG déterministe ; cohérence graphique longue série (tokens) ; lots de 10 ;
conformité charte ; traçabilité git ; détection de défauts dans des contenus fournis.

⚠️ **CONDITIONNEL** : QC visuel (gate humain requis au-delà de ~60 slides) ; voix-off
(TTS disponible, choix de voix humain) ; PPTX (images embarquées uniquement, via
pptxgenjs) ; portraits/illustrations ponctuels (1 image générée, archivée, réutilisée —
jamais de génération en série) ; prototypes (5 slides difficiles).

❌ **NON FIABLE / NON DISPONIBLE** : génération vidéo ; assemblage MP4 ; synchronisation
audio/vidéo interne ; personnage animé récurrent ; PPTX éditable natif ; image IA avec
texte (interdite de fait, preuve par les exemples fournis).

---

## 6. Risque de dérive — seuils observés

| Échelle | Dérive graphique | Dérive nomenclature | Dérive contenu |
|---|---|---|---|
| ≤ 20 slides | Nulle (tokens) | Nulle | Nulle |
| 20-50 | Nulle | **Apparue à la 1re renumérotation** (orphelin 41.png) | Maîtrisée par glossaire/fils rouges |
| 50-100 | Nulle si re-rendu total après chaque charte | Élevée sans script d'intégrité | Moyenne (répétitions d'exemples à surveiller) |
| > 100 / multi-modules | Moyenne sans audit par jalon | Élevée | Élevée |
| Multi-formations | Très élevée (identités distinctes exigées) | Très élevée | Très élevée |

**Verrouillage** — existant : tokens codés, charte datée, glossaire/cas réutilisés
documentés, commits par lot, lots ≤ 10, re-rendu total après charte.
**À ajouter à la reprise** : (a) script d'intégrité (séquence attendue vs fichiers,
orphelins, doublons) ; (b) test de glyphes ; (c) test « numéros imprimés » ;
(d) master de numérotation doc ↔ fichiers mis à jour à chaque lot ; (e) registre des
promesses (chaque « Télécharger X » = ticket de ressource à livrer).

---

## 7. Scénarios de production

- **A (module d'un bloc)** : ❌ — non testé volontairement ; les faits (12 incidents)
  montrent qu'un seul lot de 10 exige déjà 1-3 correctifs ; en 40+ slides sans gate,
  chaque défaut se propage à toute l'échelle.
- **B (lots sans verrous amont)** : ⚠️ — limite la casse mais a laissé passer, dans les
  premiers lots, des défauts que storyboard + smoke tests auraient prévenus.
- **C (séquentiel verrouillé)** : ✅ — scénario réellement suivi ; chaque étage a
  intercepté au moins un défaut ; le lot 5, produit avec le système mature, sort sans
  défaut bloquant : **la fiabilité augmente avec le verrouillage, pas avec le volume**.

---

## 8. Taille optimale des lots / prototypes

- Prototype 1 : aveugle (1 type de slide).
- Prototype 5 : **optimal** pour toute *nouvelle famille visuelle* (couverture, concept,
  méthode, exemple, exercice) — détection design/densité/lisibilité en 1 cycle.
- Prototype 10 : feedback trop lent ; utile seulement si charte non prototypée (cas du
  brief initial, acceptable a posteriori car le design system a été gelé ensuite).
- Lot de production : **10** (observé : correctifs locaux, QC absorbable).
- Module complet : interdit (cf. §7).

---

## 9. Pipeline recommandé

**Option 3 confirmée par les faits.** Options 1 et 2 écartées : les exemples client
(option 1) livraient du texte déformé ; l'absence d'étage prototype/storyboard
(option 2) ne prévenait ni débordements ni glyphes.

## 10. Règles de contrôle obligatoires (checklist v2)

**Moteur** : rendu sans erreur ; validate.mjs ; smoke tests si nouveau moteur.
**Production** : intégrité fichiers/numéros/orphelins ; numéro imprimé = fichier ;
tailles plausibles ; commit du lot.
**Texte** : liste blanche glyphes ; pas d'emoji ; pas de trait d'union + espace en
capitales ; relecture séparée des nombres.
**Design** : hiérarchie ≤ 3 niveaux ; corps ≥ 28 px ; safe zones 10/15 ; orange réservé ;
1 chiffre clé ; flèches = sens du flux ; pied de page préservé ; badges à lignes forcées.
**Pédagogie** : 1 idée/slide ; ≤ 3 puces rédigées ; fidélité source archivée ;
terminologie glossaire ; exemples Afrique de l'Ouest crédibles.
**Promesses** : registre des ressources annoncées, soldé avant validation finale du module.
**Gate humain** après architecture, prototypes, chaque lot.

## 11. Stratégie de reprise (sans rien jeter)

- **DÉJÀ VALIDÉ** : docs 01-12 ; design system ; pipeline ; 52 slides ; chartes v1+v2 ;
  portrait Fatou ; historique git.
- **À CONTRÔLER** : cohérence doc ↔ fichiers (faite ici : 1 écart) ; statut desktop 11-20
  (conservé comme version alternative, mobile = standard, à écrire dans le master) ;
  registre des promesses de ressources ; choix de voix si audio.
- **À CORRIGER** : supprimer l'orphelin `lot05/41.png` (à la reprise, hors audit) ;
  ajouter les scripts d'intégrité/glyphes/numéros ; compléter le master de numérotation.
- **À REFAIRE** : **rien** — aucune composante n'est structurellement insuffisante.
- **À PRODUIRE** : lot 6 = séquence 1.4 (slides 53-62, charte gelée, sans prototype) ;
  synthèse/évaluation finale du module 1 ; les 6 PDF promis ; puis voix-off/timing/kit ;
  modules 2+ avec 5 prototypes chacun.

## 12. Pipeline cible proposé — validation

Validé, avec **trois amendements issus des faits** :
1. Insérer « CONTRÔLE AUTOMATISÉ (intégrité/glyphes/numéros) » **avant** le contrôle visuel.
2. Insérer « NETTOYAGE ORPHELINS + COMMIT » après toute renumérotation.
3. Prototypes 5 réservés aux nouvelles familles visuelles ; reprise 1.4 = charte gelée,
   donc pas de prototype. Branche vidéo validée telle quelle + « écoute humaine » après
   AUDIO et « contrôle humain » après ASSEMBLAGE EXTERNE.

## 13. Verdict final

Le pipeline FOLO est **fiable pour la production de slides** sous scénario C, lots de 10,
checklist v2 et gates humains. Il est **conditionnel pour l'audio** et **non disponible
pour la vidéo** (kit de montage externalisé). Le travail existant est **intégralement
conservable** ; la reprise est un enchaînement d'hygiène + production, pas une refonte.

## 14. Prochaine étape recommandée

1. Validation humaine du présent audit.
2. Hygiène : suppression orphelin 41.png + scripts d'intégrité + master numérotation.
3. Lot 6 : séquence 1.4 « Du problème au test » (slides 53-62).
4. Ressources PDF du module 1, puis chaîne voix-off/kit vidéo si souhaitée.

**Fin de l'audit. Aucune production réalisée. En attente de validation.**
