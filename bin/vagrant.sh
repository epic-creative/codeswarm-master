#!/bin/bash


echo "Updating package lists"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y python-software-properties
add-apt-repository -y ppa:couchdb/stable

echo "Installing dependencies"
apt-get install -y build-essential libcurl4-gnutls-dev libexpat1-dev gettext libz-dev libssl-dev git ruby-full rubygems couchdb python g++ curl

echo "Installing the Node Version Manager"
curl https://raw.githubusercontent.com/creationix/nvm/v0.7.0/install.sh | NVM_DIR=/usr/local/nvm sh
chmod 777 -R /usr/local/nvm 

source ~/.profile
nvm install v0.10.28
nvm use v0.10.28

npm install grunt-cli -g --no-bin-links
npm install nodemon -g --no-bin-links
npm install mocha -g --no-bin-links

echo "Install project's node_modules"
cd /vagrant
npm install --no-bin-links

echo "Installing Compass"
gem install compass --no-ri --no-rdoc
gem install breakpoint --no-ri --no-rdoc
gem install sass --no-ri --no-rdoc

npm set bin-links false

echo "Configuring the local Vagrant user"
cat >/home/vagrant/.bashrc <<EOL
set -o vi
alias l="ls -alF"
cd /vagrant
[ -s "/usr/local/nvm/nvm.sh" ] && . "/usr/local/nvm/nvm.sh" # This loads nvm
nvm use v0.10.28 # Use latest version
EOL

# Edit the CouchDB Local.ini file
sed -i.bak 's/;bind_address = 127.0.0.1/bind_address = 0.0.0.0/g' /etc/couchdb/local.ini
sed -i.bak 's/;admin = mysecretpassword/admin = admin/g' /etc/couchdb/local.ini

# Ensure CouchDB is started
restart couchdb

echo "Installing Docker"
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
sh -c 'echo deb http://get.docker.io/ubuntu docker main' > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y linux-image-generic-lts-raring linux-headers-generic-lts-raring
apt-get install -y lxc-docker