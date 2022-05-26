.PHONY: all publish paper clean watch

SRC := www
BUILD := docs

allwww := $(shell find $(SRC) -type f)
allsrc := main.js $(shell find plugins/)
papersrc := $(shell find ../paper/src/ -type f)

all: $(BUILD)/index.html $(BUILD)/CNAME

$(BUILD)/index.html: $(allsrc) $(allwww) tailwind.config.js postcss.config.js $(SRC)/paper.html
	SRC=$(SRC) DEST=$(BUILD) URL='https://basisproject.net' node main
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

$(BUILD)/CNAME:
	cp CNAME $@

paper: $(SRC)/paper.html all

clean:
	rm -rf $(BUILD)

watch: paper
	while true; do inotifywait -qr -e close_write *.js www/ plugins/ ../paper/src; make paper; done

publish:
	@echo "Remember to commit your changes to master for publishing to work!"
	@sleep 5
	git checkout publish
	git merge master
	make clean all
	git add .
	git commit -m "build"
	git push
	git checkout -

