import * as alt from "alt-client";
import * as native from "natives";

let buffer = [];
let loaded = false;
let open = false;
let enabled = true;

const view = new alt.WebView("http://resource/client/webview/chat/index.html");

function addMessage(name, text) {
    if (name) {
        view.emit("addMessage", name, text);
    } else {
        view.emit("addString", text);
    }
}

view.on("chatloaded", () => {
    for (const msg of buffer) {
        addMessage(msg.name, msg.text);
    }
    loaded = true;
});

view.on("chatmessage", (text) => {
    alt.emitServer("chat:message", text);
    open = false;
    alt.toggleGameControls(true);
    view.unfocus();
});

export function pushMessage(name, text) {
    if (!loaded) {
        buffer.push({ name, text });
    } else {
        addMessage(name, text);
    }
}

export function pushLine(text) {
    pushMessage(null, text);
}

alt.onServer("chat:message", pushMessage);

function closeChat() {
    open = false;
    view.emit("closeChat");
    alt.toggleGameControls(true);
    view.unfocus();
}

alt.on("keyup", (key) => {
    if (loaded && enabled) {
        if (!open && key === 0x54 && alt.gameControlsEnabled()) {
            open = true;
            view.emit("openChat", false);
            alt.toggleGameControls(false);
            view.focus();
        } else if (!open && key === 0xbf && alt.gameControlsEnabled()) {
            open = true;
            view.emit("openChat", true);
            alt.toggleGameControls(false);
            view.focus();
        } else if (open && key == 0x1b) {
            closeChat();
        }
    }
});

export function isOpen() {
    return open;
}

/**
 * @param {boolean} state
 */
export function enable(state) {
    enabled = !!state;
}

export function isEnabled() {
    return enabled;
}
