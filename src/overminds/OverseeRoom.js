let roomLogic = require('../room');

// Function to handle all logistics of room, including screep tasks. Included for better room to room
// communication (currently not implemented_)
function OverseeRoom(room) {

    // Handles defcon of room
    roomLogic.defcon(room);

    // Check if any expansion can be done for each room
    roomLogic.expansion(room);

    // Handles whether new creeps need to be spawned, and spawning in such creeps
    roomLogic.spawning(room);

    // Changes creeps "jobs" depending on environment
    roomLogic.creepAlloc(room);

    // Checks every 50 ticks if RCL has changed, if so construction sites will be placed
    if(Game.time % 1 === 0) {
        roomLogic.building(room);
    }

    // Update certain point in room memory
    if(Game.time % 50 === 0) {
        UpdateMemory(room);
    }
}

// Updates room memory, used for building
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

    // Calculates average rampart hits for room
    const ramparts = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART});
    var totalHits = 0;
    for(var i = 0; i < ramparts.length; i++) {
        totalHits += ramparts[i].hits;
    }
    const averageHits = totalHits / ramparts.length;
    Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.averageRampartHits = averageHits;

}

module.exports = OverseeRoom;