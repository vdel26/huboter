USER         = ubuntu
REMOTE       = ec2-54-224-138-186.compute-1.amazonaws.com
REMOTEDIR    = /home/$(USER)/huboter/
PRIVATEKEY   = /Users/victordg/.ssh/aws/vdg-3scale-support.pem

rsyncflags   = -e "ssh -i $(PRIVATEKEY)" --checksum -rlvzu --exclude ".*" --exclude "*.tgz*"

all:
	@echo "use any of the targets: start, stop, pull, push, sync, deploy, watch"

server:
	./bin/www

debug:
	DEBUG=huboter ./bin/www

#start:
#	@echo "starting in debug mode"
#	ssh -i $(PRIVATEKEY) $(USER)@$(REMOTE) 'cd $(REMOTEDIR); node ./bin/www'

#stop:
#	@echo "stopping Nginx"
#	ssh -i $(PRIVATEKEY) $(USER)@$(REMOTE) 'sudo $(ngx_bin) -c $(ngx_conf_dir)$(NGXCONF) -s stop'

pull:
	rsync --update $(rsyncflags) $(USER)@$(REMOTE):$(REMOTEDIR)/ .

push:
	rsync $(rsyncflags) . $(USER)@$(REMOTE):$(REMOTEDIR)/

sync: pull push

#deploy: push
#	ssh -i $(PRIVATEKEY) $(USER)@$(REMOTE) 'cd $(REMOTE) && make debug'

watch:
	watchman watch $(shell pwd)
	watchman -- trigger $(shell pwd) remake *.conf *.lua -- make start

.PHONY: watch deploy start stop push pull sync
