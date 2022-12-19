# Getting started

1. Clone this repo
2. `npm install`
3. Add `prettier` plugin to your editor, pointing to the config file (.prettierrc)
4. Add `eslint` plugin to your editor, pointing to the config file (.eslintrc.json)

# Running the app

`npm run staging`

This will open http://localhost:8080/
API requests are proxied to a development server, so you must have internet access.

The front-end entrypoint: http://localhost:8080/
The back-end entrypoint: http://localhost:8080/back

# Running storybook

`npm run storybook`

View storybook here: http://localhost:9001/

The mocked data is in /json-server/db.json

POSTing data will add it to that file.

# Running Jest tests (unit tests)

`npm run jest`

# Running eslint

`npm run lint`
