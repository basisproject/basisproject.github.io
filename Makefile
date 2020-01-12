.PHONY: all clean

all: build

build:
	bundle exec jekyll build

clean:
	rm -rf _site

