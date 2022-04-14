FROM node:14 as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./
RUN yarn --ci
COPY . ./
RUN yarn build

FROM nginx:stable-alpine
ARG DRACOR_API=https://dracor.org/api
ENV DRACOR_API=${DRACOR_API}
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /tmp
RUN envsubst '$DRACOR_API' < /tmp/nginx.conf > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
