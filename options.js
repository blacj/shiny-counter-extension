var enabled, target, count, key, increment, animate, sprite, minus_btn, minus_key; // Form fields

document.addEventListener('DOMContentLoaded', function() {
    // Initialize fields for getting / setting values
    enabled = document.getElementById('enabled-input');
    targets = document.getElementById('targets');
    animate = document.getElementById('animate-icon');
    sprite = document.getElementById('show-sprite');
    minus_btn = document.getElementById('minus_btn');
    minus_key = document.getElementById('minus_key');

    // Set fields to saved settings
    restore_options();

    // Keyboard Shortcut Field: display key value as input only.
    /*key.onkeydown = function(e) {
        key.value = e.key;
        return false;
    };*/

    // Ensure count > 0 && increment > 1
    /*var enforceFieldMin = function(e) { 
        e.target.value = Math.max(e.target.value, e.target.min);
    }
    increment.onchange = enforceFieldMin;
    count.onchange = enforceFieldMin;*/

    // Decrement Shortcut blurb: Specify Cmd for Mac OS and Ctrl for other OS
    var decrementKey = (navigator.appVersion.indexOf("Mac")!=-1) ? "Cmd" : "Ctrl";
    for (var i in document.getElementsByClassName("decrement-key")) { 
        document.getElementsByClassName('decrement-key')[i].textContent = decrementKey;
    }

    // Add listeners for buttons
    /* document.getElementById('reset').addEventListener('click', reset_count); todo rmeove ?*/
    document.getElementById('save').addEventListener('click', save_options);
    document.getElementById('cancel').addEventListener('click', restore_options);

    document.getElementById('add-target-btn').addEventListener('click', add_target);
});


// Save New Settings
function save_options() { 
    // Settings are modified in background.js only to limit 
    // storage requests and duplicate data in each script
    var targets = [];

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
        animate.checked = items.animate;
        sprite.checked = items.sprite;
        minus_key.checked = items.minus_key;
        minus_btn.checked = items.minus_btn;

        for (var i in items.targets) {
            var target = items.targets[i];
            var row = targets.insertRow();
            
            row.insertCell(0).innerHTML = target.name;
            row.insertCell(1).innerHTML = target.count;
            row.insertCell(2).innerHTML = target.key;
            row.insertCell(3).innerHTML = target.increment;
            row.insertCell(4).innerHTML = 'a'; // edit
            row.insertCell(5).innerHTML = 'd'; // delete
        }
    });
}

// add new row for new counter
function add_target() {
    var row = targets.insertRow();
    row.id = "new-target";

    inputName = document.createElement('input');
    inputCount = document.createElement('input');
    inputKey = document.createElement('input');
    inputIncr = document.createElement('input');

    inputName.type = 'text';
    inputCount.type = 'number';
    inputKey.type = 'text';
    inputKey.className = 'shortcut-key';
    inputIncr.type = 'number';

    row.insertCell(0).appendChild(inputName);
    row.insertCell(1).appendChild(inputCount);
    row.insertCell(2).appendChild(inputKey);
    row.insertCell(3).appendChild(inputIncr);
    var confirmTarget = row.insertCell(4);
    var cancelTarget = row.insertCell(5);

    confirmTarget.innerHTML = 'a'; // confirm
    cancelTarget.innerHTML = 'd'; // delete

    console.log(confirmTarget)

    confirmTarget.addEventListener("click", confirmNewTarget);
    cancelTarget.addEventListener("click", deleteNewTarget);

    disableFormButtons();
}

// accept input fields for new target, add to target table
function confirmNewTarget() {
    var row = document.getElementById('new-target');
    console.log(row)
    enableFormButtons();
}

// remove input fields for new target
function deleteNewTarget() {
    var row = document.getElementById('new-target');
    row.parentNode.removeChild(row);
    enableFormButtons();
}

// Set Count field to 0
/*function reset_count() {
    count.value = 0;
}*/

function disableFormButtons() {
    document.getElementById('save').disabled = true;
    document.getElementById('cancel').disabled = true;
    document.getElementById('add-target-btn').visible = false;
}

function enableFormButtons() {
    document.getElementById('save').disabled = false;
    document.getElementById('cancel').disabled = false;
    /* todo check if max reached before showing */
    document.getElementById('add-target-btn').visible = true;
}
