// Script to handle expansion (external harvesting, auto-colonisation...), requires refactor
function UpdateExpanion(room) {

    // Room will attempt auto. remote harvesting when RCL4 and storage is built, so 
    // excess energy has somewhere to be stored
    if(room.controller.level >= 4 && room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_STORAGE})) {

        const roomIndexInMemory = room.FindRoomInMemory();

        // Creates adjacent memory if it doesn't exist
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

            // Also adds to another point in memory, so explorer creep can travel to such rooms and "explore" them. Memory is stored differently
            // for accessability
            Memory.ActiveRooms[roomIndexInMemory].expansion.adjacentRoomsToExplore = explorerArr;
        }

        // If no remote harv. is taking place and one is possible, such one will be made "active". "Active" rooms can be also
        // be made "unactive" if hostile creeps in such room are encountered
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