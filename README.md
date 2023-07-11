# Boilerplate for Elm apps using ESBuild

This is just a small example on how to set up an [Elm](https://elm-lang.org/) project
using [ESBuild](https://esbuild.github.io/).

## Running the project

### Prerequisites

To run this project you need the following prerequisites

- [Node](https://nodejs.org/en)
- [Yarn](https://yarnpkg.com/)
    - You can use NPM instead of Yarn, but the project is only configured and tested using Yarn, and this readme assumes
      you are using Yarn

### Install dependencies

Install the project's dependencies by running the following command:

```bash
yarn
```

### Run

Once the dependencies have been installed, run the app by running the following command:

```bash
yarn start
```

The app should now be served at port 8080.

### Build for production

To build the app for production, run the following command:

```bash
yarn build --prod
```

(If you leave off the `--prod` flag, you will get a non-minified debug build with the Elm debugger enabled)

When the app has finished building, you should find the output in `dist/prod`. These files can be served as-is using
your favourite web server.