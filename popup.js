var toggle, enabled, img, target, count, key; // Fields

document.addEventListener('DOMContentLoaded', function() {
    // Initialize fields for getting / setting values
    toggle = document.getElementById("enabled-slider");
    enabled = document.getElementById('enabled-input');
    img = document.getElementById("sprite");
    target = document.getElementById("target");
    count = document.getElementById("count");
    key = document.getElementById("key");

    // Add handler to remove sprites that don't exist
    document.getElementById('sprite').addEventListener("error", function() {
        document.getElementById('sprite').src = "";
    })

    chrome.runtime.sendMessage({ 
        type: "getSettings", 
    }, function(response) {
        // Set field values
        var items = response.settings;
        target.textContent = items.target;
        count.textContent = items.count;
        key.textContent = items.key;

        if (items.sprite) { // Get pokemon sprite
            img.src = "https://raw.githubusercontent.com/msikma/pokesprite/master/icons/pokemon/shiny/"+items.target.toLowerCase()+".png";
        }
        if (items.minus_btn) { // Show decrement button
            document.getElementById("minus").className = "";
        }

        // Supress toggle animation for initial value setting
        toggle.className = toggle.className + " no-transition";
        enabled.checked = items.enabled;
        setTimeout( function() {
            toggle.className = toggle.className.replace(/\bno-transition\b/, " ").trim();
        }, 400)

        // Disable or enable view
        enableChanged(items.enabled);
    });

    // On settings button click, open options.html
    document.getElementById('settings-btn').addEventListener("click", function() {
        var win = window.open("chrome-extension://"+chrome.i18n.getMessage("@@extension_id")+"/options.html", "_blank")
        win.focus();
    });

    // On minus button click, send decrement message to background.js
    document.getElementById('minus').addEventListener("click", function() {
        chrome.runtime.sendMessage({ 
            type: "decrementCount"
        }, function(response) {
            if (response && response.count !== undefined) {
                // Update count field 
                count.textContent = response.count;
            }
        });
    });

    // On keydown, send keypress message to background.js
    document.addEventListener('keydown', function(e) {
        chrome.runtime.sendMessage({ 
            type: "keyPress", 
            args: { 
                key: e.key,
                meta: e.metaKey,
                ctrl: e.ctrlKey
            } 
        }, function(response) {
            if (response && response.count !== undefined) {
                // Update count field 
                count.textContent = response.count;
            }
        });
        
    });

    // On Enabled toggle click, save setting to disable
    document.getElementById('enabled-input').addEventListener("change", function() {
        chrome.runtime.sendMessage({ 
            type: "saveSettings", 
            settings: { 
                enabled: enabled.checked
            } 
        }, function(response) {
            // Disable or enable view
            enableChanged(enabled.checked);
        });
    });
});


function enableChanged(isEnabled) { // Disable or enable view
    document.getElementById('content').className = (isEnabled) ? "" : "is-disabled";
}
