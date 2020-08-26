function listenForSelector() {
    const lengthFilter = document.querySelector("#length-filter-selector");
    const clockFilter = document.querySelector("#clock-filter-selector");

    /*
     * Get current conditions and set a value of selector
     * whenever page_action is opend.
     */
    browser.tabs.query({active: true, currentWindow: true})
        .then((tabs) => {
            browser.tabs
                .sendMessage(tabs[0].id, { command: "getCondition" })
                .then(response => {
                    lengthFilter.value = response.length;
                    clockFilter.value = response.clock;
                });
        })
        .catch((error) => {
            console.log(`Could not get condition: ${error}`);
        });

    function setCondition(condition) {
        browser.tabs.query({active: true, currentWindow: true})
            .then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "setCondition",
                    ...condition
                });
            })
            .catch((error) => {
                console.log(`Could not set filter conditions: ${error}`);
            });
    }

    /*
     * Call setCondition() whenever length value is changed.
     */
    lengthFilter.addEventListener('change', (e) => {
        let length = e.target.value;
        let clock = clockFilter.value;

        setCondition({
            length: length,
            clock: clock
        });
    });

    /*
     * Call setCondition() whenever clock value is changed.
     */
    clockFilter.addEventListener('change', (e) => {
        let length = lengthFilter.value;
        let clock = e.target.value;

        setCondition({
            length: length,
            clock: clock
        });
    });
}

function reportExecuteScriptError(error) {
    console.error(`Failed to execute filter content script: ${error.message}`);
}

browser.tabs.executeScript({file: "/content_scripts/filter.js"})
    .then(listenForSelector)
    .catch(reportExecuteScriptError);
