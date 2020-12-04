var miner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Travels to source defined in memory
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

    // Checks if the room needs to spawn this creep
    spawn: function(room, maxCreepEnergy) {
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.room.name == room.name);

        if (miners < 1 && maxCreepEnergy >= 150) {
            return true;
        }
    },

    // Returns an object with the data to spawn a new creep
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {
        const closestSourceId = Memory.ActiveRooms[roomIndex].closestSource.id;

        let name = 'Miner' + Game.time;
        let body = CreateMinerBody(maxCreepEnergy);
        let memory = {role: 'miner', defaultRoom: room.name, defaultSource: closestSourceId};
        let extendBody = false;
        
        return {name, body, memory, extendBody};
    }
};

// Returns body with one move and as many as possible work parts 
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