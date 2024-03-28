.PHONY: all paper clean watch

SRC := src
BUILD := dist
URL ?= http://www.basis.loc

allwww := $(shell find $(SRC) -type f)
allsrc := main.js $(shell find plugins/)
papersrc := $(shell find ../paper/src/ -type f)

all: $(BUILD)/index.html

$(BUILD)/index.html: $(allsrc) $(allwww) tailwind.config.js postcss.config.js
	SRC=$(SRC) DEST=$(BUILD) URL=$(URL) node main
	npx postcss $(BUILD)/css/**/*.css --base $(BUILD)/ --dir $(BUILD)/

../paper/converted/basis.html: $(papersrc)
	cd ../paper && make

$(SRC)/paper.html: ../paper/converted/basis.html
	@echo "---" > $@
	@echo "layout: 'page.njk'" >> $@
	@echo "title: 'Basis Paper'" >> $@
	@echo "permalink: 'paper/'" >> $@
	@echo "hide_title: true" >> $@
	@echo "---" >> $@
	cat $^ | sed '0,/<body>/d' | grep -v -P '</(body|html)>' >> $@

paper: $(SRC)/paper.html all

clean:
	rm -rf $(BUILD)

watch: paper
	while true; do inotifywait -qr -e close_write *.js www/ plugins/ ../paper/src; make paper; done

