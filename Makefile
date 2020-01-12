.PHONY: all clean

DEST ?= _site

all: build

build:
	bundle exec jekyll build -d $(DEST)

deploy: override DEST := public
deploy: all


clean:
	rm -rf _site

