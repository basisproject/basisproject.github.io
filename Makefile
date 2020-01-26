.PHONY: all build paper clean

export SHELL := /bin/bash

DEST ?= public

all: build

build:
	bundle exec jekyll build -d $(DEST)

paper.html: ../paper/converted/basis.html
	@echo "---" > $@
	@echo "layout: 'default'" >> $@
	@echo "permalink: '/paper'" >> $@
	@echo "---" >> $@
	cat $^ | sed '0,/<body>/d' | grep -v -P '</(body|html)>' >> $@

paper: paper.html

deploy: all

clean:
	rm -rf $(DEST)
	rm -f paper.html

