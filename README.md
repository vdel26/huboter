# Prerequirements

- Node.js
- MongoDB

# Install and run

1. git clone
2. cd huboter
3. npm install
4. npm run db
4. make dev-server

# Use vagrant dev-environment (Ubuntu + mongodb + nodejs)

1. vagrant up (this will start the machine and provision using setup_vagrant.sh)
2. vagrant ssh 
3. cd /vagrant/   <---- it's a shared folder, your code is here!
3. make server

port redirects: 8080 guest, to 8080 host.

