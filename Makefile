.PHONY: all publish paper clean watch

SRC := www
BUILD := docs

allwww := $(shell find $(SRC) -type f)
allsrc := main.js $(shell find plugins/)

all: $(BUILD)/index.html $(BUILD)/CNAME

$(BUILD)/index.html: $(allsrc) $(allwww) tailwind.config.js postcss.config.js $(SRC)/paper.html
	SRC=$(SRC) DEST=$(BUILD) URL='http://www.basis.loc' node main
	npx postcss $(BUILD)/css/**/*.css --base $(BUILD)/ --dir $(BUILD)/

$(SRC)/paper.html: ../paper/converted/basis.html
	@echo "---" > $@
	@echo "layout: 'page.njk'" >> $@
	@echo "title: 'Basis Paper'" >> $@
	@echo "permalink: 'paper/'" >> $@
	@echo "hide_title: true" >> $@
	@echo "---" >> $@
	cat $^ | sed '0,/<body>/d' | grep -v -P '</(body|html)>' >> $@

$(BUILD)/CNAME:
	cp CNAME $@

paper: $(SRC)/paper.html all

clean:
	rm -rf $(BUILD)

watch: all
	while true; do inotifywait -qr -e close_write *.js www/ plugins/; make; done

