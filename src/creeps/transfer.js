// Note - currently not being used, going to be refactored

var transfer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const roomExtension = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
        const spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
        const tower = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 100});
        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE});

        if(creep.memory.job == "defaultTransfer") {
            // If energy needs to be transported, make it top priority
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

    // Checks if the room needs to spawn this creep
    spawn: function(room, maxCreepEnergy) {
        if(maxCreepEnergy < 100) {
            return false;
        }

        // If room extensions exist then we need 2 transfers to keep up with demand, otherwise only one
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

    // Returns an object with the data to spawn a new creep
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {
        let name = 'Transfer' + Game.time;
        let body = [CARRY, MOVE];
        let memory = {role: 'transfer', defaultRoom: room.name, job: 'defaultTransfer'};
        let extendBody = true;
        
        return {name, body, memory, extendBody};
    }
};

module.exports = transfer;