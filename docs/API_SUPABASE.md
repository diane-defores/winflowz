---
artifact: documentation
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "VoiceFlowz"
created: "2026-04-27"
updated: "2026-04-27"
status: "reviewed"
source_skill: "sf-spec"
scope: "supabase_api"
owner: "Diane"
confidence: "medium"
risk_level: "high"
security_impact: "yes"
docs_impact: "yes"
depends_on:
  - "docs/SPEC_FLUTTER_SUPABASE_MIGRATION.md@0.1.0"
supersedes:
  - "docs/API.md as target Supabase contract"
next_step: "/sf-ready Migration totale VoiceFlowz vers Flutter + Supabase"
---

# API Supabase — VoiceFlowz

## Purpose

This document is the target backend contract for the Flutter + Supabase migration. `docs/API.md` may keep legacy Convex mapping context, but implementation must follow this Supabase contract.

## Auth Contract

- Supabase Auth is required before reading or mutating user-scoped rows.
- `auth.uid()` is the only trusted ownership source.
- Flutter clients must not send a trusted `user_id`; inserts use `default auth.uid()` and RLS `with check`.
- No service role key may be present in Flutter, web, desktop, mobile bundles, logs, or public env.

## Tables

All user tables use UUID primary keys, `created_at timestamptz default now()`, and `updated_at timestamptz default now()` maintained by trigger.

| Table | Required columns | Required constraints |
|---|---|---|
| `profiles` | `id uuid primary key references auth.users(id)`, `display_name text` | `id = auth.uid()` through RLS |
| `user_settings` | `id uuid`, `user_id uuid not null default auth.uid() references auth.users(id)`, `preferred_language text`, `clipboard_sync_enabled boolean default false`, `overlay_enabled boolean default false` | `unique(user_id)`, language non-empty |
| `transcriptions` | `id uuid`, `user_id uuid not null default auth.uid() references auth.users(id)`, `raw_text text`, `cleaned_text text`, `language text`, `duration_ms integer`, `source text` | `trim(raw_text) <> ''`, `trim(cleaned_text) <> ''`, `duration_ms >= 0`, source allowlist |
| `clipboard_items` | `id uuid`, `user_id uuid not null default auth.uid() references auth.users(id)`, `content text`, `content_type text`, `source text`, `pinned boolean default false`, `deleted_at timestamptz` | `trim(content) <> ''`, max length enforced in app and DB, content type allowlist |
| `snippets` | `id uuid`, `user_id uuid not null default auth.uid() references auth.users(id)`, `trigger text`, `content text`, `label text`, `deleted_at timestamptz` | `trim(trigger) <> ''`, `trim(content) <> ''`, unique lower trigger per user |
| `dictionary_terms` | `id uuid`, `user_id uuid not null default auth.uid() references auth.users(id)`, `term text`, `replacement text`, `case_sensitive boolean default false`, `deleted_at timestamptz` | `trim(term) <> ''`, term/replacement cannot create an empty-loop replacement |
| `client_events` | `id uuid`, `user_id uuid not null default auth.uid() references auth.users(id)`, `event_type text`, `severity text`, `metadata jsonb` | metadata must be redacted; no keys, audio, raw transcript, provider payloads |

## RLS Contract

Enable RLS on every table above.

For tables with `user_id`:

- `select`: `auth.uid() is not null and auth.uid() = user_id`
- `insert`: `auth.uid() is not null and auth.uid() = user_id`
- `update`: `auth.uid() is not null and auth.uid() = user_id`
- `delete`: `auth.uid() is not null and auth.uid() = user_id`

For `profiles`:

- `select/update/delete`: `auth.uid() is not null and auth.uid() = id`
- `insert`: `auth.uid() is not null and auth.uid() = id`

No anonymous policies are allowed for user content.

## Realtime Contract

Realtime subscriptions are allowed for `transcriptions`, `clipboard_items`, `snippets`, `dictionary_terms`, and `user_settings` only after auth is ready. Client filters must be scoped to the authenticated user and still rely on RLS as the enforcement layer.

Events are idempotent by `id` + `updated_at`. Out-of-order events older than the local row version are ignored unless they carry `deleted_at`, where delete wins.

## Sync Semantics

- Delete wins over stale edit.
- Duplicate clipboard inserts are de-duplicated by normalized content hash per user when practical.
- Offline writes use client-generated UUIDs and retry with bounded attempts.
- Failed mutations remain visible with a retry/error state; text is not discarded.

## Required SQL Tests

- User A can CRUD own rows in every user table.
- User B cannot select/update/delete User A rows by ID.
- Unauthenticated user cannot read or write user rows.
- Insert with forged `user_id` for another user is denied.
- Empty transcription, empty clipboard item, empty snippet trigger/content, and empty dictionary term are rejected.
- Realtime subscription for User A does not deliver User B rows.

