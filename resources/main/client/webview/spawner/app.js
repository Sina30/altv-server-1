import vehicles from "./data/vehicles.json" assert { type: "json" };
import vehiclesMod from "./data/vehiclesMod.json" assert { type: "json" };

let htmlClassList = document.getElementById("classList");
const vehDivTemplate = document.getElementById("template").querySelector(".vehicle");
const defaultImage = "./imgs/_notfound.webp";

if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

function vehicleDiv(veh) {
    const div = vehDivTemplate.cloneNode(true);
    const img = div.querySelector("img");
    const path = veh.Class === "MOD" ? "mod/" : "";
    img.src += `${path}${veh.Name}.webp`;
    img.id = veh.Name;
    div.querySelector("strong").innerHTML = veh.DisplayName;
    div.id = veh.DisplayName.toLowerCase();
    return div;
}

//  createAll vehicle div
vehicles.concat(vehiclesMod).forEach((veh) => {
    document.getElementById(veh.Class).appendChild(vehicleDiv(veh));
});

//  blockSpaceScrollEvent
window.addEventListener("keydown", (key) => {
    if (key.code === "Space") key.preventDefault();
});

const searchInput = document.querySelector("input");
const htmlSearch = document.getElementById("searchList");
let searchVehDiv;

//  SearchInputEvent
searchInput.oninput = function () {
    htmlClassList.setAttribute("notInSelection", !!this.value);
    htmlSearch.setAttribute("notInSelection", !this.value);
    if (!this.value) return;
    const searchValue = this.value.toLowerCase();
    searchVehDiv.forEach((htmlVeh) => htmlVeh.setAttribute("notInSelection", !htmlVeh.id.includes(searchValue)));
};

//  initSearchList
for (const vehDiv of document.querySelectorAll(".vehicle")) htmlSearch.append(vehDiv.cloneNode(true));
searchVehDiv = Array.from(htmlSearch.children);

//  addButtonListeners
const spawnButtons = document.getElementsByClassName("button");
for (const but of spawnButtons) {
    but.onerror = () => (but.src = defaultImage);
    but.onclick = () => {
        alt.emit("spawnVehicle", but.id);
    };
}

const garageSwitch = document.getElementById("garageSwitch");
const garageDiv = document.getElementById("garageList");
garageSwitch.onclick = () => {
    const garage = garageDiv.getAttribute("notInSelection") == "true";
    garageSwitch.innerHTML = garage ? "Nouveau" : "Garage";
    garageDiv.setAttribute("notInSelection", !garage);
    htmlClassList.setAttribute("notInSelection", garage);
    htmlSearch.setAttribute("notInSelection", garage);
};

let garageList;
alt.on("garageList", (res) => {
    if (garageList === res) return;
    for (const img of garageDiv.querySelectorAll("img")) img.onclick = null;
    garageDiv.innerHTML = "";
    garageList = res;
    garageList.forEach((veh) => {
        const div = vehDivTemplate.cloneNode(true);
        const img = div.querySelector("img");
        img.src += `${veh.model}.webp`;
        img.onerror = () => (img.src = defaultImage);
        // img.src += `${path}${veh.model}.webp`;
        img.id = veh.id;
        // div.querySelector("strong").innerHTML = veh.DisplayName;
        img.onclick = () => alt.emit("spawnSavedVehicle", img.id);
        div.querySelector("strong").innerHTML = `[${veh.id}] ${veh.model}`;
        div.id = veh.model;
        garageDiv.append(div);
    });
});