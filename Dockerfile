FROM node:18 as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./
RUN yarn --ci
COPY . ./
RUN yarn build

FROM nginx:stable-alpine
ENV DRACOR_API=${DRACOR_API:-https://dracor.org/api/v1}
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
