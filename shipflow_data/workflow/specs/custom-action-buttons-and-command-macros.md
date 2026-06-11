---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "WinFlowz"
created: "2026-06-11"
created_at: "2026-06-11 10:58:00 UTC"
updated: "2026-06-11"
updated_at: "2026-06-11 12:10:00 UTC"
status: reviewed
source_skill: sf-build
source_model: "GPT-5 Codex"
scope: "custom-action-buttons-and-command-macros"
owner: "Diane"
confidence: high
user_story: "En tant qu'utilisatrice WinFlowz, je veux créer des boutons personnalisés avec un nom, une icône et une action exécutable, afin de lancer rapidement un snippet texte, une macro clavier ou une action WinFlowz sans passer par un raccourci gestuel ou un copier-coller manuel."
risk_level: "medium"
security_impact: "yes"
docs_impact: "yes"
linked_systems:
  - "WinFlowz Flutter app"
  - "Snippets screen"
  - "Desktop overlay hosts"
  - "Android keyboard action expression model"
  - "Backend-agnostic stores"
depends_on:
  - artifact: "shipflow_data/workflow/specs/cross-surface-send-to-actions.md"
    artifact_version: "1.0.0"
    required_status: "reviewed"
  - artifact: "shipflow_data/workflow/specs/winflowz-settings-page-ux-remaster.md"
    artifact_version: "1.0.0"
    required_status: "ready"
supersedes: []
evidence:
  - "User request 2026-06-11: create custom buttons, not just custom shortcuts, with icon choice and command launching."
  - "Current app already stores Snippets separately and supports Android typed action expressions (`action:`, `keyevent:`, `modifier:`)."
  - "Current desktop overlay hosts can deliver text but do not yet expose typed key-sequence delivery."
next_step: "/104-sf-end shipflow_data/workflow/specs/custom-action-buttons-and-command-macros.md"
---

# Title

Custom Action Buttons And Command Macros

## Status

Ready for a bounded V1 implementation. Product direction is clear: WinFlowz
needs reusable tappable actions, not only text snippets or gesture shortcuts.
This slice introduces persistent custom buttons with typed actions and a safe
execution contract.

## User Story

En tant qu'utilisatrice WinFlowz, je veux créer des boutons personnalisés avec
un nom, une icône et une action exécutable, afin de lancer rapidement un
snippet texte, une macro clavier ou une action WinFlowz sans passer par un
raccourci gestuel ou un copier-coller manuel.

## Minimal Behavior Contract

L'écran Snippets doit aussi exposer une collection de boutons personnalisés.
Chaque bouton possède un titre, une icône, un style visuel léger, et une action
typée. La V1 accepte trois familles d'action: texte/snippet, expression clavier
WinFlowz, et macro de séquence clavier desktop. Le modèle doit rester explicite:
un snippet reste du contenu texte, un bouton reste une action exécutable. Les
actions ne doivent jamais accepter une commande système arbitraire ou un script
shell libre. L'edge case critique est la promesse cross-platform: quand une
action n'est pas exécutable sur la plateforme courante, l'UI doit le dire
clairement au lieu de simuler un succès.

## Success Behavior

- Given l'utilisatrice ouvre Snippets, when elle bascule sur l'onglet boutons,
  then elle voit la liste des boutons existants et un formulaire de création.
- Given elle crée un bouton texte, when elle l'exécute sur un host overlay
  desktop compatible, then WinFlowz livre le texte vers l'app cible via le pont
  natif existant.
- Given elle crée un bouton macro clavier desktop avec une séquence du type
  `Ctrl+W` puis `N`, when elle l'exécute sur un host desktop compatible, then la
  séquence est envoyée proprement à l'application ciblée.
- Given elle crée un bouton action clavier WinFlowz, when elle le consulte dans
  l'UI, then le contrat stocké reste compatible avec le langage d'expression
  Android existant et peut être réutilisé ailleurs sans ambiguïté.
- Given un bouton n'est pas exécutable sur la plateforme courante, when elle
  appuie dessus, then l'app affiche un message clair sur la limite plutôt qu'un
  faux succès.
- Given l'utilisatrice édite ou supprime un bouton, when l'action aboutit, then
  la liste est rafraîchie sans redémarrer l'app.

## Error Behavior

- Nom vide, action vide ou type incomplet: la création est refusée avec un
  message récupérable.
- Macro desktop mal formée: la validation locale bloque l'enregistrement.
- Host natif indisponible ou non supporté: l'exécution retourne un état
  explicite et non destructif.
- Aucune donnée sensible, texte privé ou commande complète ne doit être loggée
  en diagnostic brut.

## Scope In

- Nouveau modèle `CustomActionButton` et actions typées.
- Store backend-agnostic local/Firebase pour les boutons.
- Onglet ou segment UI dans l'écran Snippets pour lister, créer, éditer,
  supprimer et lancer des boutons.
- Exécution desktop bornée pour:
  - texte
  - séquences clavier typées
- Réutilisation du langage d'expression clavier WinFlowz côté modèle/UI.
- Tests Dart/widget et tests de parsing/bridge ciblés.
- Documentation technique Flutter mise à jour.

## Scope Out

- Commandes système arbitraires, shell, scripts, URLs externes, ou lancement de
  processus libres.
- Exécution Android native depuis l'écran Flutter hors capacités déjà exposées.
- Nouveau tab principal de navigation.
- Android build/package/device QA locale.

## Constraints

- Respecter `AGENTS.md`: checks locaux autorisés seulement `flutter analyze`,
  `flutter test` et tests ciblés.
- Rester cohérent avec l'architecture backend-agnostic des stores Flutter.
- Garder une séparation produit nette entre snippets texte et boutons d'action.
- Les hosts desktop restent best-effort; un échec de livraison ne doit pas
  corrompre les données du bouton.
- Pas de promesse de commande arbitraire cachée derrière un champ texte.

## Test Contract

- `flutter analyze`
- `flutter test test/custom_action_button_store_test.dart`
- `flutter test test/custom_action_buttons_screen_test.dart`
- `flutter test test/desktop_overlay_bridge_test.dart test/windows_overlay_bridge_test.dart`

## Implementation Tasks

- [x] Task 1: Ajouter les modèles domaine des boutons et des actions typées.
- [x] Task 2: Ajouter les stores/providers local et Firebase.
- [x] Task 3: Ajouter le moteur d'exécution desktop borné.
- [x] Task 4: Intégrer l'UI dans Snippets.
- [x] Task 5: Ajouter les tests et mettre à jour la doc technique.

## Acceptance Criteria

- [x] AC 1: L'écran Snippets expose une vue dédiée aux boutons personnalisés.
- [x] AC 2: Un bouton peut stocker un titre, une icône et un type d'action.
- [x] AC 3: Les boutons texte et macro desktop peuvent être exécutés depuis
  l'UI sur host desktop supporté.
- [x] AC 4: Les boutons action clavier WinFlowz sont stockés comme actions
  typées et validées.
- [x] AC 5: Les plateformes non supportées affichent une limite claire.
- [x] AC 6: La création, l'édition et la suppression sont couvertes par tests.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-06-11 10:58:00 UTC | sf-build | GPT-5 Codex | Created ready spec for custom action buttons and command macros. | Ready for bounded implementation. | `/sf-start shipflow_data/workflow/specs/custom-action-buttons-and-command-macros.md` |
| 2026-06-11 12:10:00 UTC | sf-build | GPT-5 Codex | Implemented custom action button models, stores, snippets-library UI, bounded desktop sequence delivery, tests, and docs. | Local verification passed; closure/ship still pending explicit commit flow. | `/104-sf-end shipflow_data/workflow/specs/custom-action-buttons-and-command-macros.md` |

## Current Chantier Flow

sf-spec: ready
sf-ready: accepted inside sf-build
sf-start: implemented
sf-verify: local checks pass
sf-end: pending
sf-ship: pending
