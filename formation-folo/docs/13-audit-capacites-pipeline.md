# FOLO ACADEMY — Rapport d'audit des capacités et du pipeline de production
**Rôle : auditeur technique & directeur de production · Version 1.0**
**Périmètre : aucune production réalisée dans le cadre de cet audit.**
**Base factuelle : session en cours (52 slides, 6 itérations de contrôle, incidents réels consignés).**

---

## 1. Synthèse exécutive

Le pipeline actuel (contenu → ingénierie → storyboard → design system codé → rendu
déterministe PNG → QC visuel → validation humaine par lots de 10) est **le bon**.
Il a transformé des scripts clients truffés de défauts (texte déformé, intrusions
d'anglais, emojis) en 52 slides cohérents, sans aucune génération d'image par IA pour
le texte. Les limites réelles sont ailleurs : vidéo inexistante en interne, contrôle
visuel perfectible au-delà de ~60 slides, dépendance aux validations humaines,
environnement sandbox volatil (réseau restreint, node_modules non persisté).

**Verdict global : piloter FOLO en scénario C (séquentiel verrouillé), lots de 10,
QC humain obligatoire, et traiter la vidéo comme une chaîne externe outillée.**

---

## 2. Audit des capacités (A → N)

Légende : ✅ CAPABLE · ⚠️ CAPABLE SOUS CONDITIONS · ❌ NON FIABLE · ⊘ NON DISPONIBLE

| # | Capacité | Verdict | Preuve / limite | Risque | Conséquence FOLO | Parade |
|---|---|---|---|---|---|---|
| A | Analyse de contenus pédagogiques | ✅ | Brief + scripts 1.1/1.2 analysés ; défauts détectés (« around de vous », « Télédcarger », texte aléatoire) | Documents très longs > fenêtre de contexte | Perte de morceaux du source | Fournir le contenu par morceaux ; archiver chaque source dans `docs/` comme référence unique |
| B | Contenu → architecture pédagogique | ✅ | Doc 01 : 8 modules, livrables en entonnoir, annexe script client | Sur-interprétation d'un brief incomplet | Architecture infidèle | Valider l'architecture avant toute slide (gate humain) |
| C | Découpage modules/séquences | ✅ | 4 séquences/module, progression 25/50/75/100 | Découpage trop fin/gros | Rythme vidéo inadapté | Règle 15-20 min/séquence imposée et contrôlée |
| D | Scripts pédagogiques | ✅ | Storyboards lots 1-5 (fonction, message, visuel par slide) | Verbosité | Slides surchargés | Règle « 1 idée = 1 slide » + checklist ≤ 20 mots utiles |
| E | Création de présentations | ✅ | Système de design complet (desktop + mobile) | — | — | — |
| F | Slides HTML/PNG/PPTX | ⚠️ | PNG 1920×1080 déterministes (Satori+resvg) ; sources = code. PPTX : possible uniquement en images embarquées via pptxgenjs (texte non éditable) | PPTX éditable natif non testé | Livraison PPTX = images, pas de texte modifiable | Si PPTX éditable exigé : outil externe (PowerPoint/Google Slides) ou accepter la version image |
| G | Cohérence graphique longue série | ✅ | 52 slides identiques (tokens codés, pas de saisie manuelle) | La dérive vient des modifications du code lui-même (régressions) | Rupture d'identité | Tout changement de charte = re-rendu TOTAL + QC échantillon (fait lors du retrofit) |
| H | Production par lots | ✅ | Lots de 10 validés | — | — | Conserver ≤ 10 |
| I | Contrôle qualité | ⚠️ | QC visuel slide par slide + scores ; 6 correctifs réels | Ma propre relecture peut laisser passer un défaut à haut volume ; je ne « vois » pas comme un humain fatigué | Slide faible livrée | QC humain obligatoire par lot ; checklist automatisable (fichiers, numéros, glyphes) |
| J | Scripts voix-off | ⚠️ | Écriture ✅ ; synthèse vocale disponible via outil TTS (voix à faire choisir par l'humain) | Choix de voix subjectif | Voix inadaptée à la marque | Audition A/B systématique (add_voice) avant tout lot audio |
| K | Vidéos pédagogiques | ⊘ | Aucun générateur vidéo interne fiable | Croire qu'une vidéo existe alors qu'elle n'existe pas | Blocage de la chaîne vidéo | Chaîne externe (voir §9) |
| L | Cohérence slides/narration/vidéo | ⚠️ | Possible via table de timing unique (slide ↔ voix ↔ durée) si la vidéo est assemblée ailleurs | Désynchronisation si deux équipes modifient sans source unique | Narration décalée | Document « master timing » verrouillé par version |
| M | Respect strict du cahier des charges | ✅ | Charte + révisions 1 & 2 codées ; conformité documentée (doc 12) | Cahier des charges évolutif non tracé | Contradictions de normes | Chaque révision de charte = doc daté + re-rendu |
| N | Validation humaine entre étapes | ✅ | ask_user après chaque lot ; ajustements appliqués (+15 %, mobile, scissions) | Attente bloquante si l'humain absent | Production ralentie | C'est le prix de la fiabilité ; ne pas contourner |

---

## 3. Incidents réels de la session (données d'audit)

1. **Génération d'images IA pour slides = interdite de fait** : les exemples fournis
   contenaient texte déformé/aléatoire → le texte doit sortir d'un moteur typographique
   réel (pipeline actuel).
2. **Moteur de rendu** : Chromium introuvable (CDN bloqués) → fallback Satori+resvg.
   Limites apprises et verrouillées : `display:flex` explicite obligatoire sur tout div
   avec enfants ; pas de flux inline span dans un paragraphe (rendu tronqué) ;
   `children: []` invalide.
3. **Polices** : sous-ensemble latin → glyphe « ≈ » absent ; emojis impossibles.
   Parade : liste blanche de glyphes testés ; reformulations (« ENV. 15 MIN »).
4. **Environnement volatil** : `node_modules` purgé entre sessions ; conflits git dus à
   l'auto-synchronisation de la plateforme. Parade : protocole réinstallation + résolution
   `--theirs` sur binaires, déjà éprouvé 3 fois.
5. **Débordements layout** : badge minuteur et bandeaux orange sur le pied de page
   (slides 24, 34) → détectés au QC visuel, corrigés, régressions vérifiées.

---

## 4. Test de volume — scénarios A / B / C

| Scénario | Fiabilité | Pourquoi |
|---|---|---|
| A — module en une commande | ❌ | Fenêtre de contexte saturée ; aucune validation intermédiaire ; une erreur de charte se répète sur 40+ slides avant détection ; QC impossible à absorber d'un bloc. |
| B — lots de 5-10 sans gates amont | ⚠️ | Limite la casse, mais si l'architecture ou la charte est mauvaise, chaque lot répète le défaut. |
| C — séquentiel verrouillé | ✅ | Audit → architecture → script → prototype → validation → production → contrôle → lot suivant. Chaque erreur est détectée au stade le moins coûteux. **C'est le scénario réellement suivi cette session, et chaque gate a attrapé au moins un défaut réel.** |

**Recommandation : scénario C, lots de 10, sans exception.**

---

## 5. Dérive de cohérence selon l'échelle

| Échelle | Risque observé/projeté |
|---|---|
| 10 slides | Faible : relecture visuelle exhaustive possible. |
| 20 slides | Faible-moyen : premières redites de formulations. |
| 50 slides | Moyen : observé — renumérotations, scissions, retrofit global ; nécessite outillage (scripts) et non mémoire. |
| 100+ slides | Élevé sans verrous : la mémoire humaine/agent ne suffit plus. |
| Plusieurs modules | Élevé : vocabulaire et exemples doivent rester raccord (ex. la chambre froide solaire réutilisée 1.1→1.3 = fil rouge volontaire, à documenter). |
| Plusieurs formations | Très élevé : identité visuelle doit rester distincte par marque ; tokens par formation. |

**Mécanismes de verrouillage (tous déjà en place ou à pérenniser) :**
1. Tokens de design **codés** (`theme.js`, `ds.js`, `dsm.js`) — jamais de couleur/taille saisie dans une slide.
2. Glossaire & fils rouges documentés (`docs/01`, annexe cas réutilisés).
3. Table de numérotation master (lot → plages de slides), mise à jour à chaque lot.
4. Scripts de validation automatiques (règles du moteur de rendu, rendu sans erreur,
   présence/nomenclature des fichiers, doublons de numéros).
5. Liste blanche de glyphes + interdiction emojis.
6. Personnages : **pas de personnage récurrent généré** ; un portrait par étude de cas,
   archivé dans `assets/` et réutilisé à l'identique (Fatou).
7. Re-rendu total + QC échantillon après **toute** modification de charte.
8. Commit git par lot = instantané de référence opposable.

---

## 6. Pipeline de slides — option recommandée

**Option 3** (contenu → architecture → script slide par slide → prototype → validation →
lots → contrôle). Les options 1 et 2 ont été écartées par les faits : chaque étage
supprimé réintroduit une classe d'erreur observée cette session (texte, densité,
débordement, cohérence).

---

## 7. Prototypage — quantité optimale

- **1 slide** : insuffisant (ne teste qu'un seul type).
- **3 slides** : minimum viable (couverture + concept + exercice).
- **5 slides** : **optimal** — couvre ouverture, concept, méthode, exemple, exercice/
  question ; détecte design, densité, lisibilité, cohérence en un seul cycle.
- **10 slides** : délai de premier feedback trop long (le brief initial l'imposait ;
  acceptable uniquement si le design system a déjà été prototypé).

**Protocole** : prototyper les 5 slides *les plus difficiles* du futur module (schéma,
photo, tableau de scores, écran de progression) ; checklist courte (titre 1 s, ≤ 20 mots,
safe zones, contraste N&B, centrage) ; validation humaine ; gel du design system ;
ensuite seulement, production par lots.

---

## 8. Système de contrôle qualité par lot

**Bloc PÉDAGOGIE** : objectif unique par slide ; progression logique vs storyboard ;
niveau de langue adapté ; exemples crédibles Afrique de l'Ouest ; zéro contenu inventé
(comparaison mot à mot avec la source archivée).

**Bloc CONTENU** : fidélité au script client ; exactitude des chiffres (relecture séparée
des nombres : %, FCFA, minutes) ; terminologie du glossaire ; aucune contradiction avec
les lots précédents (recherche des termes clés dans les lots antérieurs).

**Bloc DESIGN** : hiérarchie 3 niveaux max ; lisibilité (corps ≥ 28 px mobile) ; densité ;
contraste (test N&B) ; safe zones 10/15 ; motifs ≤ 15 % ; orange réservé ; un seul chiffre
clé ; checklist Mobile First du commanditaire.

**Bloc PRODUCTION (automatisable)** : rendu sans erreur ; 1 fichier par slide ;
nomenclature séquentielle sans trou ni doublon ; taille de fichier plausible (non nulle,
non corrompue) ; numéro imprimé = numéro de fichier ; engagement git du lot.

Chaque slide notée sur 5 critères (≥ 8/10 requis). **Gate humain final par lot.**

---

## 9. Audit vidéo — élément par élément

| Élément | Statut | Réalité |
|---|---|---|
| A. Script | ✅ | Texte pédagogique complet, ton et durée par séquence. |
| B. Découpage scène par scène | ✅ | Table slide ↔ scène ↔ durée ↔ transition. |
| C. Script voix-off | ✅ | Texte parlé dérivé 1:1 des slides (même vocabulaire). |
| D. Direction artistique | ✅ | Charte, motifs, cadrages photo, style icônes. |
| E. Prompt vidéo (outils externes) | ⚠️ | Rédigeable (Veo/Runway/Pika) mais résultat non vérifiable ici → réservé aux habillages courts, jamais au texte. |
| F. Animation des slides | ⚠️ | Prototypes HTML/CSS possibles ; fiabilité moyenne ; pour la vidéo, préférer slides statiques + animations légères au montage. |
| G. Personnage pédagogique | ⚠️ | Portrait statique réutilisable OK ; personnage animé cohérent = outil externe, risque de dérive visuelle → non recommandé en v1. |
| H. Synchronisation voix/animation | ❌ en interne | Exige un outil de montage ; fournir la table de timing pour le faire ailleurs. |
| I. Génération vidéo | ⊘ | Aucun moteur fiable dans le sandbox. |
| J. Assemblage final | ⊘ (⚠️ si ffmpeg disponible) | À ce jour non vérifié ; sinon CapCut/Premiere/DaVinci côté client avec nos pistes (slides PNG ordonnées + audio + table de timing). |

**Conclusion vidéo** : FOLO doit livrer un « kit de montage » (slides, voix, timing,
habillage) plutôt que prétendre produire le fichier vidéo final en interne.

---

## 10. Architecture d'agents recommandée

Un seul agent accumule production et contrôle → biais d'auto-confirmation.
**Recommandation : B (agents spécialisés), avec priorité absolue à la séparation
production / contrôle.**

- Agent 1 Audit (le présent rapport, puis ré-audit à chaque jalon).
- Agent 2 Architecture pédagogique (ingénierie, glossaire, fils rouges).
- Agent 3 Script (storyboard, voix-off, timing).
- Agent 4 Design/slides (design system codé, rendus).
- Agent 5 Contrôle qualité (checklist §8, scores, veto).

Si un seul agent doit tout faire (contrainte d'outil) : reproduire la séparation par
**phases forcées + gates humains** — c'est le mode de fonctionnement de cette session,
et il a tenu 52 slides sans défaut livré non corrigé.

---

## 11. Protocole de pilotage recommandé (comment me diriger)

1. Fournir le contenu source **complet et archivé** avant production (jamais par fragments oraux).
2. Exiger l'ordre : audit → architecture → storyboard → 5 prototypes → gel → lots de 10.
3. Imposer un **gate humain** après architecture, prototypes et chaque lot.
4. Interdire toute image IA portant du texte ; texte = moteur typographique uniquement.
5. Toute révision de charte = document daté + re-rendu total + QC échantillon.
6. Vidéo = kit de montage externalisé ; ne jamais promettre le fichier final.
7. Conserver l'historique git par lot comme référence opposable.

**Fin du rapport. Aucune slide, visuel, storyboard final, PPTX ou vidéo n'a été produit
dans le cadre de cet audit.**
