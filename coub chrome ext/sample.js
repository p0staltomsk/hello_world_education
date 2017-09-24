chrome.runtime.onInstalled.addListener(function() {

    console.log('chrome runtime init');

    chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {   console.log(request, sender, sendResponse);
        chrome.browserAction.setIcon({path:"icon_connect.png"});
    });

/*

    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {

        // With a new rule ...
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // That fires when a page's URL contains a 'coub.com' ...
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { urlContains: 'coub.com' },
                    })
                ],
                // And shows the extension's page action.
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);

    });
*/

});