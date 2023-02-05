import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/apps/armory/index.html", false);
webview.isVisible = false;

webview.on("giveAll", () => alt.emitServer("player:giveAllWeapons"));
webview.on("removeAll", () => alt.emitServer("player:removeWeapons"));
webview.on("giveWeapon", (hash, amount, equipNow) => {
    alt.emitServer("player:giveWeapon", hash, amount, equipNow);
});

alt.on("playerManager:armory", open);
alt.on("menuOpen", close);

function keyHandler(key) {
    if (key == 27) close();
}

function open() {
    if (webview.isVisible) return;
    alt.on("keyup", keyHandler);
    webview.toogle(true);
    toogleControls(false);
}

function close() {
    if (!webview.isVisible) return;
    alt.off("keyup", keyHandler);
    webview.toogle(false);
    toogleControls(true);
}

async function toogleControls(state) {
    if (!player.vehicle) alt.toggleGameControls(state);
    else {
        webview.toogleChat(state);
        webview.toogleOnlyVehMove(state);
    }
}