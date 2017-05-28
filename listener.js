// Content script injected into all pages to listen for key press
// Handler for keypress in background.js
window.addEventListener('keydown', function(e) {
    // Event not triggered when typing into input/textarea
    if (e.target.tagName.toUpperCase() == 'INPUT' || 
        e.target.tagName.toUpperCase() == 'TEXTAREA') {
        return;
    }

    // Send keypress to background.js
    chrome.runtime.sendMessage({ 
        type: "keyPress", 
        args: { 
            key: e.key,
            meta: e.metaKey,
            ctrl: e.ctrlKey
        } 
    });
});
