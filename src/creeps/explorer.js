var explorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const homeRoom = Game.rooms[creep.memory.defaultRoom];
        const roomIndexInMemory = homeRoom.FindRoomInMemory();

        // If adjacent rooms to spawn haven't been explored
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

                // Shifts array
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

    // Checks if the room needs to spawn this creep
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

    // Returns an object with the data to spawn a new creep
    spawnData: function(room, spawn, roomIndex, maxCreepEnergy) {

        let name = 'Explorer' + Game.time;
        let body = [MOVE];
        let memory = {role: 'explorer', defaultRoom: room.name};
        let extendBody = false;
        
        return {name, body, memory, extendBody};
    }
};

// Returns with a roomPosition if there exists a 13x13 space without any wall terrain, which is size of default bunker, undefined otherwise. Highly
// inefficient, requires optimisation
function SpaceForDefaultBunker(room) {
    console.log(room);

    const terrain = new Room.Terrain(room.name);
    var containsWall = false;
    var closestPos = new RoomPosition(0, 0, room.name); // Arbitary position far away from center

    // Iterates through all feasible coords in room
    for(var x = 7; x <= 42; x++) {
        for(var y = 7; y <= 42; y++) {
            containsWall = false;

            // Iterates through +- 6 either side
            for(var i = -6; i <= 6; i++) {
                for(var j = -6; j <= 6; j++) {

                    if(terrain.get(x + i, y + j) == 1) {
                        containsWall = true;
                    }
                }
            }

            if(!containsWall) {
                // If possible pos is closer to center than all previous found ones
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