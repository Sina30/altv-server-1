import * as alt from 'alt-server';
import * as chat from "chat"
import * as db from "database"
//import { Tables, Functions } from 'exports';
//let { modList } = Tables


function log (msg) {
    alt.log("~y~" + msg)
}

alt.Vehicle.prototype.init = function (model) {
    this.setMeta("model", model)
    this.setSyncedMeta("kmAge", 0)
    this.manualEngineControl = true
    this.modKit = +(this.modKitsCount > 0)
}


alt.Vehicle.prototype.create = function (model, pos, rot) {
    rot = rot ? rot : new alt.Vector3(0, 0, 0)
    let veh = new alt.Vehicle(model, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z)
    veh.manualEngineControl = true
    veh.modKit = +(veh.modKitsCount > 0)
    return veh
}

alt.Vehicle.prototype.initWithData = function (id, appearance) {
    this.setSyncedMeta("id", id)
    //this.setMeta("appearance", appearance)
    this.setAppearanceDataBase64(appearance)
    //veh.("owner") = owner
    //veh.garage = garage
}


alt.Vehicle.prototype.getAllData = function () {
    let data = {
        id: this.getSyncedMeta("id"),
        model: this.getMeta("model")
    }
    console.log(Object.assign(data, this.getDataToSave()))
    console.log(data);
    return data
}

alt.Vehicle.prototype.getDataToSave = function () {
    const data = {
        pos: JSON.stringify(this.pos.toFixed(2).toArray()),
        rot: JSON.stringify(this.rot.toFixed(2).toArray()),
        //owner: this.owner,
        //appearance: this.getAppearanceDataBase64(),
        //garage: this.garage
    }
    return data
}

alt.Vehicle.prototype.getVehMods = function () {
    let modData = []
    let n = modList.length
    for (let i=0 ; i<n ; i++)
        modData[i] = {mod: this.getMod(i), count: this.getModsCount(i)}
    return modData
}

alt.Vehicle.prototype.setAllMods = function (data) {      // data = [[modType, modNum]]
    data.forEach(([modType, modNum]) => this.setMod(modType, modNum))
}

alt.Vehicle.prototype.setAllWheels = function (data) {
    console.log("data:", data);
    const {wheelType, wheelNum, wheelColor} = data
    this.setWheels(wheelType, wheelNum)
    this.wheelColor = wheelColor
}

alt.Vehicle.prototype.setAllColors = function (data) {
    console.log("data:", data);
    const {primary, secondary, pearl} = data
    this.primaryColor = primary
    this.secondaryColor = secondary
    this.pearlColor = pearl

    //  this.dashboardColor = data.dash
    //  this.interiorColor = data.interiorColor
}

alt.Vehicle.prototype.setAllExtraColors = function (data) {
    const {xenon, window, tireSmoke} = data
    console.log(+(xenon != 0));
    console.log(xenon -2);
    this.setMod(22, +(xenon != 0))
    this.headlightColor = xenon -2
    this.windowTint = window
    //  this.tireSmokeColor = tireSmoke
}

alt.Vehicle.prototype.setAllNeons = function ({color, enabled}) {
    this.neonColor = color
    this.neon = {
        front: enabled,
        back: enabled,
        left: enabled,
        right: enabled
    }
}

alt.Vehicle.prototype.setPlate = function (data) {
    let {plateIndex, plateText} = data
    this.numberPlateIndex = plateIndex
    this.numberPlateText = plateText
}

alt.Vehicle.prototype.toJSON = function (data) {
    Object.keys(data).forEach(function(key) {
        data[key] = JSON.stringify(data[key])
    })
    return data
}

alt.Vehicle.prototype.parseJSON = function (data) {
    Object.keys(data).forEach(function(key) {
        data[key] = JSON.parse(data[key])
    })
    return data
}

alt.Vehicle.prototype.register = function (player) {
    const model = this.getMeta("model")
    if (this.getSyncedMeta("id")) {
        log("Vehicle already registered")
        chat.send(player, `{ff8f00}${model} déjà enregistré`)
        return
    }
    const owner = player.getSyncedMeta("id")
    db.upsertData({ model, owner }, 'Vehicle', res => {
        this.setSyncedMeta("id", res.id)
        this.setMeta("owner", owner)
        this.save()
        this.saveAppearance()
        db.log(`${model} registered in database with id: ${res.id}`)
        chat.send(player, `{00ff00}${model} enregistré`)
    })
}

alt.Vehicle.prototype.delete = function () {
    db.deleteByIds(this.getSyncedMeta("id"), "Vehicle", callback => {
        //  return +(typeof(callback) != "object")
        //  if (!callback)
        //      db.log(`${this.modelName} deleted from database`)
        //  else
        //      alt.logError(`${this.modelName} has not been deleted from database\nCause:\n${callback}`)
    })
}

alt.Vehicle.prototype.save = function () {
    if (!this.getSyncedMeta("id") /*|| this.garage.inGarage*/)     //update only if registered and veh is out garage
        return
    const data = this.getDataToSave()
    db.updatePartialData(this.getSyncedMeta("id"), data, "Vehicle", callback => {
        //  return +(typeof(callback) != "object")
        //  if (typeof(callback) == "object")
        //      db.log(`${this.modelName} saved in database`)
        //  else
        //      alt.logError(`${this.modelName} has not been saved in database\nCause:\n${callback}`)
    })
}

alt.Vehicle.prototype.saveAppearance = function () {
    if (!this.getSyncedMeta("id"))     //update only if registered
        return
    const appearance = this.getAppearanceDataBase64()
    db.updatePartialData(this.getSyncedMeta("id"), { appearance }, "Vehicle", callback => {})
}

