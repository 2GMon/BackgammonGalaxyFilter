(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    let length = "";
    let clock  = "";

    function setCondition(l, c) {
        length = l;
        clock  = c;
    }

    function getCondition() {
        return {
            length: length,
            clock: clock
        };
    }

    function isLengthMatching(innerHTML) {
        if (!length || innerHTML == length) return true;
        else return false;
    }

    function isClockMatching(innerHTML) {
        if (!clock || innerHTML == clock) return true;
        else return false;
    }

    function filter() {
        let games = document.querySelectorAll("tbody tr");
        games.forEach((game) => {
            let cols = game.querySelectorAll("td");
            let length = cols[4].innerHTML;
            let clock = cols[5].innerHTML;
            if (isLengthMatching(length) && isClockMatching(clock)) {
                game.style.display = "";
            } else {
                game.style.display = "none";
            }
        });
    }

    /**
     * Call filter() every 100ms
     */
    setInterval(filter, 100);

    /**
     * Listen for messages from the background script.
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "setCondition") {
            setCondition(message.length, message.clock);
        } else if (message.command === "getCondition") {
            return Promise.resolve(getCondition());
        }
    });
})();
