/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\main.js **********/
__modules[0] = function(module, exports) {
let creepLogic = __require(1,0);
let rumOverseerLogic = __require(2,0);
let roomLogic = __require(3,0);
let prototypes = __require(4,0);


module.exports.loop = function () {
    console.log("-----------------------------");
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    if(Memory.ActiveRooms == undefined) {
        Memory.ActiveRooms = [];
        _.forEach(Game.myRooms, r => roomLogic.memoryInit(r));

    } else {
        _.forEach(Game.myRooms, r => rumOverseerLogic.OverseeRoom(r));
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];

            let role = creep.memory.role;
            if (creepLogic[role]) {
                creepLogic[role].run(creep);
            }
        }
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }


}
return module.exports;
}
/********** End of module 0: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\main.js **********/
/********** Start module 1: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
    harvester:     __require(5,1),
    miner:         __require(6,1),
    transfer:      __require(7,1),
    worker:        __require(8,1),
    explorer:      __require(9,1)
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 1: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\index.js **********/
/********** Start module 2: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\overminds\index.js **********/
__modules[2] = function(module, exports) {
let overmindLogic = {
    OverseeRoom:    __require(10,2),
}

module.exports = overmindLogic;
return module.exports;
}
/********** End of module 2: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\overminds\index.js **********/
/********** Start module 3: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\index.js **********/
__modules[3] = function(module, exports) {
let roomLogic = {
    spawning:        __require(11,3),
    creepAlloc:      __require(12,3),
    building:        __require(13,3),
    memoryInit:      __require(14,3),
    defcon:          __require(15,3),
    expansion:       __require(16,3),
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 3: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\index.js **********/
/********** Start module 4: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\prototypes\index.js **********/
__modules[4] = function(module, exports) {
let files = {
    creep:           __require(17,4),
    roomPosition:    __require(18,4),
    room:            __require(19,4),
}
return module.exports;
}
/********** End of module 4: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\prototypes\index.js **********/
/********** Start module 5: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\harvester.js **********/
__modules[5] = function(module, exports) {
var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const numMinInRoom = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == "miner").length;
        const numTransfInRoom = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == "transfer").length;
        if(numMinInRoom == 1 && numTransfInRoom == 1 && !creep.memory.deathTimer) {
            creep.memory.deathTimer = 50;
        }
        if(creep.memory.deathTimer) { 
            if(creep.memory.deathTimer > 0) {
                creep.memory.deathTimer--;
            } 
        }
        if(creep.store.getFreeCapacity() > 0) {
            if(creep.memory.deathTimer == 0) {
                creep.suicide();
            }

            const source = Game.getObjectById(creep.memory.defaultSource);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
            if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    },
    spawn: function(room, maxCreepEnergy) {
        if(maxCreepEnergy < 200) {
            return false;
        }

        const numCreepsInRoom = _.filter(Game.creeps, (creep) => creep.room.name == room.name).length;
        if (numCreepsInRoom == 0 && maxCreepEnergy >= 200) {
            return true;
        }
    },
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {
        const closestSourceId = Memory.ActiveRooms[roomIndex].closestSource.id;

        let name = 'Harvester' + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: 'harvester', defaultRoom: room.name, defaultSource: closestSourceId};
        let extendBody = false;
        
        return {name, body, memory, extendBody};
    }
};

module.exports = harvester;
return module.exports;
}
/********** End of module 5: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\harvester.js **********/
/********** Start module 6: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\miner.js **********/
__modules[6] = function(module, exports) {
var miner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.job == "defaultMine") {
            const source = Game.getObjectById(creep.memory.defaultSource);

            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                 creep.moveTo(source);
            }
        } else if(creep.memory.job == "moveInsideBunker") { // Hostile creeps in room
            const roomIndexInMemory = Game.rooms[creep.memory.defaultRoom].FindRoomInMemory();
            const bunkerCenter = new RoomPosition(Memory.ActiveRooms[roomIndexInMemory].buildCenter.x, Memory.ActiveRooms[roomIndexInMemory].buildCenter.y, creep.memory.defaultRoom);
            creep.moveTo(bunkerCenter);
        }
    },
    spawn: function(room, maxCreepEnergy) {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);

        if (miners < 1 && maxCreepEnergy >= 150) {
            return true;
        }
    },
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {
        const closestSourceId = Memory.ActiveRooms[roomIndex].closestSource.id;

        let name = 'Miner' + Game.time;
        let body = CreateMinerBody(maxCreepEnergy);
        let memory = {role: 'miner', defaultRoom: room.name, defaultSource: closestSourceId};
        let extendBody = false;
        
        return {name, body, memory, extendBody};
    }
};
function CreateMinerBody(maxCreepEnergy) {
    const numWorkParts = Math.floor((maxCreepEnergy - 50) / 100);

    var minerBody = [];

    minerBody.push(MOVE);
    for(var i = 0; i < numWorkParts; i++) {
        minerBody.push(WORK);
    }

    return minerBody;
}   

module.exports = miner;
return module.exports;
}
/********** End of module 6: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\miner.js **********/
/********** Start module 7: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\transfer.js **********/
__modules[7] = function(module, exports) {
// Note - currently not being used, going to be refactored

var transfer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const roomExtension = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
        const spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
        const tower = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 100});
        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE});

        if(creep.memory.job == "defaultTransfer") {
            if(roomExtension || spawn || tower) {
                if(creep.store[RESOURCE_ENERGY] == 0) {
                    if(storage) {
                        if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    } else {
                        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (d) => { return (d.resourceType == RESOURCE_ENERGY)}});
                        if(droppedEnergy) {
                            if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(droppedEnergy);
                            }
                        }
                    }
                } else {
                    if(roomExtension) {
                        if(creep.transfer(roomExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(roomExtension);
                        }
                    } else if(tower){
                        if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(tower);
                        }
                    } else if(spawn){
                        if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(spawn);
                        }
                    }
                }
            } else { // Otherwise transport energy from "miner" to storage
                if(creep.memory.collectingEnergy) {
                    if(creep.store.getFreeCapacity() == 0) {
                        creep.memory.collectingEnergy = false;
                    } else {
                        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (d) => { return (d.resourceType == RESOURCE_ENERGY)}});
                        if(droppedEnergy) {
                            if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(droppedEnergy);
                            }
                        } else {

                        }
                    }
                } else {
                    if(creep.store[RESOURCE_ENERGY] == 0) {
                        creep.memory.collectingEnergy = true;
                    } else if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
            }
        } else if(creep.memory.job == "hostileTransfer") { // If hostile creeps detected, change priorities
            if(creep.store[RESOURCE_ENERGY] == 0) {
                if(storage) {
                    if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                } 
            } else {
                if(roomExtension) {
                    if(creep.transfer(roomExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(roomExtension);
                    }
                } else if(tower){
                    if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tower);
                    }
                } else if(spawn){
                    if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                } else {
                    creep.moveTo(spawn);
                }
            }
        }            
    },
    spawn: function(room, maxCreepEnergy) {
        if(maxCreepEnergy < 100) {
            return false;
        }
        var transfers = _.filter(Game.creeps, (creep) => creep.memory.role == 'transfer' && creep.room.name == room.name);
        const roomExtensions = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION});
        if(roomExtensions.length > 0) {
            if (transfers.length < 2) {
                return true;
            }
        } else {
            if (transfers.length < 1) {
                return true;
            }
        }
        return false;
    },
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {
        let name = 'Transfer' + Game.time;
        let body = [CARRY, MOVE];
        let memory = {role: 'transfer', defaultRoom: room.name, job: 'defaultTransfer'};
        let extendBody = true;
        
        return {name, body, memory, extendBody};
    }
};

module.exports = transfer;
return module.exports;
}
/********** End of module 7: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\transfer.js **********/
/********** Start module 8: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\worker.js **********/
__modules[8] = function(module, exports) {
// Worker role, designed to be able to complete a wide variety of tasks rather than creating several specialised creeps 

var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.job == 'upgrade' || creep.memory.job == 'build' || creep.memory.job == 'repairRoad' || creep.memory.job == 'repairRampart') {
            if(creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.collectingEnergy = true;
            } 
            if(creep.memory.collectingEnergy) {
                if(creep.store.getFreeCapacity() == 0) {
                    creep.memory.collectingEnergy = false; 
                } else {
                    const source = Game.getObjectById(creep.memory.defaultSource);
    
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            } else {
                if(creep.memory.job == 'upgrade') {
                    if (!creep.pos.inRangeTo(creep.room.controller, 2)) {
                        creep.moveTo(creep.room.controller);
        
                    } else {
                        creep.upgradeController(creep.room.controller);
                    }

                } else if(creep.memory.job == 'build') {
                    const constructionTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(constructionTargets.length) {
                        if (!creep.pos.inRangeTo(constructionTargets[0], 2)) {
                            creep.moveTo(constructionTargets[0]);
            
                        } else {
                            creep.build(constructionTargets[0]);
                        }                    
                    }

                } else if(creep.memory.job == 'repairRoad') {
                    if(creep.memory.repairRoadTargetId == undefined) {
                        const repairRoadTargetId = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * 0.5 && s.structureType == STRUCTURE_ROAD }).id;
                        creep.memory.repairRoadTargetId = repairRoadTargetId;
                    } else {
                        if(Game.getObjectById(creep.memory.repairRoadTargetId).hits == Game.getObjectById(creep.memory.repairRoadTargetId).hitsMax) {
                            creep.memory.repairRoadTargetId = undefined;
                        } else {
                            if (!creep.pos.inRangeTo(Game.getObjectById(creep.memory.repairRoadTargetId), 2)) {
                                creep.moveTo(Game.getObjectById(creep.memory.repairRoadTargetId));
                
                            } else {
                                creep.repair(Game.getObjectById(creep.memory.repairRoadTargetId));
                            } 
                        }                     
                    }
                    
                } else if(creep.memory.job == 'repairRampart') {
                    if(Game.time % 10 === 0) {
                        const ramparts = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
                        for(var i = 0; i < ramparts.length; i++) {
                            if(ramparts[i].hits < Memory.ActiveRooms[creep.room.FindRoomInMemory()].buildCenter.averageRampartHits / 10) {
                                creep.memory.repairRampartTargetId = ramparts[i].id;
                            }
                        }
                    }
                    
                    if(creep.memory.repairRampartTargetId == undefined) {
                        var repairRampartTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * Memory.ActiveRooms[creep.room.FindRoomInMemory()].buildCenter.minRampartThresholdHits && s.structureType == STRUCTURE_RAMPART });
                        if(repairRampartTarget != undefined) {
                            creep.memory.repairRampartTargetId = repairRampartTarget.id;
                        } else {
                            creep.say("idle");
                            creep.memory.job = 'idle'; // Changes creep job so creep can be reassigned jobs
                        }
                    } else {
                        if(Game.getObjectById(creep.memory.repairRampartTargetId).hits >= Game.getObjectById(creep.memory.repairRampartTargetId).hitsMax * Memory.ActiveRooms[creep.room.FindRoomInMemory()].buildCenter.minRampartHits) {
                            creep.memory.repairRampartTargetId = undefined; 
                        } else {
                            if (!creep.pos.inRangeTo(Game.getObjectById(creep.memory.repairRampartTargetId), 2)) {
                                creep.moveTo(Game.getObjectById(creep.memory.repairRampartTargetId));
                
                            } else {
                                creep.repair(Game.getObjectById(creep.memory.repairRampartTargetId));
                            } 
                        }                     
                    }
                }
    
            }
        } else { 
            if(creep.memory.job == 'remoteHarv') {
                const homeRoom = Game.rooms[creep.memory.defaultRoom];
                const roomIndexInMemory = homeRoom.FindRoomInMemory();     
                if(creep.memory.remoteHarvRoom == undefined) {
                    var targetIndex = -1;
                    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms.length; i++) {
                        if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[i].activeRemoteHarv == true) {
                            targetIndex = i;
                            break;
                        }
                    }

                    creep.memory.remoteHarvRoomIndex = targetIndex;
                    creep.memory.remoteHarvRoom = Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[targetIndex].roomName;

                }
                if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHomeRoads == undefined || Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHomeRoads == false) {
                    const exitDir = Game.map.findExit(homeRoom, creep.memory.remoteHarvRoom);
                    const exit = creep.pos.findClosestByPath(exitDir);
                    const buildCentx = Memory.ActiveRooms[roomIndexInMemory].buildCenter.x;
                    const buildCenty = Memory.ActiveRooms[roomIndexInMemory].buildCenter.y;   
                    var cornerPos = [];
                    cornerPos[0] = {x: buildCentx + 2, y: buildCenty + 6}; // Bottom right
                    cornerPos[1] = {x: buildCentx - 2, y: buildCenty + 6}; // Bottom left
                    cornerPos[2] = {x: buildCentx - 2, y: buildCenty - 6}; // Top left
                    cornerPos[3] = {x: buildCentx + 2, y: buildCenty - 6}; // Top right

                    var smallestDistIndex = 0;
                    var smallestDist = 200;
                    for(var i = 0; i < cornerPos.length; i++) {
                        var tmpCornerPos = new RoomPosition(cornerPos[i].x, cornerPos[i].y, creep.room.name);
                        var distanceToClosestSource = creep.room.findPath(tmpCornerPos, exit, {ignoreCreeps: true}).length;
                
                        if(distanceToClosestSource < smallestDist) {
                            smallestDist = distanceToClosestSource;
                            smallestDistIndex = i;
                        }
                    }

                    const path = creep.room.findPath(exit, new RoomPosition(cornerPos[smallestDistIndex].x, cornerPos[smallestDistIndex].y, creep.room.name), {ignoreCreeps: true});
                    for(var i = 0; i < path.length; i++) {
                        creep.room.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
                    }

                    Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHomeRoads = true;
                } 
                else if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHarvRoomRoads == undefined || Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHarvRoomRoads == false) {  
                    if(creep.room.name != creep.memory.remoteHarvRoom) {
                        const exitDir = Game.map.findExit(creep.room, creep.memory.remoteHarvRoom);
                        const exit = creep.pos.findClosestByPath(exitDir);
                        creep.moveTo(exit);            
                    } else {
                        var smallestDistIndex = 0;
                        var smallestDist = 200;
                        for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].sources.length; i++) {
                            var distanceToClosestSource = creep.room.findPath(creep.pos, Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].sources[i].pos, {ignoreCreeps: true}).length;
                    
                            if(distanceToClosestSource < smallestDist) {
                                smallestDist = distanceToClosestSource;
                                smallestDistIndex = i;
                            }
                        }

                        const pathToSource = creep.room.findPath(creep.pos, Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].sources[smallestDistIndex].pos, {ignoreCreeps: true});
                        for(var i = 0; i < pathToSource.length; i++) {
                            creep.room.createConstructionSite(pathToSource[i].x, pathToSource[i].y, STRUCTURE_ROAD);
                        }

                        Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].sourceHarv = smallestDistIndex;
                        Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHarvRoomRoads = true;
                    }
                } else {
                    if(creep.room.name == creep.memory.remoteHarvRoom) {
                        const hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
                        if(hostileCreeps != undefined && hostileCreeps.length > 0) {
                            Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].activeRemoteHarv = false;
                            Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].hostileCreepCount = hostileCreeps.length;
                            Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].lastUpdated = Game.time;
                        }
                    } 

                    if(creep.store[RESOURCE_ENERGY] == 0) {
                        creep.memory.collectingEnergy = true;
                    } 
                    if(creep.memory.collectingEnergy) {
                        if(creep.store.getFreeCapacity() == 0) {
                            creep.memory.collectingEnergy = false; 
                        } else {
                            if(creep.room.name != creep.memory.remoteHarvRoom) {
                                const exitDir = Game.map.findExit(creep.room, creep.memory.remoteHarvRoom);
                                const exit = creep.pos.findClosestByPath(exitDir);
                                creep.moveTo(exit);                                    
                            } else {
                                const source = creep.room.find(FIND_SOURCES)[Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].sourceHarv];
            
                                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(source);
                                }
                            }
                        }
                    } else {
                        const closestConstructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, { filter: (s) => s.structureType == STRUCTURE_ROAD });
                        if(closestConstructionSite != undefined) { // Construct roads if they haven't been built yet
                            if (!creep.pos.inRangeTo(closestConstructionSite, 2)) {
                                creep.moveTo(closestConstructionSite);
                
                            } else {
                                creep.build(closestConstructionSite);
                            }      
                        } else {
                            const repairRoadTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * 0.5 && s.structureType == STRUCTURE_ROAD });
                            if(repairRoadTarget != undefined) { // Repairs road till fully repaired if one is below half hits
                                if(creep.memory.repairRoadTargetId == undefined) {
                                    const repairRoadTargetId = repairRoadTarget.id;
                                    creep.memory.repairRoadTargetId = repairRoadTargetId;
                                } else {
                                    if(Game.getObjectById(creep.memory.repairRoadTargetId).hits == Game.getObjectById(creep.memory.repairRoadTargetId).hitsMax) {
                                        creep.memory.repairRoadTargetId = undefined;
                                    } else {
                                        if (!creep.pos.inRangeTo(Game.getObjectById(creep.memory.repairRoadTargetId), 2)) {
                                            creep.moveTo(Game.getObjectById(creep.memory.repairRoadTargetId));
                            
                                        } else {
                                            creep.repair(Game.getObjectById(creep.memory.repairRoadTargetId));
                                        } 
                                    }                     
                                }
                            } else { // Transports energy if nothing else should be done
                                if(creep.store.getFreeCapacity() > 0) {
                                    creep.memory.collectingEnergy = true;
                                } else {
                                    if(creep.room.name != creep.memory.defaultRoom) {
                                        const exitDir = Game.map.findExit(creep.room, creep.memory.defaultRoom);
                                        const exit = creep.pos.findClosestByPath(exitDir);
                                        creep.moveTo(exit);                                           
                                    } else {                                     
                                        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
                                        if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                            creep.moveTo(storage);
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            } else if(creep.memory.job == "moveInsideBunker") {
                const roomIndexInMemory = Game.rooms[creep.memory.defaultRoom].FindRoomInMemory();
                const bunkerCenter = new RoomPosition(Memory.ActiveRooms[roomIndexInMemory].buildCenter.x, Memory.ActiveRooms[roomIndexInMemory].buildCenter.y, creep.memory.defaultRoom);
                creep.moveTo(bunkerCenter);

            } else if(creep.memory.job == "defensiveRepair") {
                if(creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.collectingEnergy = true;
                } 
                if(creep.memory.collectingEnergy) {
                    if(creep.store.getFreeCapacity() == 0) {
                        creep.memory.collectingEnergy = false; 
                    } else {
                        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE});

                        if(storage) {
                            if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(storage);
                            }
                        } 
                    }
                } else {
                    var repairRampartTargetId = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * 0.01 && s.structureType == STRUCTURE_RAMPART });
                    if(repairRampartTargetId != undefined) {
                        repairRampartTargetId = repairRampartTargetId.id;
                    }

                    if(creep.memory.repairTargetId == undefined) {
                        creep.memory.repairTargetId = repairRampartTargetId;                       
                    } else {
                        if(Game.getObjectById(creep.memory.repairTargetId).hits == Game.getObjectById(creep.memory.repairTargetId).hitsMax) {
                            creep.memory.repairTargetId = undefined;
                        } else {
                            if (!creep.pos.inRangeTo(Game.getObjectById(creep.memory.repairTargetId), 2)) {
                                creep.moveTo(Game.getObjectById(creep.memory.repairTargetId));
                
                            } else {
                                creep.repair(Game.getObjectById(creep.memory.repairTargetId));
                            } 
                        }                     
                    }
                }
            }
        
        
        }
        
    },
    spawn: function(room, maxCreepEnergy) {
        if(maxCreepEnergy < 200) {
            return false;
        }
        var workerList = _(Game.creeps).filter(function(c) {return c.memory.role == 'worker' && c.memory.defaultRoom == room.name}).value();

        if(Memory.ActiveRooms[room.FindRoomInMemory()].defence.defcon == 4) {
            var targetWorkerCount = 4;

            if(Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms != undefined) {
                for(var i = 0; i < Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms.length; i++) {
                    if(Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms[i].activeRemoteHarv == true) {
                        targetWorkerCount++;
                        break;
                    }
                }
            }
    
            if (workerList.length < targetWorkerCount) {
                return true;
            }
        } else {
            if (workerList.length < 2) { // Less worker creeps spawned when hostile creeps are present
                return true;
            }
        }

    },
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {

        const furthestSourceId = Memory.ActiveRooms[roomIndex].furthestSource.id;

        let name = 'Worker' + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: 'worker', defaultRoom: room.name, defaultSource: furthestSourceId, job: 'upgrade'};
        let extendBody = true;
        
        return {name, body, memory, extendBody};
    }
};
function WorkerCollectEnergyInRoom(creep) {

}

module.exports = roleWorker;
return module.exports;
}
/********** End of module 8: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\worker.js **********/
/********** Start module 9: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\explorer.js **********/
__modules[9] = function(module, exports) {
var explorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const homeRoom = Game.rooms[creep.memory.defaultRoom];
        const roomIndexInMemory = homeRoom.FindRoomInMemory();
        if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore != undefined && Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore.length > 0) {
            if(creep.room.name != Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore[0]) {
                const exitDir = Game.map.findExit(creep.room, Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore[0]);
                const exit = creep.pos.findClosestByPath(exitDir);
                creep.moveTo(exit);               
                
            } else { // Update memory
                const targetIndex = homeRoom.FindAdjRoomIndexInExplorerMemory(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore[0]);

                const _sources = creep.room.find(FIND_SOURCES);
                Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[targetIndex].sources = _sources;

                const hostileCreepNum = creep.room.find(FIND_HOSTILE_CREEPS);
                if(hostileCreepNum != undefined) {
                    Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[targetIndex].hostileCreepCount = hostileCreepNum.length;                    
                } else {
                    Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[targetIndex].hostileCreepCount = 0;                    
                }

                const _lastUpdated = Game.time;
                Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[targetIndex].lastUpdated = _lastUpdated;

                Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[targetIndex].activeRemoteHarv = false;
                var shiftArr = Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore;
                if(shiftArr.length == 0) {
                    Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore == undefined;
                } else {
                    shiftArr.shift();
                    Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore = shiftArr;
                }
            }

        } else { // No rooms left to explore
            creep.suicide(); 
        }
        
    },
    spawn: function(room, maxCreepEnergy) {
        if(maxCreepEnergy < 50) {
            return false;
        }
        
        var explorers = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer' && creep.memory.defaultRoom == room.name);
        if(explorers < 1 && Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRoomsToExplore != undefined  && Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRoomsToExplore.length > 0) {
            return true;
        }

        return false;
    },
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {

        let name = 'Explorer' + Game.time;
        let body = [MOVE];
        let memory = {role: 'explorer', defaultRoom: room.name};
        let extendBody = false;
        
        return {name, body, memory, extendBody};
    }
};
function SpaceForDefaultBunker(room) {
    console.log(room);

    const terrain = new Room.Terrain(room.name);
    var containsWall = false;
    var closestPos = new RoomPosition(0, 0, room.name); // Arbitary position far away from center
    for(var x = 7; x <= 42; x++) {
        for(var y = 7; y <= 42; y++) {
            containsWall = false;
            for(var i = -6; i <= 6; i++) {
                for(var j = -6; j <= 6; j++) {

                    if(terrain.get(x + i, y + j) == 1) {
                        containsWall = true;
                    }
                }
            }

            if(!containsWall) {
                if(Math.pow((25 - (x)) + (25 - (y)), 2) < Math.pow((closestPos.x - (x)) + (closestPos.y - (y)), 2)) {
                    closestPos = new RoomPosition(x, y, room.name);
                }
            }
        }
    }
    
    if(closestPos == new RoomPosition(0, 0, room.name)) { // If hasn't changed
        return undefined;
    } else {
        return closestPos;
    }
}

module.exports = explorer;
return module.exports;
}
/********** End of module 9: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\creeps\explorer.js **********/
/********** Start module 10: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\overminds\OverseeRoom.js **********/
__modules[10] = function(module, exports) {
let roomLogic = __require(3,10);
function OverseeRoom(room) {
    roomLogic.defcon(room);
    roomLogic.expansion(room);
    roomLogic.spawning(room);
    roomLogic.creepAlloc(room);
    if(Game.time % 1 === 0) {
        roomLogic.building(room);
    }
    if(Game.time % 50 === 0) {
        UpdateMemory(room);
    }
}
function UpdateMemory(room) {
    const links = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_LINK});
    
    if(links.length == 2 && Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.controllerLinkActive == undefined) {
        const furthestSource = Game.getObjectById(Memory.ActiveRooms[room.FindRoomInMemory()].furthestSource.id);
        const furthestSourceLink = furthestSource.pos.findInRange(FIND_MY_STRUCTURES, 3, {filter: {structureType: STRUCTURE_LINK}})[0];

        const controllerLink = room.controller.pos.findInRange(FIND_MY_STRUCTURES, 3, {filter: {structureType: STRUCTURE_LINK}})[0];

        Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.controllerLinkActive = true;
        Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.furthestSourceLink = furthestSourceLink.id;
        Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.controllerLink = controllerLink.id;
    }
    const ramparts = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
    var totalHits = 0;
    for(var i = 0; i < ramparts.length; i++) {
        totalHits += ramparts[i].hits;
    }
    const averageHits = totalHits / ramparts.length;
    Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.averageRampartHits = averageHits;

}

module.exports = OverseeRoom;
return module.exports;
}
/********** End of module 10: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\overminds\OverseeRoom.js **********/
/********** Start module 11: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\spawning.js **********/
__modules[11] = function(module, exports) {
let creepLogic = __require(1,11);
let creepTypes = _.keys(creepLogic);
function spawnCreeps(room) {

    const maxCreepEnergy = room.energyAvailable;
    let creepTypeNeeded = _.find(creepTypes, function(type) {
        return creepLogic[type].spawn(room, maxCreepEnergy);
    });
    roomSpawns = room.find(FIND_MY_SPAWNS);
    for(let spawn of roomSpawns) {
        if(!spawn.spawning) {
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
return module.exports;
}
/********** End of module 11: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\spawning.js **********/
/********** Start module 12: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\creepAlloc.js **********/
__modules[12] = function(module, exports) {
let towerLogic = __require(20,12);

/** Function to specify creep jobs depending on the environment, e.g. hostile creeps present
  * or unfinsihed construction sites
  **/
function AllocateCreeps(room) {
    var roomIsRemoteHarvesting = false;
    if(Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms != undefined) {
        for(var i = 0; i < Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms.length; i++) {
            if(Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms[i].activeRemoteHarv == true) {
                roomIsRemoteHarvesting = true;
                break;
            }
        }
    }
    const constructionTargets = room.find(FIND_CONSTRUCTION_SITES);
    const repairRoadTargets = room.find(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * 0.5 && s.structureType == STRUCTURE_ROAD });
    const repairRampartTargets = room.find(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.minRampartThresholdHits && s.structureType == STRUCTURE_RAMPART });
    const defcon = Memory.ActiveRooms[room.FindRoomInMemory()].defence.defcon;
    var workerList = _(Game.creeps).filter(function(c) {return c.memory.role == 'worker' && c.memory.defaultRoom == room.name}).value();
    var listOfWorkerJobs = ['upgrade', 'repair', 'build', 'repairRoad', 'repairRampart', 'remoteHarv'];
    var numberOfCreeps = {};
    for (var job of listOfWorkerJobs) {
        numberOfCreeps[job] = _.sum(workerList, (c) => c.memory.job == job);
    }
    console.log("Num workers: " + workerList.length);
    console.log("Num upgraders:" + numberOfCreeps['upgrade']);
    console.log("Num builders:" + numberOfCreeps['build']);
    console.log("Num repairRoad:" + numberOfCreeps['repairRoad']);
    console.log("Num repairRampart:" + numberOfCreeps['repairRampart']);
    console.log("Num remoteHarv:" + numberOfCreeps['remoteHarv']);
    for(let worker of workerList) {

        if(defcon == 4) {
            if(Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.controllerLinkActive) {
            }
            if(numberOfCreeps['upgrade'] == 0) {
                worker.memory.job = 'upgrade';
            } else if(numberOfCreeps['upgrade'] == 1 && worker.memory.job == 'upgrade') {
                worker.memory.job = 'upgrade';
    
            } else if(numberOfCreeps['remoteHarv'] == 0 && roomIsRemoteHarvesting) {
                worker.memory.job = 'remoteHarv';
            } else if(numberOfCreeps['remoteHarv'] == 1 && worker.memory.job == 'remoteHarv' && roomIsRemoteHarvesting) {
                worker.memory.job = 'remoteHarv';
    
            } else if(numberOfCreeps['repairRoad'] < 1 && repairRoadTargets.length > 0) {
                worker.memory.job = 'repairRoad';
            } else if(repairRoadTargets.length > 0 && worker.memory.job == 'repairRoad') {
                worker.memory.job = 'repairRoad';
                
            } else if(repairRampartTargets.length > 0) {
                worker.memory.job = 'repairRampart';
            } else if(worker.memory.job == 'repairRampart') {
                worker.memory.job = 'repairRampart';
            } 
            
            else if(constructionTargets.length > 0) {
                worker.memory.job = 'build';
            } else {
                worker.memory.job = 'upgrade';
            }
        } else {
            if(room.controller.level >= 4) { // Defence oriented around storage
                const distanceToBunkerCenter = worker.pos.findPathTo(Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.x, Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.y, {ignoreCreeps: true}).length;
                if(distanceToBunkerCenter < 8 && !creepInExclBunkerCoords(worker, room)) { // If worker is inside bunker
                    worker.memory.job = "defensiveRepair";
                } else {
                    worker.memory.job = "moveInsideBunker";
                }
            } else {
            }

        }
        for (var job of listOfWorkerJobs) {
            numberOfCreeps[job] = _.sum(workerList, (c) => c.memory.job == job);
        }
    }
    var transferList = _(Game.creeps).filter(function(c) {return c.memory.role == 'transfer' && c.memory.defaultRoom == room.name}).value();
    var listOfTransferJobs = ['defaultTransfer', 'hostileTransfer'];
    var numberOfCreeps = {};
    for (var job of listOfTransferJobs) {
        numberOfCreeps[job] = _.sum(transferList, (c) => c.memory.job == job);
    }

    for(let transfer of transferList) {
        if(defcon == 4) {
            transfer.memory.job = "defaultTransfer";
        } else {
            transfer.memory.job = "hostileTransfer";
        }
    }
    var minerList = _(Game.creeps).filter(function(c) {return c.memory.role == 'miner' && c.memory.defaultRoom == room.name}).value();
    var listOfMinerJobs = ['defaultMine', 'hostileMine'];
    var numberOfCreeps = {};
    for (var job of listOfMinerJobs) {
        numberOfCreeps[job] = _.sum(minerList, (c) => c.memory.job == job);
    }

    for(let miner of minerList) {
        if(defcon == 4) {
            miner.memory.job = "defaultMine";
        } else {
            miner.memory.job = "moveInsideBunker";
        }
    }

    const towers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER});
    _.forEach(towers, r => towerLogic.towerController(r));

}
function creepInExclBunkerCoords(creep, room) {
    const roomIndexInMemory = room.FindRoomInMemory();

    for(var i = 0; i < Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.exclBunkerCoords.length; i++) {
        var tmpRoomPos = new RoomPosition(Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.x + Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.exclBunkerCoords[i].x, Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.y + Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.exclBunkerCoords[i].y, room.name);
        if(tmpRoomPos == creep.pos) {
            return true;
        }
    }

    return false;
}

module.exports = AllocateCreeps;
return module.exports;
}
/********** End of module 12: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\creepAlloc.js **********/
/********** Start module 13: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\building.js **********/
__modules[13] = function(module, exports) {
// Checks if RCL level of room has increased, if so then calls methods to handle 
function CheckRCLLevel(room) {

    const roomIndexInMemory = room.FindRoomInMemory();
    if(room.controller.level > Memory.ActiveRooms[roomIndexInMemory].rclLevel) {
        const buildCentx = Memory.ActiveRooms[roomIndexInMemory].buildCenter.x;
        const buildCenty = Memory.ActiveRooms[roomIndexInMemory].buildCenter.y;

        if(room.controller.level == 2) {
            Memory.ActiveRooms[roomIndexInMemory].rclLevel = 2;
            BuildRCLTwo(room, buildCentx, buildCenty, roomIndexInMemory);
        }
        if(room.controller.level == 3) {
            Memory.ActiveRooms[roomIndexInMemory].rclLevel = 3;
            BuildRCLThree(room, buildCentx, buildCenty, roomIndexInMemory);
        }
        if(room.controller.level == 4) {
            Memory.ActiveRooms[roomIndexInMemory].rclLevel = 4;
            BuildRCLFour(room, buildCentx, buildCenty, roomIndexInMemory);
        }
        if(room.controller.level == 5) {
            Memory.ActiveRooms[roomIndexInMemory].rclLevel = 5;
            BuildRCLFive(room, buildCentx, buildCenty, roomIndexInMemory);
        }
    }
}

function BuildRCLTwo(room, buildCentx, buildCenty, roomIndexInMemory) {
    var cornerPos = [];
    cornerPos[0] = {x: buildCentx + 2, y: buildCenty + 6}; // Bottom right
    cornerPos[1] = {x: buildCentx - 6, y: buildCenty + 2}; // Bottom left
    cornerPos[2] = {x: buildCentx - 2, y: buildCenty - 6}; // Top left
    cornerPos[3] = {x: buildCentx + 6, y: buildCenty - 2}; // Top right

    var smallestDistIndex = 0;
    var smallestDist = 200;
    for(var i = 0; i < cornerPos.length; i++) {
        var tmpCornerPos = new RoomPosition(cornerPos[i].x, cornerPos[i].y, room.name);
        var distanceToClosestSource = room.findPath(Game.getObjectById(Memory.ActiveRooms[roomIndexInMemory].furthestSource.id).pos, tmpCornerPos, {ignoreCreeps: true}).length ;

        if(distanceToClosestSource < smallestDist) {
            smallestDist = distanceToClosestSource;
            smallestDistIndex = i;
        }
    }

    const furthestPath = room.findPath(Game.getObjectById(Memory.ActiveRooms[roomIndexInMemory].furthestSource.id).pos, new RoomPosition(cornerPos[smallestDistIndex].x, cornerPos[smallestDistIndex].y, room.name), {ignoreCreeps: true});
    for(var i = 0; i < furthestPath.length; i++) {
        room.createConstructionSite(furthestPath[i].x, furthestPath[i].y, STRUCTURE_ROAD);
    }
    var cornerPos = [];
    cornerPos[0] = {x: buildCentx + 2, y: buildCenty + 6}; // Bottom right
    cornerPos[1] = {x: buildCentx - 6, y: buildCenty + 2}; // Bottom left
    cornerPos[2] = {x: buildCentx - 2, y: buildCenty - 6}; // Top left
    cornerPos[3] = {x: buildCentx + 6, y: buildCenty - 2}; // Top right

    var smallestDistIndex = 0;
    var smallestDist = 200;
    for(var i = 0; i < cornerPos.length; i++) {
        var tmpCornerPos = new RoomPosition(cornerPos[i].x, cornerPos[i].y, room.name);
        var distanceToClosestSource = room.findPath(Game.getObjectById(Memory.ActiveRooms[roomIndexInMemory].closestSource.id).pos, tmpCornerPos, {ignoreCreeps: true}).length;

        if(distanceToClosestSource < smallestDist) {
            smallestDist = distanceToClosestSource;
            smallestDistIndex = i;
        }
    }

    const closestPath = room.findPath(Game.getObjectById(Memory.ActiveRooms[roomIndexInMemory].closestSource.id).pos, new RoomPosition(cornerPos[smallestDistIndex].x, cornerPos[smallestDistIndex].y, room.name), {ignoreCreeps: true});
    for(var i = 0; i < closestPath.length; i++) {
        room.createConstructionSite(closestPath[i].x, closestPath[i].y, STRUCTURE_ROAD);
    }
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl2ExtCoors.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl2ExtCoors[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl2ExtCoors[i].y, STRUCTURE_EXTENSION);
    }
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerBunkerCircleCoords.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerBunkerCircleCoords[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerBunkerCircleCoords[i].y, STRUCTURE_ROAD);
    }
    const workerPath = room.findPath(Game.getObjectById(Memory.ActiveRooms[roomIndexInMemory].furthestSource.id).pos, room.controller.pos, {ignoreCreeps: true});
    for(var i = 0; i < workerPath.length - 1; i++) {
        room.createConstructionSite(workerPath[i].x, workerPath[i].y, STRUCTURE_ROAD);
    }    
}

function BuildRCLThree(room, buildCentx, buildCenty, roomIndexInMemory) {
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerToOuterBunkerRoads.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerToOuterBunkerRoads[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerToOuterBunkerRoads[i].y, STRUCTURE_ROAD);
    }
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl3ExtCoors.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl3ExtCoors[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl3ExtCoors[i].y, STRUCTURE_EXTENSION);
    }
    room.createConstructionSite(buildCentx - 1, buildCenty, STRUCTURE_TOWER);
 
}


function BuildRCLFour(room, buildCentx, buildCenty, roomIndexInMemory) {
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads[i].y, STRUCTURE_ROAD);
    }
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl4ExtCoors.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl4ExtCoors[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl4ExtCoors[i].y, STRUCTURE_EXTENSION);
    }
    room.createConstructionSite(buildCentx - 1, buildCenty - 1, STRUCTURE_STORAGE);
 
}


function BuildRCLFive(room, buildCentx, buildCenty, roomIndexInMemory) {
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5ExtCoors.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5ExtCoors[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5ExtCoors[i].y, STRUCTURE_EXTENSION);
    }
    room.createConstructionSite(buildCentx + 1, buildCenty, STRUCTURE_TOWER);
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads[i].y, STRUCTURE_RAMPART);
    }
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5AdditionalRampartCoords.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5AdditionalRampartCoords[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5AdditionalRampartCoords[i].y, STRUCTURE_RAMPART);
    }
    ReturnLinkPos(room, Game.getObjectById(Memory.ActiveRooms[room.FindRoomInMemory()].furthestSource.id).pos).createConstructionSite(STRUCTURE_LINK);
    ReturnLinkPos(room, room.controller.pos).createConstructionSite(STRUCTURE_LINK)
}
function ReturnLinkPos(room, pos) {

    SurroundingCoords = [];
    SurroundingCoords[0] = {x: 0, y: -1};
    SurroundingCoords[1] = {x: 1, y: -1};
    SurroundingCoords[2] = {x: 1, y: 0};
    SurroundingCoords[3] = {x: 1, y: 1};
    SurroundingCoords[4] = {x: 0, y: 1};
    SurroundingCoords[5] = {x: -1, y: 1};
    SurroundingCoords[6] = {x: -1, y: 0};
    SurroundingCoords[7] = {x: -1, y: -1};

    AbsoluteCoordsSurroundingPos = [];

    const terrain = new Room.Terrain(room.name);
    var adjLinkPos;
    for(var i = 0; i < SurroundingCoords.length; i++) {
        var tmpRoomPos = new RoomPosition(pos.x + SurroundingCoords[i].x, pos.y + SurroundingCoords[i].y, room.name);
        AbsoluteCoordsSurroundingPos.push(tmpRoomPos);
        
        if(linkPos == undefined && terrain.get(pos.x + SurroundingCoords[i].x, pos.y + SurroundingCoords[i].y) != 1) {
            adjLinkPos = tmpRoomPos;
        }
        const roadAtPos = room.find(FIND_STRUCTURES, { filter: (s) => s.pos.isEqualTo(tmpRoomPos) && s.structureType == STRUCTURE_ROAD});
        if(roadAtPos.length == 1) {
            adjLinkPos = tmpRoomPos;
        } 
    }

    var linkPos;
    for(var i = 0; i < SurroundingCoords.length; i++) {
        var tmpRoomPos = new RoomPosition(adjLinkPos.x + SurroundingCoords[i].x, adjLinkPos.y + SurroundingCoords[i].y, room.name);

        const roadAtPos = room.find(FIND_STRUCTURES, { filter: (s) => s.pos.isEqualTo(tmpRoomPos) && s.structureType == STRUCTURE_ROAD});
        if(linkPos == undefined && terrain.get(adjLinkPos.x + SurroundingCoords[i].x, adjLinkPos.y + SurroundingCoords[i].y) != 1 && roadAtPos.length == 0) {
            var posAdjToPos = false;
            for(var i = 0; i < AbsoluteCoordsSurroundingPos.length; i++) {
                if(tmpRoomPos.isEqualTo(AbsoluteCoordsSurroundingPos[i])) {
                    posAdjToPos = true;
                }
            }

            if(!posAdjToPos) {
                linkPos = tmpRoomPos;
                break;
            }
        }

    }

    return linkPos;
}

module.exports = CheckRCLLevel;
return module.exports;
}
/********** End of module 13: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\building.js **********/
/********** Start module 14: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\memoryInit.js **********/
__modules[14] = function(module, exports) {
function CreateRoomMemory(room) {
    RCL2ExtCoords = [];
    RCL2ExtCoords[0] = {x: 1, y: +5};
    RCL2ExtCoords[1] = {x: 0, y: +4};
    RCL2ExtCoords[2] = {x: -1, y: +3};
    RCL2ExtCoords[3] = {x: -2, y: +2};
    RCL2ExtCoords[4] = {x: -3, y: +1};

    InnerBunkerCircleCoords = [];
    InnerBunkerCircleCoords[0] = {x: 0, y: -3};
    InnerBunkerCircleCoords[1] = {x: 1, y: -2};
    InnerBunkerCircleCoords[2] = {x: 2, y: -1};
    InnerBunkerCircleCoords[3] = {x: 3, y: -0};
    InnerBunkerCircleCoords[4] = {x: 2, y: +1};
    InnerBunkerCircleCoords[5] = {x: 1, y: +2};
    InnerBunkerCircleCoords[6] = {x: 0, y: +3};
    InnerBunkerCircleCoords[7] = {x:-1, y: +2};
    InnerBunkerCircleCoords[8] = {x: -2, y: +1};
    InnerBunkerCircleCoords[9] = {x: -3, y: 0};
    InnerBunkerCircleCoords[10] = {x: -2, y: -1};
    InnerBunkerCircleCoords[11] = {x: -1, y: -2};
    InnerBunkerCircleCoords[12] = {x: 0, y: -3};

    InnerToOuterBunkerRoads = [];
    InnerToOuterBunkerRoads[0] = {x: -1, y: -4};
    InnerToOuterBunkerRoads[1] = {x: -2, y: -5};
    InnerToOuterBunkerRoads[2] = {x: +4, y: -1};
    InnerToOuterBunkerRoads[3] = {x: +5, y: -2};
    InnerToOuterBunkerRoads[4] = {x: +1, y: +4};
    InnerToOuterBunkerRoads[5] = {x: +2, y: +5};
    InnerToOuterBunkerRoads[6] = {x: -4, y: +1};
    InnerToOuterBunkerRoads[7] = {x: -5, y: +2};

    RCL3ExtCoords = [];
    RCL3ExtCoords[0] = {x: -1, y: -3};
    RCL3ExtCoords[1] = {x: -2, y: -2};
    RCL3ExtCoords[2] = {x: -3, y: -1};
    RCL3ExtCoords[3] = {x: -4, y: 0};
    RCL3ExtCoords[4] = {x: -5, y: +1};

    OuterBunkerRoads = [];
    OuterBunkerRoads[0] = {x: -2, y: -6};
    OuterBunkerRoads[1] = {x: -1, y: -6};
    OuterBunkerRoads[2] = {x: 0, y: -6};
    OuterBunkerRoads[3] = {x: +1, y: -6};
    OuterBunkerRoads[4] = {x: +2, y: -6};
    OuterBunkerRoads[5] = {x: +3, y: -5};
    OuterBunkerRoads[6] = {x: +4, y: -4};
    OuterBunkerRoads[7] = {x: +5, y: -3};
    OuterBunkerRoads[8] = {x: +6, y: -2};
    OuterBunkerRoads[9] = {x: +6, y: -1};
    OuterBunkerRoads[10] = {x: +6, y: 0};
    OuterBunkerRoads[11] = {x: +6, y: +1};
    OuterBunkerRoads[12] = {x: +6, y: +2};
    OuterBunkerRoads[13] = {x: +5, y: +3};
    OuterBunkerRoads[14] = {x: +4, y: +4};
    OuterBunkerRoads[15] = {x: +3, y: +5};
    OuterBunkerRoads[16] = {x: +2, y: +6};
    OuterBunkerRoads[17] = {x: +1, y: +6};
    OuterBunkerRoads[18] = {x: +0, y: +6};
    OuterBunkerRoads[19] = {x: -1, y: +6};
    OuterBunkerRoads[20] = {x: -2, y: +6};
    OuterBunkerRoads[21] = {x: -3, y: +5};
    OuterBunkerRoads[22] = {x: -4, y: +4};
    OuterBunkerRoads[23] = {x: -5, y: +3};
    OuterBunkerRoads[24] = {x: -6, y: +2};
    OuterBunkerRoads[25] = {x: -6, y: +1};
    OuterBunkerRoads[26] = {x: -6, y: +0};
    OuterBunkerRoads[27] = {x: -6, y: -1};
    OuterBunkerRoads[28] = {x: -6, y: -2};
    OuterBunkerRoads[29] = {x: -5, y: -3};
    OuterBunkerRoads[30] = {x: -4, y: -4};
    OuterBunkerRoads[31] = {x: -3, y: -5};

    RCL4ExtCoords = [];
    RCL4ExtCoords[0] = {x: -1, y: -5};
    RCL4ExtCoords[1] = {x: 0, y: -4};
    RCL4ExtCoords[2] = {x: +1, y: -3};
    RCL4ExtCoords[3] = {x: +2, y: -2};
    RCL4ExtCoords[4] = {x: +3, y: -1};
    RCL4ExtCoords[5] = {x: +1, y: +3};
    RCL4ExtCoords[6] = {x: +2, y: +2};
    RCL4ExtCoords[7] = {x: +3, y: +1};
    RCL4ExtCoords[8] = {x: +4, y: +0};
    RCL4ExtCoords[9] = {x: +5, y: -1};
    _exclBunkerCoords = [];
    _exclBunkerCoords[0] = {x: -1, y: 7};
    _exclBunkerCoords[1] = {x: 0, y: 7};
    _exclBunkerCoords[2] = {x: 1, y: 7};
    _exclBunkerCoords[3] = {x: 0, y: 8};
    _exclBunkerCoords[4] = {x: -1, y: -7};
    _exclBunkerCoords[5] = {x: 0, y: -7};
    _exclBunkerCoords[6] = {x: 1, y: -7};
    _exclBunkerCoords[7] = {x: 0, y: -8};
    _exclBunkerCoords[8] = {x: 7, y: -1};
    _exclBunkerCoords[9] = {x: 7, y: 0};
    _exclBunkerCoords[10] = {x: 7, y: 1};
    _exclBunkerCoords[11] = {x: 8, y: 0};
    _exclBunkerCoords[12] = {x: -7, y: -1};
    _exclBunkerCoords[13] = {x: -7, y: 0};
    _exclBunkerCoords[14] = {x: -7, y: 1};
    _exclBunkerCoords[15] = {x: -8, y: 0};

    RCL5ExtCoords = [];
    RCL5ExtCoords[0] = {x: -4, y: 2};
    RCL5ExtCoords[1] = {x: -3, y: 2};
    RCL5ExtCoords[2] = {x: -2, y: 3};
    RCL5ExtCoords[3] = {x: -1, y: 4};
    RCL5ExtCoords[4] = {x: 0, y: 5};
    RCL5ExtCoords[5] = {x: 2, y: 4};
    RCL5ExtCoords[6] = {x: 2, y: 3};
    RCL5ExtCoords[7] = {x: 3, y: 2};
    RCL5ExtCoords[8] = {x: 4, y: 1};
    RCL5ExtCoords[9] = {x: 5, y: 0};
    RCL5AdditionalRampartCoords = [];
    RCL5AdditionalRampartCoords[0] = {x: 2, y: -5};
    RCL5AdditionalRampartCoords[1] = {x: 5, y: -2};
    RCL5AdditionalRampartCoords[2] = {x: 5, y: +2};
    RCL5AdditionalRampartCoords[3] = {x: 2, y: 5};
    RCL5AdditionalRampartCoords[4] = {x: -2, y: 5};
    RCL5AdditionalRampartCoords[5] = {x: -5, y: 2};
    RCL5AdditionalRampartCoords[6] = {x: -5, y: -2};
    RCL5AdditionalRampartCoords[7] = {x: -2, y: -5};
    furthestSourceObject = {id: room.find(FIND_MY_SPAWNS)[0].pos.FindFurthestByPath(room.find(FIND_SOURCES)).id,
        emptyAdjacentTiles: EmptyTilesAroundCoord(room, room.find(FIND_MY_SPAWNS)[0].pos.FindFurthestByPath(room.find(FIND_SOURCES)).pos)};

    closestSourceObject = {id: room.find(FIND_MY_SPAWNS)[0].pos.findClosestByPath(room.find(FIND_SOURCES)).id,
        emptyAdjacentTiles: EmptyTilesAroundCoord(room, room.find(FIND_MY_SPAWNS)[0].pos.findClosestByPath(room.find(FIND_SOURCES)).pos)};
    buildingCoordsObject = {rcl2ExtCoors: RCL2ExtCoords, innerBunkerCircleCoords: InnerBunkerCircleCoords, innerToOuterBunkerRoads: InnerToOuterBunkerRoads, rcl3ExtCoors: RCL3ExtCoords
                            , outerBunkerRoads: OuterBunkerRoads, rcl4ExtCoors: RCL4ExtCoords, rcl5ExtCoors: RCL5ExtCoords, rcl5AdditionalRampartCoords: RCL5AdditionalRampartCoords};
    buildCenterObject = {x: room.find(FIND_MY_SPAWNS)[0].pos.x + 1, y: room.find(FIND_MY_SPAWNS)[0].pos.y - 1, exclBunkerCoords: _exclBunkerCoords, minRampartHits: 0.01, minRampartThresholdHits: 0.005};
    defenceObject = {defcon: 4, hostileCreepTick: 0};
    expanionObject = {};
    
    roomObject = {name: room.name, rclLevel: room.controller.level, buildCenter: buildCenterObject, buildingCoords: buildingCoordsObject, 
    furthestSource: furthestSourceObject, closestSource: closestSourceObject, defence: defenceObject, expansion: expanionObject};
    
    Memory.ActiveRooms[Memory.ActiveRooms.length] = roomObject;
}
function EmptyTilesAroundCoord(room, pos) {
    SurroundingCoords = [];
    SurroundingCoords[0] = {x: 0, y: -1};
    SurroundingCoords[1] = {x: 1, y: -1};
    SurroundingCoords[2] = {x: 1, y: 0};
    SurroundingCoords[3] = {x: 1, y: 1};
    SurroundingCoords[4] = {x: 0, y: 1};
    SurroundingCoords[5] = {x: -1, y: 1};
    SurroundingCoords[6] = {x: -1, y: 0};
    SurroundingCoords[7] = {x: -1, y: -1};

    const terrain = new Room.Terrain(room.name);
    var counter = 0;
    for(var i = 0; i < SurroundingCoords.length; i++) {
        if(terrain.get(pos.x + SurroundingCoords[i].x, pos.y + SurroundingCoords[i].y) != 1) {
            counter++;
        }
    }

    return counter;
}

module.exports = CreateRoomMemory;
return module.exports;
}
/********** End of module 14: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\memoryInit.js **********/
/********** Start module 15: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\defcon.js **********/
__modules[15] = function(module, exports) {
// Script for handling defcon, responce to such is found in creepAlloc.js, towerController.js and others
function UpdateDefcon(room) {
    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    const roomIndexInMemory = room.FindRoomInMemory();

    console.log(room.name + ", Defcon: " + Memory.ActiveRooms[roomIndexInMemory].defence.defcon + ", Ticks: " + Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick);
    if(hostileCreeps.length > 0) {
        Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick++;
        if(hostileCreeps.length > 0 && Memory.ActiveRooms[roomIndexInMemory].defence.defcon == 4) {
            Memory.ActiveRooms[roomIndexInMemory].defence.defcon = 3;
            Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick = 0;
        } 
        if(hostileCreeps.length >= 4) {
            Memory.ActiveRooms[roomIndexInMemory].defence.defcon = 1;
            Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick = 0;
        } 

        if(Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick >= 20 && Memory.ActiveRooms[roomIndexInMemory].defence.defcon > 0) {
            Memory.ActiveRooms[roomIndexInMemory].defence.defcon--;
            Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick = 0;
        }

        if(Memory.ActiveRooms[roomIndexInMemory].defence.defcon == 0) {
            room.controller.activateSafeMode();
        }

    } else if(hostileCreeps.length == 0) { // Increases defcon if no creeps present

        if(Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick > 0) {
            Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick--;
        }

        if(Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick == 0 && Memory.ActiveRooms[roomIndexInMemory].defence.defcon < 4) {
            Memory.ActiveRooms[roomIndexInMemory].defence.defcon++;
            Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick = 20;
        } 
    } 

}


module.exports = UpdateDefcon;
return module.exports;
}
/********** End of module 15: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\defcon.js **********/
/********** Start module 16: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\expansion.js **********/
__modules[16] = function(module, exports) {
// Script to handle expansion (external harvesting, auto-colonisation...), requires refactor
function UpdateExpanion(room) {
    if(room.controller.level >= 4 && room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE})) {

        const roomIndexInMemory = room.FindRoomInMemory();
        if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms == undefined) {
            var exitsArr = [];
            var explorerArr = [];

            const exits = Game.map.describeExits(room.name);
            for(var i = 0; i <= 7; i++) {
                if(exits[i] != undefined) {
                    exitsArr[exitsArr.length] = {roomName: exits[i]};
                    explorerArr[explorerArr.length] = exits[i];
                }
            }

            Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms = exitsArr;
            Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore = explorerArr;
        }
        var removeActiveHarvCount = 0;
        for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms.length; i++) {
            if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[i].activeRemoteHarv == true) {
                removeActiveHarvCount++;
            }
        }

        if(removeActiveHarvCount == 0) {
            for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms.length; i++) {

                if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[i].sources != undefined && Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[i].sources.length > 0
                && Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[i].hostileCreepCount == 0 && Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[i].activeRemoteHarv == false) {
                   
                    Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[i].activeRemoteHarv = true;       
                    break;
                }
            }
        }   
    }
}



module.exports = UpdateExpanion;
return module.exports;
}
/********** End of module 16: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\room\expansion.js **********/
/********** Start module 17: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\prototypes\creep.js **********/
__modules[17] = function(module, exports) {
Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}
return module.exports;
}
/********** End of module 17: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\prototypes\creep.js **********/
/********** Start module 18: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\prototypes\roomPosition.js **********/
__modules[18] = function(module, exports) {
RoomPosition.prototype.FindFurthestByPath = function FindFurthestByPath(objList) {

    if(!objList) {
        return -1;
    }

    var indexOfFurthestObject = 0;
    var furthestDistance = 0;
    for(var i = 0; i < objList.length; i++) {
        var pathlength = Game.rooms[this.roomName].findPath(this, objList[i].pos, {ignoreCreeps: true}).length;
        if(pathlength > furthestDistance) {
            indexOfFurthestObject = i;
            furthestDistance = pathlength;
        }
    }

    return objList[indexOfFurthestObject];
}
return module.exports;
}
/********** End of module 18: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\prototypes\roomPosition.js **********/
/********** Start module 19: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\prototypes\room.js **********/
__modules[19] = function(module, exports) {
// Returns index of room in Memory.ActiveRooms, if doesn't exist then returns -1
Room.prototype.FindRoomInMemory = function FindRoomInMemory() {

    for(var i = 0; i < Memory.ActiveRooms.length; i++) {
        if(Memory.ActiveRooms[i].name == this.name) {
            return i;
        }
    }

    return -1;
}
Room.prototype.FindAdjRoomIndexInExplorerMemory = function FindAdjRoomIndexInExplorerMemory(targetRoomName) {
    for(var i = 0; i < Memory.ActiveRooms[this.FindRoomInMemory()].expansion.adjacentRooms.length; i++) {
        if(targetRoomName == Memory.ActiveRooms[this.FindRoomInMemory()].expansion.adjacentRooms[i].roomName) {
            return i;
        }
    }

    return -1;
}
return module.exports;
}
/********** End of module 19: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\prototypes\room.js **********/
/********** Start module 20: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\towers\index.js **********/
__modules[20] = function(module, exports) {
let towerLogic = {
    towerController:    __require(21,20),
}

module.exports = towerLogic;
return module.exports;
}
/********** End of module 20: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\towers\index.js **********/
/********** Start module 21: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\towers\towerController.js **********/
__modules[21] = function(module, exports) {
function controlTower(tower) {

    const repairRoadTarget = tower.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * 0.9 && s.structureType == STRUCTURE_ROAD });
    const hostileCreep = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if(hostileCreep) {
        tower.attack(hostileCreep);
    }
    if(repairRoadTarget) {
        tower.repair(repairRoadTarget);
    }
        
}

module.exports = controlTower;
return module.exports;
}
/********** End of module 21: C:\Users\Guest1\Documents\Personal Projects\Screeps\Screeps Master\src\towers\towerController.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
