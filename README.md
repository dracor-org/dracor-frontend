# Frontend for dracor.org

The web app running the [dracor.org](https://dracor.org) website.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). See its
[documentation](https://facebook.github.io/create-react-app/docs/documentation-intro) on how to perform common tasks.

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

**Note:** The app expects a local eXist database with the
[dracor-api](https://github.com/dracor-org/dracor-api) installed to be
available at [http://localhost:8080](http://localhost:8080).

You can run the development frontend against a different backend by setting the
environment variable `REACT_APP_DRACOR_API` to the respective API base URL,
e.g.:

```
REACT_APP_DRACOR_API=https://dracor.org/api yarn start
```


### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the documentation about [running tests](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the
best performance. The build is minified and the filenames include the hashes.

## Docker

We provide a `Dockerfile` that allows to build and run the DraCor Frontend in a
Docker container. The DraCor API to connect the frontend to can be adjusted with
the environment variable `DRACOR_API` (default: https://dracor.org/api/v1).

```sh
# build the container
docker build -t dracor-frontend .
# run the container
docker run -it --rm -p 8088:80 dracor-frontend
# now open http://localhost:8088 in a browser
```

To connect the frontend to another DraCor API instance specify the environment
variable `DRACOR_API` like this:

```sh
docker run -it --rm -p 8088:80 \
  -e DRACOR_API=https://staging.dracor.org/api/v1 \
  dracor-frontend
```

## License

dracor-frontend is [MIT licensed](./LICENSE).
