---
artifact: technical_decision_pointer
metadata_schema_version: "1.0"
artifact_version: "1.0.4"
project: "WinFlowz App"
created: "2026-05-17"
updated: "2026-05-21"
status: reviewed
source_skill: sf-docs
scope: "suite-authentication-pointer"
owner: "Diane"
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "WinFlowz suite auth"
  - "Clerk"
  - "Firebase Auth"
  - "Firestore"
depends_on:
  - artifact: "/home/claude/shipflow_data/projects/winflowz/docs/technical/suite-authentication.md"
    artifact_version: "1.0.4"
    required_status: "reviewed"
supersedes: []
evidence:
  - "Canonical suite auth decision documented in the main WinFlowz project on 2026-05-17."
  - "App domain contracts for suite identity and product entitlements added on 2026-05-20 without coupling Flutter UI to Clerk."
  - "App suite identity provider and settings diagnostics added on 2026-05-21 as a conservative local bridge placeholder."
  - "Firebase bridge client added on 2026-05-21: configured builds call the suite bridge with a Firebase ID token; unconfigured or failing bridge states stay fail-closed."
next_review: "2026-06-17"
next_step: "/sf-spec unified-suite-authentication provider decision"
---

# Suite Authentication Pointer

The canonical suite authentication decision lives in:

`/home/claude/shipflow_data/projects/winflowz/docs/technical/suite-authentication.md`

For this Android app:

- Firebase Auth remains the active app auth adapter for now.
- Clerk is the long-term suite identity provider.
- The app should bridge Firebase `uid` to the suite `global_user_id`.
- Product access must come from server-owned entitlements, not from account existence.
- Do not migrate this app directly to Clerk Flutter/native until that path is proven on Android device QA.
- The app now has domain contracts, a Riverpod suite identity provider, non-sensitive Settings diagnostics, and a bridge client behind `SUITE_IDENTITY_BRIDGE_URL`.
- If `SUITE_IDENTITY_BRIDGE_URL` is missing, invalid, unavailable, or returns an unexpected payload, the app stays fail-closed: Firebase sign-in is recognized locally but does not imply a `globalUserId` or product entitlement.

Implementation details belong in the active spec:

`shipflow_data/workflow/specs/unified-suite-authentication.md`
