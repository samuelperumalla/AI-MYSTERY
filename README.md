# AI Mystery Room

An evidence-based fictional investigation game. Players create a case from a premise, inspect AI-generated suspects and evidence, and make a final accusation. The server keeps the canonical solution private until the verdict is submitted.

## Requirements

- Node.js 22.19.0 and npm 10 or later (the implementation environment provides Node 22.19.0).
- MongoDB 7 or a compatible MongoDB Atlas database.
- A Gemini API key for case generation.

## Setup

1. Install the root tooling and both app packages:

   ```sh
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and `GEMINI_API_KEY`. `GEMINI_MODEL` defaults to `gemini-2.5-flash`.

3. Copy `client/.env.example` to `client/.env` if the API is not at `http://localhost:5000/api/v1`.

4. Start MongoDB, then run both applications:

   ```sh
   npm run dev
   ```

   The client is at <http://localhost:5173>; the API is at <http://localhost:5000/api/v1>.

If the browser reports `ERR_CONNECTION_REFUSED` for port 5000, check that the server terminal says it connected to MongoDB and is listening. `MONGODB_URI` must be a complete `mongodb://...` or `mongodb+srv://...` connection string. The example uses a local MongoDB instance; for Atlas, use the connection string provided by Atlas. In development, the API allows Vite on `localhost:5173` or `localhost:5174`; in production, set `CLIENT_ORIGIN` to the exact frontend origin(s), comma-separated if needed.

Build the frontend with `npm run build`. Start only the API with `npm run start` after setting its environment. The server intentionally refuses to publish simulated successful generations when the Gemini key or database is unavailable.

## Architecture

- `client/`: React, Vite, Tailwind CSS, React Router, and TanStack Query.
- `server/`: Express REST API, Mongoose persistence, Zod case validation, Gemini generation, and session authorization.
- `docs/SPEC.md`: implementation source specification.
- `docs/API.md`: REST API contract and security notes.

Generated chats and documents render as text. Photo and CCTV entries are visibly simulated because an image or video provider is not configured in this MVP. No real messaging, camera, or identity services are connected.

## Guest sessions

The browser keeps a random player ID and token in local storage to scope its case list. The server stores only a hash of the player token. Investigation sessions use a separate random token; the browser stores it in session storage and sends it in the `x-session-token` header. Clearing browser storage removes the local access credentials.

## Limitations

Case generation is synchronous and may take up to the upstream model timeout. Case validation enforces structure, references, and minimum evidence coverage, while narrative-level logical consistency still depends on Gemini's generated facts. Generated media is not provided: visual records are labeled simulated. Production deployment should configure HTTPS, a strict `CLIENT_ORIGIN`, a managed database, persistent rate limiting, and operational monitoring.
