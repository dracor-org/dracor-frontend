FROM node:26-alpine AS build

WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

RUN apk add --no-cache git
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g --force pnpm@11.13.1 && pnpm install
COPY . ./
RUN pnpm build

# unprivileged nginx (listens on 8080, runs as non-root), so that the image
# also runs under an arbitrary user ID, as on OpenShift/OKD
FROM nginxinc/nginx-unprivileged:stable-alpine
ENV NGINX_RESOLVER=${NGINX_RESOLVER:-8.8.8.8}
ENV DRACOR_API_HOST=${DRACOR_API_HOST:-https://dracor.org}
ENV DRACOR_API_PREFIX=${DRACOR_API_PREFIX:-/api/v1}
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
