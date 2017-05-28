var settings;
var is_mac = (navigator.appVersion.indexOf("Mac")!=-1);

// Initialize Storage - Use Defaults
chrome.storage.sync.get({
    target: 'Shiny!',
    count: 0,
    key: 'z',
    increment: 1,
    enabled: true,
    animate: true,
    sprite: false,
    minus_btn: false,
    minus_key: false
}, function(items){
    // Save settings in storage and as global variable
    chrome.storage.sync.set(items);
    settings = items;
});

// Insert listening script into all pages - refresh not required to begin counts
chrome.tabs.query({}, function(tabs){
    for (var i in tabs) {
        chrome.tabs.executeScript(tabs[i].id, {file: "listener.js"});
    }
});

// Listen for any messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
switch(message.type) {
    case "keyPress": 
        sendResponse({ // Return new count value to update popup view
            count: processKeyPress(message.args.key, message.args.meta, message.args.ctrl)
        });
        break;
    case "decrementCount":
        sendResponse({ // Return new count value to update popup view
            count: processKeyPress(settings.key, true, true, true)
        });
        break;
    case "saveSettings":
        saveSettings(message.settings);
        break;
    case "getSettings":
        sendResponse({settings: settings});
        break;
    default:
        console.warn("Unrecognized message type: " + message.type);
        break;
    }
});

var minIcon = 1;
var maxIcon = 12;
var curIcon = minIcon;
function flashIcon(decrement) {
    // icon/icon-add[1-12].png flashes star white
    // icon/icon-sub[1-12].png flashes star red
    var suffix = (decrement) ? "sub" : "add";
    if (curIcon <= maxIcon) {
        var path = "icon/icon-" + suffix + (curIcon++) + ".png";
        chrome.browserAction.setIcon({ path: path });
        window.setTimeout(function(){
            flashIcon(decrement);
        }, 30);
    } else {
        chrome.browserAction.setIcon({path:"icon.png"});
        curIcon = minIcon;
    }
}

function processKeyPress(key, meta, ctrl, forceDecrement) {  
    if (!settings.enabled) return;

    if (settings.key == key) { 
        var decrement = false;

        if (forceDecrement || settings.minus_key && (is_mac && meta || !is_mac && ctrl)) {
            decrement = true;
        }

        var count = Math.max(0, settings.count + settings.increment * (decrement ? -1 : 1));

        chrome.storage.sync.set({"count": count}, function() {
            settings.count = count;
        });

        if (settings.animate) {
            flashIcon(decrement);
        }
        // return new count to update popup.html
        return count;
    }
}

// Save settings in chrome storage
function saveSettings(items) { 
    chrome.storage.sync.set(items);
    for (var i in items) {
        settings[i] = items[i];
    }
}