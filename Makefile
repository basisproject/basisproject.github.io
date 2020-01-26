.PHONY: all build paper clean

export SHELL := /bin/bash

DEST ?= public
PAPERFILES = $(shell find ../paper/src)

all: build

build:
	bundle exec jekyll build -d $(DEST)

../paper/converted/basis.html: $(PAPERFILES)
	cd ../paper && make html

paper.html: ../paper/converted/basis.html
	@echo "---" > $@
	@echo "layout: 'default'" >> $@
	@echo "permalink: '/paper'" >> $@
	@echo "title: 'Basis Paper'" >> $@
	@echo "---" >> $@
	cat $^ | sed '0,/<body>/d' | grep -v -P '</(body|html)>' >> $@

paper: paper.html all

deploy: all

clean:
	rm -rf $(DEST)
	rm -f paper.html

