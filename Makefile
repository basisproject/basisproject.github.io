.PHONY: all clean

DEST ?= public

all: build

build:
	bundle exec jekyll build -d $(DEST)

deploy: all

clean:
	rm -rf $(DEST)

