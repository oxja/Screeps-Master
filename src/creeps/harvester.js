var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // Kills harvester after 20 ticks if miner and transfer exist
        const numMinInRoom = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == "miner").length;
        const numTransfInRoom = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == "transfer").length;
        if(numMinInRoom == 1 && numTransfInRoom == 1 && !creep.memory.deathTimer) {
            creep.memory.deathTimer = 50;
        }

        // Optimise, perhaps recycle + do one last harvest/deposit cycle
        if(creep.memory.deathTimer) { 
            if(creep.memory.deathTimer > 0) {
                creep.memory.deathTimer--;
            } 
        }

        // Gets energy at closest source to 0th spawn and deposits in spawn
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

    // Checks if the room needs to spawn this creep
    spawn: function(room, maxCreepEnergy) {
        if(maxCreepEnergy < 200) {
            return false;
        }

        const numCreepsInRoom = _.filter(Game.creeps, (creep) => creep.room.name == room.name).length;
        if (numCreepsInRoom == 0 && maxCreepEnergy >= 200) {
            return true;
        }
    },

    // Returns an object with the data to spawn a new creep
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {
        // Gets ID of closest source to store in creep memory
        const closestSourceId = Memory.ActiveRooms[roomIndex].closestSource.id;

        let name = 'Harvester' + Game.time;
        let body = [WORK, CARRY, MOVE];
        let memory = {role: 'harvester', defaultRoom: room.name, defaultSource: closestSourceId};
        let extendBody = false;
        
        return {name, body, memory, extendBody};
    }
};

module.exports = harvester;