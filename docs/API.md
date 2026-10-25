# REST API

Base URL: `/api/v1`. JSON responses use `{ "success", "data", "error" }`. User-facing errors contain safe messages and stable codes. Every case endpoint is scoped by the `x-player-id` and `x-player-token` headers; the token is never placed in a URL. Case creation is rate limited.

## `GET /health`

Returns service status. Never returns environment variables or secrets.

## `GET /cases/meta`

Returns supported categories.

## `POST /cases`

Creates and persists a validated mystery. Requires player headers. Body:

```json
{
  "story": "At least 30 and at most 3000 characters",
  "category": "Theft or heist",
  "difficulty": "Medium",
  "title": "Optional title",
  "constraints": "Optional constraints, up to 1000 characters",
  "requestId": "client-generated-idempotency-key"
}
```

Returns `201` and public case data. The private solution is omitted. Repeating the same request ID for the same player returns the existing case.

## `GET /cases`

Lists only cases scoped to the authorized player token.

## `GET /cases/{caseId}`

Returns public case details, suspects, evidence, and timeline. Does not return the canonical solution.

## `GET /cases/{caseId}/evidence/{evidenceId}`

Returns a public evidence item belonging to the authorized case.

## `POST /cases/{caseId}/sessions`

Creates or resumes an investigation session. Response includes `sessionId` and a one-time returned session access token. Keep that token in browser session storage and send it in `x-session-token` for session operations.

## `POST /cases/{caseId}/sessions/{sessionId}/evidence/{evidenceId}/open`

Requires case and session access. Records inspected evidence.

## `POST /cases/{caseId}/sessions/{sessionId}/accusation`

Requires case and session access. Body: `{ "suspectId": "suspect-02", "reasoning": "Optional text, up to 1000 characters" }`. The server validates membership, evaluates against the stored private culprit, and atomically stores one verdict. A duplicate submission returns `409` with the stored verdict; the selected solution cannot be changed.

## `GET /cases/{caseId}/sessions/{sessionId}/verdict`

Returns a verdict only after submission; otherwise returns `409 VERDICT_UNAVAILABLE`.

## Status codes

`200` success, `201` created, `400` invalid request, `401` missing authorization, `403` denied, `404` absent resource, `409` state conflict, `413` oversized request, `429` rate limited, `502` unusable upstream generation, `503` dependency unavailable, `500` unexpected server error.
