# RevPayment

###### about this project

> RevPayment is a project for ...

## Getting Started

### Clone the project

Clone this repo to your local machine using:

```bash
git clone https://github.com/Rev-Tech/SmartCity.git RevPayment
```

### Install the dependencies

1. Change the current working directory to the project:

```bash
cd RevPayment
```

2. Install [`yarn`](https://github.com/yarnpkg/yarn) (if you haven't):

```bash
# through npm:
sudo npm install -g yarn

# or through package manager:
# for MacOS:
brew install yarn

# for Debian/Ubuntu:
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

3. Install [`lerna`](https://github.com/lerna/lerna) (if you haven't):

```bash
sudo npm install -g lerna
# or "sudo yarn global add lerna"
```

5. Simply install the package dependencies by command:

```bash
yarn
```

5. Bootstrap the packages in the current Lerna repo:

```bash
yarn bootstrap
# This command wil run lerna clean and lerna bootstrap
```

### Setting Config

Copy .env.development to .env at each `/packages/<package_name>/env/`

### Start each mono package

This system requires [`MongoDB`](https://docs.mongodb.com/manual/installation/) and [`Redis`](https://redis.io/topics/quickstart) in onder to run. Please ensure that your machine already have those installed. If not, consider following the link attached to them for the installation guide.

Four servers you need to run to start this system. One is the backend server, the other servers are the admin, partner and client server.

- Start each server at each package:

  ```bash
   yarn dev
  ```

- Or start all packages (using command at `/` project):

  ```bash
   yarn start-dev
  # When you want stop at all projects, run command : node_modules/.bin/pm2 delete all
  #Todo : add yarn command for this
  ```

- Compile project:

  ```bash
  yarn compile
  ```

- Do migration for database (package `/server` only ):

  - Create new migration file:
    ```bash
    yarn migrate-create
    ```
  - Upgrade/downgrade migrations:

    ```bash
      yarn migrate-up # upgrade database
      yarn migrate-down # downgrade database
    ```

- Run server test (package `server`):

  ```bash
  yarn test
  ```

- We can also run test for all packages at root

### Tool for Debug

- This repo use Redux to manage state client, so we use extension Redux DevTools to debug: use [this extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) for chrome and coccoc or [this extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/) For firefox.

- Add more, you should use React Developer Tools to debug for ReactJs: use [this extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) for chrome and CocCoc or [this extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) For Firefox.
