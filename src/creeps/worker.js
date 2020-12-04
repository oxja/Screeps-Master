// Worker role, designed to be able to complete a wide variety of tasks rather than creating several specialised creeps 

var roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // "Normal" worker roles: upgrading controller, building construction sites, repairing roads, together as they share common code for collecting energy
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

                    // Look for ramparts with far below average hits, prevent newly built ramparts from decaying
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

                // Updates memory of creep of commonly used memory indexes
                if(creep.memory.remoteHarvRoom == undefined) {

                    // Finds which room is active
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

                // Constructs roads from home bunker to exit
                if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHomeRoads == undefined || Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHomeRoads == false) {
                    const exitDir = Game.map.findExit(homeRoom, creep.memory.remoteHarvRoom);
                    const exit = creep.pos.findClosestByPath(exitDir);

                    // Builds roads from closest "corner" of bunker to exit
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
                // Constructs roads from entrance to harv. room to closest source, and also stores which source is closer in memory for future use
                else if(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHarvRoomRoads == undefined || Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].constructedHarvRoomRoads == false) {  
                    if(creep.room.name != creep.memory.remoteHarvRoom) {
                        const exitDir = Game.map.findExit(creep.room, creep.memory.remoteHarvRoom);
                        const exit = creep.pos.findClosestByPath(exitDir);
                        creep.moveTo(exit);            
                    } else {

                        // Finds closest source and builds path
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

                    // If hostile creeps are in harvester room, harv. room won't be "active" anymore, tb improved
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

                //const pathToSource = creep.pos.findPathTo(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].sources[0])
                //console.log(Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRooms[creep.memory.remoteHarvRoomIndex].sources[0].pos);
                //for(var i = 0; i < pathToSource.length; i++) {
                //    console.log(pathToSource[i].x + ", " + pathToSource[i].y);
                //}
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

    // Checks if the room needs to spawn a creep
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

    // Returns an object with the data to spawn a new creep
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {

        const furthestSourceId = Memory.ActiveRooms[roomIndex].furthestSource.id;

        let name = 'Worker' + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: 'worker', defaultRoom: room.name, defaultSource: furthestSourceId, job: 'upgrade'};
        let extendBody = true;
        
        return {name, body, memory, extendBody};
    }
};

// Repeated code that different jobs all use
function WorkerCollectEnergyInRoom(creep) {

}

module.exports = roleWorker;