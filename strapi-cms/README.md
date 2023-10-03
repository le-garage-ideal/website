# 🚀 Getting started with Strapi

## Setup DB

Run Postgresql instance using project's docker-compose.yml file:

```
docker-compose up
```

## Run Strapi

Start your Strapi application:

```
npm run develop
```

## Setup data

1. Connect to http://localhost:1337/admin and create the administrator.

2. In Settings, create a new API Token for NextJS : read-only, unlimited. Save it to NextJS .env file. 

3. In Content Manager, start to create brands, models and cars. Don't forget to publish them. 