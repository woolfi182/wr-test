# AI processing API

### OpenAI process texts from audio or video to do interesting things

At PCompany we have a lot of complex backend workflows that call out to rate limited resources.

As an example, we send transcribed audio content to the OpenAI API to generate a short title for a recorded video clip. Once we have this content, we would like to store it somewhere.

Also we allowing querying the status of each request e.g. `queued`, `complete`, `error`

## Installation

```sh
npm install
```

## Running the app

```sh
# development
npm run start

# watch mode
npm run start:dev

# production mode. Awailable only after build
npm run start:prod
```

## Build

```sh
npm build
```

## Swagger

AS we use SwaggerUI, after starting the app, it would be possible to open `/api` path in your browser

## Debug

In case you are using VsCode it is possible to debug your application right away. Thus `.vscode` folder contains `launch.json` file that allows you manipulate debug options.

## Test

```sh
# unit tests
npm run test

# e2e tests
npm run test:e2e

# all tests together
npm run test:all

# test coverage
npm run test:cov
```

## Lint

```sh
npm lint
```

## License

Nest is [MIT licensed](LICENSE).
