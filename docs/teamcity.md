# TeamCity

## install new server teamcity

Tutorial https://garywoodfine.com/how-to-install-team-city-10-x-on-ubuntu-16-x/

## Create project

Tutorial https://dzone.com/articles/creating-a-new-project-with-teamcity

### config build config

Example script build config

```
APP_NAME="club21js"
BRANCH="develop"
SSH_KEY_PATH="~/.ssh/deploy_ssh_key"
SERVER="ubuntu@ec2-18-138-237-22.ap-southeast-1.compute.amazonaws.com"
DEST_FOLDER="/opt/club21js"
PARAMS="BRANCH=\"$BRANCH\" DEST_FOLDER=\"$DEST_FOLDER\""

echo ===================================================
echo Autodeploy server
echo selected branch $BRANCH
echo ===================================================
echo Connecting to remote server...
ssh -i $SSH_KEY_PATH $SERVER $PARAMS 'bash -i'  <<-'ENDSSH'
    #Connected

    cd $DEST_FOLDER

    git stash # to stash package-lock.json file changes

    git pull
    git checkout $BRANCH
    git pull origin $BRANCH

    rm -rf node_modules/

    yarn install
	  yarn build

    pm2 restart $APP_NAME
    pm2 show $APP_NAME
    pm2 list

    exit
ENDSSH
```

## Config SSH deploy

Config ssh from server running teamcity to the deployment server, you can do follow steps:

- add ssh key (content in file ~/.ssh/deploy_ssh_key.pub) to server deploy by command
  ```
  echo [content of file ~/.ssh/deploy_ssh_key.pub] >> ~/.ssh/authorized_keys
  ```
- on server running teamcity, ssh to the deployment server first time.
  ```
  ssh -i ~/.ssh/deploy_ssh_key [username]@[ip of server deploy]
  ```
