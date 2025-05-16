# Frontend for dracor.org

The web app running the [dracor.org](https://dracor.org) website.

## Development

This project uses [Vite](https://vitejs.dev) as a development and build
environment. In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

**Note:** The app, by default, expects a local instance of the
[DraCor API](https://github.com/dracor-org/dracor-api) to be available at
[http://localhost:8080](http://localhost:8080).

You can run the development frontend against a different API instance by setting
the environment variable `VITE_DRACOR_API` to the respective API base URL,
e.g.:

```
VITE_DRACOR_API=https://dracor.org/api/v1 pnpm start
```

### `pnpm test`

Launches the test runner in the interactive watch mode.

### `pnpm build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the
best performance. The build is minified and the filenames include the hashes.

## Docker

We provide a `Dockerfile` that allows to build and run the DraCor Frontend in a
Docker container. You can either use a pre-built image from
[DockerHub](https://hub.docker.com/r/dracor/frontend) or build an image yourself
from the sources:

```sh
# use the latest pre-build image
docker pull dracor/frontend
# or build the image yourself
docker build -t dracor/frontend .
```

To start the frontend container and make it available at port 8088 of the local
machine run:

```sh
docker run -it --rm -p 8088:80 dracor/frontend
# now open http://localhost:8088 in a browser
```

By default the frontend is connected to the DraCor API at https://dracor.org. To
connect the frontend to another API instance specify the environment
variable `DRACOR_API_HOST` like this:

```sh
docker run -it --rm -p 8088:80 \
  -e DRACOR_API_HOST=https://staging.dracor.org \
  dracor/frontend
```

This implies that the base URL for the API is
`https://staging.dracor.org/api/v1`. If the URL path differs from `/api/v1`,
e.g. in a local development environment, it can be overridden with the
`DRACOR_API_PREFIX` variable:

```sh
docker run -it --rm -p 8088:80 \
  -e DRACOR_API_HOST=https://192.168.0.10:8080 \
  -e DRACOR_API_PREFIX=/exist/restxq/v1 \
  dracor/frontend
```

If you want to use local domain names or encounter "502 Bad Gateway" errors you
may need to specify a DNS server that can resolve the domain name of your API
host:

```sh
docker run -it --rm -p 8088:80 \
  -e DRACOR_API_HOST=https://exist:8080 \
  -e DRACOR_API_PREFIX=/exist/restxq/v1 \
  -e NGINX_RESOLVER=192.168.0.1 \
  dracor/frontend
```

## License

dracor-frontend is [MIT licensed](./LICENSE).
