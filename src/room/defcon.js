// Script for handling defcon, responce to such is found in creepAlloc.js, towerController.js and others
function UpdateDefcon(room) {
    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    const roomIndexInMemory = room.FindRoomInMemory();

    console.log(room.name + ", Defcon: " + Memory.ActiveRooms[roomIndexInMemory].defence.defcon + ", Ticks: " + Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick);
    // Decreases defcon if hostiles creeps have been present in room for too long
    if(hostileCreeps.length > 0) {
        Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick++;

        // Manually decreases defcon to 3 if any hostile creeps present, so room doesn't take x ticks to react to this change
        if(hostileCreeps.length > 0 && Memory.ActiveRooms[roomIndexInMemory].defence.defcon == 4) {
            Memory.ActiveRooms[roomIndexInMemory].defence.defcon = 3;
            Memory.ActiveRooms[roomIndexInMemory].defence.hostileCreepTick = 0;
        } 

        // Manually decreases defcon if lots of hostile creeps present
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