# Portfilo-2.0

Muhammad Musa's portfolio for production AI engineering, custom LLMs, RAG systems, mobile products, and scalable backends.

## Local development

Requirements: Node.js 22.13 or newer and Yarn 1.22.

```bash
yarn install --frozen-lockfile
yarn dev
```

Open `http://localhost:3000`.

## Verification

```bash
yarn lint
yarn test
```

GitHub Actions runs the same checks for every push and pull request targeting `main` or `dev`.

## Contact email

Copy `.env.example` to `.env.local`, add a Resend API key, and configure a verified sender. Contact submissions are delivered to the portfolio owner's email address by the server route.

Never commit `.env.local` or API keys.
