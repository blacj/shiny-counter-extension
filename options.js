var enabled, target, count, key, increment, animate, sprite, minus_btn, minus_key; // Form fields

document.addEventListener('DOMContentLoaded', function() {
    // Initialize fields for getting / setting values
    enabled = document.getElementById('enabled-input');
    target = document.getElementById('target');
    count = document.getElementById('count');
    key = document.getElementById('shortcut');
    increment = document.getElementById('increment');
    animate = document.getElementById('animate-icon');
    sprite = document.getElementById('show-sprite');
    minus_btn = document.getElementById('minus_btn');
    minus_key = document.getElementById('minus_key');

    // Set fields to saved settings
    restore_options();

    // Keyboard Shortcut Field: display key value as input only.
    key.onkeydown = function(e) {
        key.value = e.key;
        return false;
    };

    // Ensure count > 0 && increment > 1
    var enforceFieldMin = function(e) { 
        e.target.value = Math.max(e.target.value, e.target.min);
    }
    increment.onchange = enforceFieldMin;
    count.onchange = enforceFieldMin;

    // Decrement Shortcut blurb: Specify Cmd for Mac OS and Ctrl for other OS
    var decrementKey = (navigator.appVersion.indexOf("Mac")!=-1) ? "Cmd" : "Ctrl";
    for(var i in document.getElementsByClassName("decrement-key")) { 
        document.getElementsByClassName('decrement-key')[i].textContent = decrementKey;
    }

    // Add listeners for buttons
    document.getElementById('reset').addEventListener('click', reset_count);
    document.getElementById('save').addEventListener('click', save_options);
    document.getElementById('cancel').addEventListener('click', restore_options);
});

// Save New Settings
function save_options() { 
    // Settings are modified in background.js only to limit 
    // storage requests and duplicate data in each script
    chrome.runtime.sendMessage({ 
        type: "saveSettings", 
        settings: { 
            enabled: enabled.checked,
            target: target.value,
            count: parseInt(count.value),
            key: key.value,
            increment: parseInt(increment.value),
            animate: animate.checked,
            sprite: sprite.checked,
            minus_key: minus_key.checked,
            minus_btn: minus_btn.checked
        } 
    });

    // Show confirmation that settings were saved - TODO SHOULD BE CALLBACK.... 
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
        status.textContent = '';
    }, 1000);
}

// Get Current Settings
function restore_options() {
    chrome.runtime.sendMessage({ 
        type: "getSettings", 
    }, function(response) {
        var items = response.settings;
        enabled.checked = items.enabled;
        target.value = items.target;
        count.value = items.count;
        key.value = items.key;
        increment.value = items.increment;
        animate.checked = items.animate;
        sprite.checked = items.sprite;
        minus_key.checked = items.minus_key;
        minus_btn.checked = items.minus_btn;
    });
}

// Set Count field to 0
function reset_count() {
    count.value = 0;
}
