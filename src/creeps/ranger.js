// Note, currently has to be spawned and directed manually with flags
var ranger = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(Game.flags['rangerRoom'] != undefined) {
            const targetRoomName = Game.flags['rangerRoom'].pos.roomName;

            if(creep.room.name != Game.flags['rangerRoom'].pos.roomName) {
                const exitDir = Game.map.findExit(creep.room, targetRoomName);
                const exit = creep.pos.findClosestByPath(exitDir);
                creep.moveTo(exit);
                
            } else {
                creep.say('Get out');
                const hostileCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                if(hostileCreep) {
                    if(creep.attack(hostileCreep) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostileCreep);
                    }
                } else {
                    creep.moveTo(Game.flags['rangerRoom']);
                }
            }
        } else {
            creep.moveTo(creep.room.find(FIND_MY_SPAWNS)[0]);
        }
    },

    // Checks if the room needs to spawn this creep
    spawn: function(room, spawn) {
        return false;
        var rangers = _.filter(Game.creeps, (creep) => creep.memory.role == 'ranger' && creep.memory.defaultRoom == room.name);

        if(rangers < 1) {
            return true;
        }
        return false;

    },

    // Returns an object with the data to spawn a new creep
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {

        let name = 'Ranger' + Game.time;
        let body = [ATTACK, ATTACK, MOVE, MOVE];
        let memory = {role: 'ranger', defaultRoom: room.name};
        let extendBody = true;
        
        return {name, body, memory, extendBody};
    }
};

module.exports = ranger;