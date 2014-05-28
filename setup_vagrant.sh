#Update apt-get and install needed repos
sudo apt-get update
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get install -y python-software-properties
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update

#installing misc
sudo apt-get install htop make

#install mongodb and start it
sudo apt-get -y install mongodb-org
sudo /etc/init.d/mongod start

#install nodejs & npm
sudo apt-get install -y nodejs

#install dependencies for huboter
cd /vagrant/ && npm install 




