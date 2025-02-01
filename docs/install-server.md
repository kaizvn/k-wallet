# get started

In follow, will show some software and config need to setup in new server deploy

## update & upgrade ubuntu

```
sudo apt-get update && sudo apt-get upgrade
```

## Nginx

Tutorial detail: https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04

```
sudo apt-get install nginx
```

## NVM

Reference: https://github.com/nvm-sh/nvm

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

or

```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

## Yarn

Reference: https://classic.yarnpkg.com/en/docs/install/#mac-stable

```
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn
```

## PM2

Reference: https://pm2.keymetrics.io/docs/usage/quick-start/

## Redis

Tutorial detail: https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04
