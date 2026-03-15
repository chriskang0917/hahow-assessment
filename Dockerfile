# build stage
FROM node:lts-alpine AS build-stage

# Install pnpm
RUN corepack enable pnpm

WORKDIR /app

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN pnpm fetch

COPY --chown=node:node . .

RUN pnpm install --offline
RUN pnpm run build

# production stage
FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
