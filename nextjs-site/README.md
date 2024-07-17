This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the `strapi-cms` and the `llm-api` projects.
Then create a .env file from .env.sample, and configure all required variables to access Strapi.
Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production

Create the build package

```bash
npm run build
```

Run the node server

```bash
ENV=production
npm run start
```
