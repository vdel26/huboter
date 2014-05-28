# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "precise64"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"

  #config.vm.synced_folder "./", "/opt/huboter", type: "nfs"

  config.vm.provision "shell", path: "./setup_vagrant.sh"
 
  config.vm.network :forwarded_port, guest: 8080, host: 8080


end
