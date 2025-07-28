# AI Recipe Generator — Powered by Groq, n8n, Supabase & MongoDB

A full-stack AI recipe generator built using **Next.js App Router**, **Supabase Auth**, **MongoDB**, and **Groq AI** via **n8n integration**. Automatically classifies and saves recipes or general responses to MongoDB with a smooth UX.

> Custom AI agent via n8n: `AIRecipeGeneratorIbrahim`

---

## Features

- Supabase authentication (signup/login)
- Generate recipes via Groq AI (using n8n webhook)
- Auto-labels responses as `recipe` or `response`
- Saves results to MongoDB if user chooses
- Organized views:
  - `/dashboard` — Generate recipes
  - `/recipes` — View saved recipes
  - `/responses` — View saved non-recipe responses
- Dark/light theme toggle
- Toast notifications, skeleton loaders, and transitions

---

## How It Works

1. User logs in via Supabase
2. Enters a prompt on `/dashboard`
3. Prompt is sent to an **n8n webhook**, which calls **Groq AI**
4. Response is analyzed:
   - If it contains structured `Ingredients` and `Instructions` → labeled as `recipe`
   - Else → labeled as `response`
5. On user clicking **Save**, it's stored in MongoDB
6. Users can view or delete saved entries under `/recipes` or `/responses`

---
## Loom Walkthrough
https://www.loom.com/share/2ad00627af88439dabf6bfc958b70d5b?sid=38046a61-b5bd-4d77-ba72-f9f2cec23d62
## Tech Stack

| Layer       | Stack                                  |
|-------------|----------------------------------------|
| Frontend    | Next.js (App Router), TypeScript, Tailwind CSS |
| Auth        | Supabase                               |
| AI Backend  | Groq via n8n webhook                   |
| Database    | MongoDB Atlas                          |
| UI          | shadcn/ui, Framer Motion, Sonner       |

---
