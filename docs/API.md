---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-26"
updated: "2026-04-26"
status: "draft"
source_skill: "sf-docs"
scope: "api"
owner: "unknown"
confidence: "medium"
security_impact: "yes"
docs_impact: "yes"
linked_systems:
  - "Convex"
depends_on:
  - "../ARCHITECTURE.md@0.1.0"
supersedes: []
evidence:
  - "../convex/schema.ts"
  - "../convex/clipboard.ts"
  - "../convex/transcriptions.ts"
  - "../convex/snippets.ts"
next_step: "$sf-docs api"
---

# API — VoiceFlowz

VoiceFlowz uses Convex functions instead of HTTP route files. The functions below are callable from the Expo app through the generated Convex client.

## Security Status

The current functions accept `userId` from the client. This is sufficient for local MVP development, but not for a secure multi-user product. Replace `TEMP_USER_ID` with authenticated Clerk identity and enforce authorization before public launch.

## Tables

### `clipboardItems`

| Field | Type | Notes |
|---|---|---|
| `userId` | string | Temporary client-provided user id. |
| `content` | string | Clipboard content. |
| `contentType` | `"text"` / `"url"` / `"code"` | Code currently creates `text` or `url`. |
| `source` | string | Device or workflow source. |
| `pinned` | boolean | Pin state. |

Indexes: `by_user`, `by_user_time`.

### `transcriptions`

| Field | Type | Notes |
|---|---|---|
| `userId` | string | Temporary client-provided user id. |
| `rawText` | string | Original transcription. |
| `cleanedText` | string | Cleaned or edited transcription. |
| `language` | string | Detected or selected language. |
| `durationMs` | number | Recording duration. |
| `source` | string | `in-app`, `overlay` or another caller-provided source. |

Index: `by_user`.

### `snippets`

| Field | Type | Notes |
|---|---|---|
| `userId` | string | Temporary client-provided user id. |
| `trigger` | string | Example: `/sig`. |
| `content` | string | Text inserted by the snippet. |
| `label` | string | Human-readable label. |

Indexes: `by_user`, `by_user_trigger`.

### `dictionary`

| Field | Type | Notes |
|---|---|---|
| `userId` | string | Temporary client-provided user id. |
| `term` | string | Preferred term. |
| `replacement` | string, optional | Optional correction. |

Index: `by_user`.

## Clipboard Functions

### `clipboard.list`

- **Type**: query
- **Args**: `{ userId: string }`
- **Returns**: up to 50 clipboard items ordered descending.
- **Used by**: `app/(tabs)/clipboard.tsx`

### `clipboard.add`

- **Type**: mutation
- **Args**: `{ userId: string, content: string, contentType: "text" | "url" | "code", source: string }`
- **Returns**: inserted item id, or latest item id if the newest item has the same content.
- **Used by**: Clipboard polling and transcript sharing.

### `clipboard.togglePin`

- **Type**: mutation
- **Args**: `{ id: Id<"clipboardItems"> }`
- **Returns**: void.

### `clipboard.remove`

- **Type**: mutation
- **Args**: `{ id: Id<"clipboardItems"> }`
- **Returns**: void.

## Transcription Functions

### `transcriptions.list`

- **Type**: query
- **Args**: `{ userId: string }`
- **Returns**: up to 30 transcriptions ordered descending.

### `transcriptions.save`

- **Type**: mutation
- **Args**: `{ userId: string, rawText: string, cleanedText: string, language: string, durationMs: number, source: string }`
- **Returns**: inserted transcription id.

### `transcriptions.update`

- **Type**: mutation
- **Args**: `{ id: Id<"transcriptions">, rawText: string, cleanedText: string }`
- **Returns**: void.

### `transcriptions.remove`

- **Type**: mutation
- **Args**: `{ id: Id<"transcriptions"> }`
- **Returns**: void.

## Snippet Functions

### `snippets.list`

- **Type**: query
- **Args**: `{ userId: string }`
- **Returns**: all snippets for the user.

### `snippets.findByTrigger`

- **Type**: query
- **Args**: `{ userId: string, trigger: string }`
- **Returns**: first matching snippet or null.

### `snippets.upsert`

- **Type**: mutation
- **Args**: `{ userId: string, trigger: string, content: string, label: string }`
- **Returns**: snippet id.

### `snippets.remove`

- **Type**: mutation
- **Args**: `{ id: Id<"snippets"> }`
- **Returns**: void.
