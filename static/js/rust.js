"use strict";

// Fix back button cache problem
window.onunload = function () { };

// Global variable, shared between modules
function playpen_text(playpen) {
    let code_block = playpen.querySelector("code");

    if (window.ace && code_block.classList.contains("editable")) {
        let editor = window.ace.edit(code_block);
        return editor.getValue();
    } else {
        return code_block.textContent;
    }
}

(function codeSnippets() {
    // Hide Rust code lines prepended with a specific character
    var hiding_character = "#";
    var request = fetch("https://play.rust-lang.org/meta/crates", {
        headers: {
            'Content-Type': "application/json",
        },
        method: 'POST',
        mode: 'cors',
    });

    function handle_crate_list_update(playpen_block, playground_crates) {
        // update the play buttons after receiving the response
        update_play_button(playpen_block, playground_crates);

        // and install on change listener to dynamically update ACE editors
        if (window.ace) {
            let code_block = playpen_block.querySelector("code");
            if (code_block.classList.contains("editable")) {
                let editor = window.ace.edit(code_block);
                editor.addEventListener("change", function (e) {
                    update_play_button(playpen_block, playground_crates);
                });
            }
        }
    }

    // updates the visibility of play button based on `no_run` class and
    // used crates vs ones available on http://play.rust-lang.org
    function update_play_button(pre_block, playground_crates) {
        var play_button = pre_block.querySelector(".play-button");

        // skip if code is `no_run`
        if (pre_block.querySelector('code').classList.contains("no_run")) {
            play_button.classList.add("hidden");
            return;
        }

        // get list of `extern crate`'s from snippet
        var txt = playpen_text(pre_block);
        var re = /extern\s+crate\s+([a-zA-Z_0-9]+)\s*;/g;
        var snippet_crates = [];
        var item;
        while (item = re.exec(txt)) {
            snippet_crates.push(item[1]);
        }

        // check if all used crates are available on play.rust-lang.org
        var all_available = snippet_crates.every(function (elem) {
            return playground_crates.indexOf(elem) > -1;
        });

        if (all_available) {
            play_button.classList.remove("hidden");
        } else {
            play_button.classList.add("hidden");
        }
    }

    function run_rust_code(code_block) {
        var result_block = code_block.querySelector(".result");
        if (!result_block) {
            result_block = document.createElement('code');
            result_block.className = 'result hljs language-bash';

            code_block.append(result_block);
        }

        let text = playpen_text(code_block);

        var params = {
            channel: "stable",
            mode: "debug",
            crateType: "bin",
            tests: false,
            code: text,
        }

        if (text.indexOf("#![feature") !== -1) {
            params.channel = "nightly";
        }

        result_block.innerText = "Running...";

        var request = fetch("https://play.rust-lang.org/execute", {
            headers: {
                'Content-Type': "application/json",
            },
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(params)
        });

        request
            .then(function (response) { return response.json(); })
            .then(function (response) { result_block.innerText = response.success ? response.stdout : response.stderr; })
            .catch(function (error) { result_block.innerText = "Playground communication" + error.message; });
    }

    // Syntax highlighting Configuration
    hljs.configure({
        tabReplace: '    ', // 4 spaces
        languages: [],      // Languages used for auto-detection
    });

    if (window.ace) {
        // language-rust class needs to be removed for editable
        // blocks or highlightjs will capture events
        Array
            .from(document.querySelectorAll('code.editable'))
            .forEach(function (block) { block.classList.remove('language-rust'); });

        Array
            .from(document.querySelectorAll('code:not(.editable)'))
            .forEach(function (block) { hljs.highlightBlock(block); });
    } else {
        Array
            .from(document.querySelectorAll('pre code'))
            .forEach(function (block) { hljs.highlightBlock(block); });
    }

    // Adding the hljs class gives code blocks the color css
    // even if highlighting doesn't apply
    Array
        .from(document.querySelectorAll('pre code'))
        .forEach(function (block) { block.classList.add('hljs'); });

    Array.from(document.querySelectorAll("code.language-rust")).forEach(function (block) {

        var code_block = block;
        var pre_block = block.parentNode;
        // hide lines
        var lines = code_block.innerHTML.split("\n");
        var first_non_hidden_line = false;
        var lines_hidden = false;

        for (var n = 0; n < lines.length; n++) {
            if (lines[n].trim()[0] == hiding_character) {
                if (first_non_hidden_line) {
                    lines[n] = "<span class=\"hidden\">" + "\n" + lines[n].replace(/(\s*)# ?/, "$1") + "</span>";
                }
                else {
                    lines[n] = "<span class=\"hidden\">" + lines[n].replace(/(\s*)# ?/, "$1") + "\n" + "</span>";
                }
                lines_hidden = true;
            }
            else if (first_non_hidden_line) {
                lines[n] = "\n" + lines[n];
            }
            else {
                first_non_hidden_line = true;
            }
        }
        code_block.innerHTML = lines.join("");

        // If no lines were hidden, return
        if (!lines_hidden) { return; }

        var buttons = document.createElement('div');
        buttons.className = 'buttons';
        buttons.innerHTML = "<button class=\"fa fa-expand\" title=\"Show hidden lines\" aria-label=\"Show hidden lines\"></button>";

        // add expand button
        pre_block.insertBefore(buttons, pre_block.firstChild);

        pre_block.querySelector('.buttons').addEventListener('click', function (e) {
            if (e.target.classList.contains('fa-expand')) {
                var lines = pre_block.querySelectorAll('span.hidden');

                e.target.classList.remove('fa-expand');
                e.target.classList.add('fa-compress');
                e.target.title = 'Hide lines';
                e.target.setAttribute('aria-label', e.target.title);

                Array.from(lines).forEach(function (line) {
                    line.classList.remove('hidden');
                    line.classList.add('unhidden');
                });
            } else if (e.target.classList.contains('fa-compress')) {
                var lines = pre_block.querySelectorAll('span.unhidden');

                e.target.classList.remove('fa-compress');
                e.target.classList.add('fa-expand');
                e.target.title = 'Show hidden lines';
                e.target.setAttribute('aria-label', e.target.title);

                Array.from(lines).forEach(function (line) {
                    line.classList.remove('unhidden');
                    line.classList.add('hidden');
                });
            }
        });
    });

    Array.from(document.querySelectorAll('pre code')).forEach(function (block) {
        var pre_block = block.parentNode;
        if (!pre_block.classList.contains('playpen')) {
            var buttons = pre_block.querySelector(".buttons");
            if (!buttons) {
                buttons = document.createElement('div');
                buttons.className = 'buttons';
                pre_block.insertBefore(buttons, pre_block.firstChild);
            }
        }
    });

    // Process playpen code blocks
    Array.from(document.querySelectorAll(".playpen")).forEach(function (pre_block) {
        // Add play button
        var buttons = pre_block.querySelector(".buttons");
        if (!buttons) {
            buttons = document.createElement('div');
            buttons.className = 'buttons';
            pre_block.insertBefore(buttons, pre_block.firstChild);
        }

        var runCodeButton = document.createElement('button');
        runCodeButton.className = 'fa fa-play play-button';
        runCodeButton.hidden = true;
        runCodeButton.title = 'Run this code';
        runCodeButton.setAttribute('aria-label', runCodeButton.title);

        buttons.insertBefore(runCodeButton, buttons.firstChild);

        runCodeButton.addEventListener('click', function (e) {
            run_rust_code(pre_block);
        });

        let code_block = pre_block.querySelector("code");
        if (window.ace && code_block.classList.contains("editable")) {
            var undoChangesButton = document.createElement('button');
            undoChangesButton.className = 'fa fa-history reset-button';
            undoChangesButton.title = 'Undo changes';
            undoChangesButton.setAttribute('aria-label', undoChangesButton.title);

            buttons.insertBefore(undoChangesButton, buttons.firstChild);

            undoChangesButton.addEventListener('click', function () {
                let editor = window.ace.edit(code_block);
                editor.setValue(editor.originalCode);
                editor.clearSelection();
            });
        }
    });

    request
        .then(function (response) { return response.json(); })
        .then(function (response) {
            // get list of crates available in the rust playground
            let playground_crates = response.crates.map(function (item) { return item["id"]; });
            Array.from(document.querySelectorAll(".playpen")).forEach(function (block) {
                handle_crate_list_update(block, playground_crates);
            });
        });

})();