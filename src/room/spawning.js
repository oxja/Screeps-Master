let creepLogic = require("../creeps/index");
let creepTypes = _.keys(creepLogic);

// Method to spawn creeps if necessary
function spawnCreeps(room) {

    const maxCreepEnergy = room.energyAvailable;

    // Iterates through creep logic, returns first that returns true for .spawn()
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room, maxCreepEnergy);
    });

    // Finds available spawn
    roomSpawns = room.find(FIND_MY_SPAWNS);
    for(let spawn of roomSpawns) {
        if(!spawn.spawning) {
            // Gets the data for spawning a new creep of creepTypeNeeded
            let creepSpawnData = creepLogic[creepTypeNeeded] && creepLogic[creepTypeNeeded].spawnData(room, spawn, room.FindRoomInMemory(), maxCreepEnergy);
            
            if(creepSpawnData) {
                if(creepSpawnData.extendBody) {
                    spawn.spawnCreep(ExtendBody(creepSpawnData.body, room, maxCreepEnergy), creepSpawnData.name, {memory: creepSpawnData.memory}); // Body returned by creepSpawnData.body is just ratio
                } else {
                    spawn.spawnCreep(creepSpawnData.body, creepSpawnData.name, {memory: creepSpawnData.memory}); // Body returned by creepSpawnData.body is body to be spawned
                }
            }
        }
    }
    
    
}

// Extends body part ratio as much as possible within the possible energy in the room
function ExtendBody(body, room, maxCreepEnergy) {
    var total = 0;
    for(var i = 0; i < body.length; i++) {
        total += BodyPartToEnergyCost(body[i]);
    }
    const numPartCol = Math.floor(maxCreepEnergy / total);

    var fullBodyPartList = [];

    for(var i = 0; i < numPartCol; i++) {
        for(var j = 0; j < body.length; j++) {
            fullBodyPartList.push(body[j]);
        }
    }
    return fullBodyPartList;
}

// Converts string body part to its respective value in energy to spawn
function BodyPartToEnergyCost(bodyPart) {
    if(bodyPart == "move") {
        return 50;
    }
    if(bodyPart == "work") {
        return 100;
    }
    if(bodyPart == "carry") {
        return 50;
    }
    if(bodyPart == "attack") {
        return 80;
    }
    if(bodyPart == "ranged_attack") {
        return 150;
    }
    if(bodyPart == "heal") {
        return 250;
    }
    if(bodyPart == "tough") {
        return 10;
    }
    if(bodyPart == "claim") {
        return 600;
    }   
    return -1;
}

module.exports = spawnCreeps;