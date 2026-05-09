---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-05-09"
created_at: "2026-05-09 15:19:23 UTC"
updated: "2026-05-09"
updated_at: "2026-05-09 15:19:23 UTC"
status: draft
source_skill: sf-spec
source_model: "GPT-5 Codex"
scope: "design-system-settings"
owner: "Diane"
confidence: medium
user_story: "En tant qu'utilisateur VoiceFlowz, je veux que mes préférences d'apparence et les réglages visuels restent cohérents sur mes appareils, afin de travailler dans une interface lisible, stable et alignée avec la famille Flowz."
risk_level: "medium"
security_impact: "yes"
docs_impact: "yes"
linked_systems:
  - "Flutter app"
  - "Riverpod"
  - "SettingsScreen"
  - "AppTheme"
  - "Supabase user_settings"
  - "Future settings architecture decision"
  - "ContentFlow Site design playground"
depends_on:
  - artifact: "BUSINESS.md"
    artifact_version: "1.0.0"
    required_status: "reviewed"
  - artifact: "BRANDING.md"
    artifact_version: "1.0.0"
    required_status: "reviewed"
  - artifact: "GUIDELINES.md"
    artifact_version: "0.1.0"
    required_status: "reviewed"
  - artifact: "docs/technical/flutter-app.md"
    artifact_version: "0.1.0"
    required_status: "draft"
  - artifact: "docs/API_SUPABASE.md"
    artifact_version: "unknown"
    required_status: "reviewed"
  - artifact: "decision:settings-architecture"
    artifact_version: "pending"
    required_status: "decided"
supersedes: []
evidence:
  - "2026-05-09 design audit adopted ContentFlow family colors, spacing, radii, motion names and component defaults in lib/core/theme/app_theme.dart."
  - "2026-05-09 design audit added a transient Settings Appearance selector in lib/features/settings/presentation/settings_screen.dart."
  - "Current appThemeModeProvider is in-memory only in lib/app/voiceflowz_app.dart."
  - "Supabase user_settings currently exists with keyboard/overlay preferences but no theme mode field in docs/API_SUPABASE.md and migrations."
  - "User request 2026-05-09: prepare a spec to launch once the Settings decision is made."
next_step: "/sf-ready specs/settings-driven-design-system.md after settings architecture decision"
---

# Title

Settings-Driven Design System Completion

# Status

Draft, intentionally blocked until the Settings architecture decision is made. This spec is ready to preserve context and scope, but it must not pass `/sf-ready` until the project decides where user preferences live, how they are persisted locally, and whether authenticated settings sync stays on Supabase or moves behind a backend-agnostic settings store.

# User Story

En tant qu'utilisateur VoiceFlowz, je veux que mes préférences d'apparence et les réglages visuels restent cohérents sur mes appareils, afin de travailler dans une interface lisible, stable et alignée avec la famille Flowz.

Acteur principal: utilisateur VoiceFlowz connecté ou en mode local.

Acteurs secondaires: builder VoiceFlowz, futur backend/settings provider, surfaces Android IME/overlay.

Déclencheurs:

- L'utilisateur choisit `System`, `Light` ou `Dark` dans Settings.
- L'application redémarre.
- L'utilisateur se connecte, se déconnecte ou change d'appareil.
- La décision Settings définit le store local et le contrat de sync.
- Les écrans VoiceFlowz migrent vers les tokens partagés.

Résultat observable attendu: le mode d'apparence choisi s'applique sans flash incohérent, persiste localement, se synchronise par compte si un settings backend est disponible, et tous les écrans utilisent le même système de tokens plutôt que des valeurs visuelles dispersées.

# Minimal Behavior Contract

VoiceFlowz expose un contrat de settings d'apparence qui accepte uniquement `system`, `light` et `dark`, normalise toute valeur inconnue vers `system`, applique le mode avant ou au plus tôt dans le bootstrap Flutter, persiste le choix localement, et synchronise le choix vers les settings utilisateur authentifiés quand l'architecture Settings le permet. Si le store local, le backend ou la session auth est indisponible, l'app continue en `system` ou avec la dernière valeur locale valide, affiche un état récupérable dans Settings, et ne bloque jamais l'utilisation du produit. L'edge case facile à rater est le changement de compte: la préférence visuelle locale ne doit pas exposer ni écraser silencieusement les settings serveur d'un autre utilisateur.

# Success Behavior

- Given aucun choix utilisateur n'existe, when l'app démarre, then le mode `system` est utilisé et suit l'OS.
- Given l'utilisateur choisit `Dark`, when il quitte puis rouvre l'app, then l'app démarre en dark sans revenir à `system`.
- Given l'utilisateur est connecté et le settings backend est disponible, when il change Appearance, then la valeur locale est appliquée immédiatement et une mutation settings compte est effectuée.
- Given l'utilisateur se connecte sur un deuxième appareil, when les settings compte sont chargés, then le mode distant valide devient la préférence appliquée selon la règle de résolution décidée.
- Given le backend settings est indisponible, when l'utilisateur modifie Appearance, then le choix local reste appliqué et un état pending/error visible ou journalisable existe selon le contrat Settings choisi.
- Given une valeur inconnue arrive du stockage local, d'une migration ou du backend, when elle est lue, then elle est normalisée vers `system` sans crash.
- Given un écran utilise cards, buttons, fields, navigation or status surfaces, when il est rendu en light/dark, then il reprend les tokens `AppTheme` et ne réintroduit pas de couleurs/espacements arbitraires.

# Error Behavior

- Si le store local échoue, utiliser `system`, afficher un message non bloquant dans Settings si l'utilisateur interagit avec Appearance, et ne pas perdre les autres settings.
- Si la sync distante échoue, conserver la valeur locale, marquer l'état comme non synchronisé ou réessayer selon le contrat Settings final.
- Si le logout arrive pendant une sync, annuler ou isoler la mutation de l'ancien compte; ne jamais appliquer les settings d'un compte à un autre.
- Si le backend renvoie une valeur invalide, ignorer la valeur, revenir à `system`, et ne pas propager l'invalide.
- Si un écran ne supporte pas encore les tokens, la migration doit être incrémentale; ne pas bloquer le thème global sur un écran secondaire.
- Si Supabase reste l'adaptateur courant, toute mutation `user_settings` doit passer par l'utilisateur authentifié et RLS, jamais par un `user_id` client de confiance.

# Problem

Le design audit du 2026-05-09 a ajouté une première base visuelle partagée avec ContentFlow: palette Flowz, spacing 4px, radii, motion names, Material component defaults et sélecteur Appearance. Cette base reste incomplète: le choix Appearance est seulement en mémoire, il n'est ni persisté localement ni synchronisé par compte, et plusieurs écrans contiennent encore des `EdgeInsets`, `SizedBox` et styles locaux. Comme la stratégie Settings globale n'est pas encore décidée, il serait risqué de figer maintenant un stockage ou un contrat de sync spécifique.

# Solution

Après décision Settings, transformer l'Appearance selector en préférence produit complète: module Settings centralisé, persistence locale, sync authentifiée selon le provider retenu, résolution des conflits local/distant, tests, et migration progressive des écrans vers les tokens `AppTheme`. La base ContentFlow reste la référence familiale, mais VoiceFlowz conserve son identité produit orientée dictée, contrôle et état système.

# Scope In

- Définir le contrat Settings pour `theme_mode`: enum, normalisation, valeur par défaut, résolution local/distant.
- Persister localement Appearance selon la décision Settings.
- Synchroniser `theme_mode` dans les settings utilisateur authentifiés si le backend retenu le supporte.
- Ajouter ou adapter un repository/store Settings, idéalement backend-agnostic si la décision va dans ce sens.
- Intégrer le chargement Settings au bootstrap Flutter sans flash visuel excessif.
- Migrer les écrans principaux vers `AppTheme`, `AppSpacing`, `AppRadii` et composants Material thémés.
- Ajouter un écran ou mode de playground Flutter pour inspecter les tokens light/dark.
- Ajouter tests unitaires/widget pour normalisation, persistence, sync failure, changement de compte et selector UI.
- Mettre à jour docs techniques et API settings.

# Scope Out

- Décider dans cette spec du provider Settings final.
- Migrer tout le backend hors Supabase.
- Ajouter billing, entitlements, quotas ou segmentation premium.
- Refaire entièrement l'UI VoiceFlowz.
- Créer un design system multi-produit versionné publiquement.
- Implémenter des thèmes personnalisés utilisateur, palettes marketplace ou thème par organisation.
- Changer les flows Android IME/overlay hors impact visuel/settings.

# Constraints

- Ne pas lancer l'implémentation avant la décision Settings.
- `theme_mode` accepte seulement `system`, `light`, `dark`.
- La valeur par défaut est `system`.
- Les valeurs inconnues doivent revenir à `system`.
- Le choix utilisateur ne doit pas bloquer auth, dictée, clipboard, clavier ou overlay.
- Les settings compte sont user-scoped; aucune mutation ne doit contourner RLS si Supabase reste l'adaptateur.
- Les clés OpenAI/Anthropic restent dans secure local storage et ne doivent pas être mélangées avec les préférences syncables.
- Les tokens ContentFlow sont une base familiale, pas une copie aveugle: VoiceFlowz peut garder des ajustements de contraste, état audio et surfaces utilitaires.
- Les changements visuels doivent rester testables sans appareil Android réel, sauf statut IME/overlay qui demande QA manuelle.

# Dependencies

- Décision à prendre: architecture Settings.
  - Options probables: local-only pour préférences non critiques, Supabase `user_settings`, ou `SettingsStore` backend-agnostic avec adaptateur local/Supabase/futur provider.
  - Cette décision doit préciser conflict resolution, offline behavior, account switch behavior et séparation secrets vs preferences.
- Code existant:
  - `lib/core/theme/app_theme.dart`
  - `lib/app/voiceflowz_app.dart`
  - `lib/features/settings/presentation/settings_screen.dart`
  - `lib/features/settings/data/secure_secret_store.dart`
  - `lib/data/supabase/**`
  - `supabase/migrations/20260427084000_init_voiceflowz.sql`
  - `supabase/migrations/20260504210000_android_keyboard_ime.sql`
- Docs existantes:
  - `docs/technical/flutter-app.md`
  - `docs/API_SUPABASE.md`
  - `docs/technical/supabase-data.md`
  - `BRANDING.md`
  - `GUIDELINES.md`
- External docs verdict: fresh-docs not needed yet for this draft because implementation is blocked by an internal Settings decision. Recheck official Flutter/Riverpod/Supabase docs when choosing persistence/sync APIs or changing database schema.

# Invariants

- Settings visuels ne sont pas des secrets.
- API keys restent locales et sécurisées; elles ne vont jamais dans `user_settings`.
- Les préférences syncables sont séparées des états runtime et des diagnostics.
- Le thème global est une décision d'app, pas une branche couleur dispersée dans les widgets métier.
- La UI ne promet pas de sync cross-device tant que le backend Settings n'est pas réellement branché.
- Les surfaces Android-only restent conditionnées par `PlatformCapabilities`.
- Le design system doit servir la promesse produit: états clairs pour dictée, traitement, résultat, erreur, permission et sync.

# Links & Consequences

- `lib/app/voiceflowz_app.dart`: le provider actuel devra devenir async/hydraté ou dépendre d'un Settings controller.
- `lib/core/theme/app_theme.dart`: reste la source de tokens; ajouter éventuellement extensions de thème au lieu de valeurs dispersées.
- `lib/features/settings/presentation/settings_screen.dart`: Appearance doit afficher état local/sync si pertinent.
- `lib/features/settings/data/**`: peut recevoir un `SettingsStore` ou `UserPreferencesStore` selon décision.
- `lib/data/supabase/**`: peut recevoir un adaptateur `SupabaseUserSettingsStore` si Supabase garde les settings compte.
- `supabase/migrations/**`: ajouter `theme_mode` avec allowlist si Supabase stocke cette préférence.
- `supabase/tests/rls_smoke.sql`: étendre si `user_settings.theme_mode` est ajouté.
- `docs/API_SUPABASE.md`: documenter la colonne/adaptateur uniquement si Supabase est retenu.
- `docs/technical/flutter-app.md`: documenter le flux Settings -> Theme.
- `TASKS.md`: les tâches d'audit design ouvertes pourront être fermées après implémentation.

# Documentation Coherence

À mettre à jour pendant l'implémentation:

- `docs/technical/flutter-app.md`: architecture Settings, bootstrap theme et règles UI.
- `docs/technical/supabase-data.md`: seulement si Supabase continue à porter `user_settings`.
- `docs/API_SUPABASE.md`: seulement si une colonne ou contrainte SQL est ajoutée.
- `docs/VERIFICATION.md`: ajouter scénarios Appearance persistence/sync.
- `BRANDING.md`: mentionner que la famille Flowz partage une base visuelle si ce choix devient contractuel.
- `CHANGELOG.md`: noter l'amélioration design system/settings au ship.

# Edge Cases

- Premier lancement sans settings local ni distant.
- Valeur locale invalide après downgrade/migration.
- Valeur distante invalide ou absente.
- Offline au moment du changement de préférence.
- Auth change pendant une mutation settings.
- Logout puis login avec autre compte sur le même appareil.
- Supabase non configuré.
- Android IME/overlay lit des préférences pendant que Flutter app n'est pas ouverte.
- Mode dark avec champs, cards et banners de permission à contraste insuffisant.
- Tests web/desktop où secure storage peut être dégradé.

# Implementation Tasks

- [ ] Tâche 1 : Formaliser la décision Settings
  - Fichiers : nouvelle note/spec ou section dans cette spec avant `/sf-ready`
  - Action : choisir local-only, Supabase direct ou `SettingsStore` backend-agnostic; définir conflict resolution, offline behavior, auth switch behavior et séparation secrets/preferences.
  - User story link : évite d'implémenter un thème persistant sur une fondation Settings instable.
  - Depends on : décision utilisateur.
  - Validate with : revue explicite avant `/sf-ready`.

- [ ] Tâche 2 : Créer le modèle de préférence Appearance
  - Fichiers : `lib/core/theme/app_theme.dart`, possiblement `lib/features/settings/domain/user_preferences.dart`
  - Action : centraliser enum, parsing, serialization et fallback `system`.
  - User story link : garantit des valeurs stables entre UI, local store et backend.
  - Depends on : Tâche 1.
  - Validate with : tests unitaires parsing/normalization.

- [ ] Tâche 3 : Implémenter le store local Settings
  - Fichiers : selon décision, probablement `lib/features/settings/data/`
  - Action : lire/écrire `theme_mode` localement, sans toucher aux secrets BYOK.
  - User story link : conserve le choix après redémarrage.
  - Depends on : Tâches 1-2.
  - Validate with : test fake store + redémarrage logique du controller.

- [ ] Tâche 4 : Hydrater le thème au bootstrap
  - Fichiers : `lib/app/voiceflowz_app.dart`, `lib/main.dart` si nécessaire
  - Action : remplacer le provider in-memory par un controller hydraté, appliquer `ThemeMode` depuis le store et gérer loading/fallback sans bloquer le produit.
  - User story link : évite que Settings soit purement temporaire.
  - Depends on : Tâche 3.
  - Validate with : widget test MaterialApp themeMode.

- [ ] Tâche 5 : Ajouter la sync compte si retenue
  - Fichiers : `lib/features/settings/data/**`, `lib/data/supabase/**` ou futur adapter, `supabase/migrations/**`
  - Action : ajouter `theme_mode` côté settings compte ou adapter équivalent, RLS/allowlist, upsert user-scoped et lecture initiale.
  - User story link : rend la préférence cohérente cross-device.
  - Depends on : Tâche 1.
  - Validate with : tests adapter/fake, RLS smoke si Supabase.

- [ ] Tâche 6 : Rendre Settings honnête sur état local/sync
  - Fichier : `lib/features/settings/presentation/settings_screen.dart`
  - Action : afficher le selector, la valeur appliquée et l'état de sync/pending/error si applicable.
  - User story link : l'utilisateur comprend si sa préférence suit ou non son compte.
  - Depends on : Tâches 3-5.
  - Validate with : widget tests selector.

- [ ] Tâche 7 : Migrer les écrans principaux vers tokens
  - Fichiers : `lib/features/voice/presentation/voice_screen.dart`, `lib/features/clipboard/presentation/clipboard_screen.dart`, `lib/features/snippets/presentation/snippets_screen.dart`, `lib/features/dictionary/presentation/dictionary_screen.dart`, `lib/features/settings/presentation/settings_screen.dart`, `lib/features/shell/presentation/app_shell_screen.dart`
  - Action : remplacer espacements/styles locaux récurrents par tokens ou composants thémés, sans refonte fonctionnelle.
  - User story link : stabilise la cohérence visuelle Flowz.
  - Depends on : thème source existant.
  - Validate with : `flutter analyze`, widget smoke tests.

- [ ] Tâche 8 : Ajouter un playground design Flutter
  - Fichiers : à créer sous `lib/features/settings/` ou route debug dédiée selon décision produit
  - Action : montrer palette, typographie Material, spacing, cards, buttons, text fields, banners et états light/dark.
  - User story link : accélère les décisions visuelles sans ouvrir chaque écran.
  - Depends on : tokens stables.
  - Validate with : widget test route/render.

- [ ] Tâche 9 : Mettre à jour docs et vérification
  - Fichiers : `docs/technical/flutter-app.md`, `docs/VERIFICATION.md`, `docs/API_SUPABASE.md` si applicable, `CHANGELOG.md`
  - Action : documenter contrat, store, sync, commandes de vérification et limites.
  - User story link : empêche le drift entre UI, docs et settings réels.
  - Depends on : implémentation.
  - Validate with : revue docs + `flutter analyze`/`flutter test`.

# Acceptance Criteria

- Le mode Appearance a une valeur par défaut `system`.
- Les seules valeurs acceptées sont `system`, `light`, `dark`.
- Une valeur inconnue locale ou distante ne plante pas et revient à `system`.
- Le choix Appearance survit au redémarrage.
- Si la sync compte est retenue, le choix se synchronise avec les settings utilisateur et respecte RLS ou le contrat provider équivalent.
- Le logout/account switch ne mélange pas les préférences de deux utilisateurs.
- Settings indique honnêtement si la préférence est locale seulement, synchronisée, pending ou en erreur.
- Les écrans principaux n'introduisent plus de nouvelles couleurs/espacements arbitraires pour les patterns communs.
- Le design playground rend light et dark sans dépendance réseau.
- `flutter analyze` passe.
- `flutter test` passe, avec tests dédiés aux préférences thème.

# Test Plan

- Unit tests:
  - parsing `AppThemeMode` depuis string.
  - fallback invalid -> `system`.
  - serialization stable.
  - conflict resolution local/distant selon décision Settings.
- Widget tests:
  - `VoiceFlowzApp` applique le mode choisi.
  - Settings selector change le controller.
  - Settings affiche état sync/pending/error si applicable.
- Adapter tests:
  - local store read/write.
  - Supabase or fake backend store rejects invalid values.
  - account switch isolation.
- SQL/RLS tests si Supabase:
  - `theme_mode` allowlist.
  - user A ne lit/modifie pas settings user B.
  - upsert own settings works.
- Manual QA:
  - first launch.
  - restart after mode change.
  - login/logout.
  - light/dark pass on Voice, Clipboard, Snippets, Dictionary, Settings.
  - Android Settings card still readable in dark mode.

# Stop Conditions

- La décision Settings n'est pas prise.
- Le contrat mélange secrets locaux et préférences syncables.
- Une solution nécessite de stocker des clés BYOK dans `user_settings`.
- Les settings compte ne peuvent pas être isolés par user.
- La sync distante force un provider backend non décidé.
- `flutter analyze` ou `flutter test` échoue.

# Rollback Plan

- Garder `AppTheme.light`, `AppTheme.dark` et `ThemeMode.system` comme fallback.
- Si la persistence locale casse, revenir temporairement au provider in-memory actuel.
- Si la sync distante casse, désactiver uniquement l'adapter sync et conserver local-only.
- Si la migration SQL pose problème, retirer la colonne/contrainte `theme_mode` avant release tant que l'UI fonctionne localement.

# Open Questions

- Quel est le contrat Settings final: local-only, Supabase direct ou `SettingsStore` backend-agnostic?
- Quelle règle gagne au premier login sur un appareil qui a déjà une préférence locale différente du compte?
- Les préférences Android IME/overlay doivent-elles utiliser le même store Settings que Appearance?
- Le design playground doit-il être une route debug cachée, une section Settings visible, ou un outil dev-only?
- Doit-on versionner formellement les tokens Flowz partagés entre ContentFlow et VoiceFlowz?

# Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-05-09 15:19:23 UTC | sf-spec | GPT-5 Codex | Created draft spec for post-settings-decision design system completion | Draft spec created; blocked on Settings architecture decision | `/sf-ready specs/settings-driven-design-system.md after settings architecture decision` |

# Current Chantier Flow

| Step | Status | Evidence | Next step |
|------|--------|----------|-----------|
| sf-spec | done | This draft spec exists with explicit blocker | Decide Settings architecture |
| sf-ready | blocked | `decision:settings-architecture` is pending | Run after decision |
| sf-start | pending | Implementation intentionally deferred | Wait for sf-ready |
| sf-verify | pending | No implementation yet | After sf-start |
| sf-end | pending | No implementation yet | After sf-verify |
| sf-ship | pending | No implementation yet | After sf-end |
