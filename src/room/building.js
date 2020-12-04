// Checks if RCL level of room has increased, if so then calls methods to handle 
// new construction
function CheckRCLLevel(room) {

    //_.forEach(room.find(FIND_CONSTRUCTION_SITES), r => r.remove());

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

    // Builds roads from furthest energy source to closest corner to it around bunker
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

    // Builds roads from closest energy source to closest corner to it around bunker
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

    // Builds extensions
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl2ExtCoors.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl2ExtCoors[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl2ExtCoors[i].y, STRUCTURE_EXTENSION);
    }

    // Build circle road
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerBunkerCircleCoords.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerBunkerCircleCoords[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerBunkerCircleCoords[i].y, STRUCTURE_ROAD);
    }

    // Build road from worker source to controller
    const workerPath = room.findPath(Game.getObjectById(Memory.ActiveRooms[roomIndexInMemory].furthestSource.id).pos, room.controller.pos, {ignoreCreeps: true});
    for(var i = 0; i < workerPath.length - 1; i++) {
        room.createConstructionSite(workerPath[i].x, workerPath[i].y, STRUCTURE_ROAD);
    }    
}

function BuildRCLThree(room, buildCentx, buildCenty, roomIndexInMemory) {
    // Build mid roads
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerToOuterBunkerRoads.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerToOuterBunkerRoads[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.innerToOuterBunkerRoads[i].y, STRUCTURE_ROAD);
    }

    // Build extensions
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl3ExtCoors.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl3ExtCoors[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl3ExtCoors[i].y, STRUCTURE_EXTENSION);
    }

    // Build tower
    room.createConstructionSite(buildCentx - 1, buildCenty, STRUCTURE_TOWER);
 
}


function BuildRCLFour(room, buildCentx, buildCenty, roomIndexInMemory) {
    // Build outer roads
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads[i].y, STRUCTURE_ROAD);
    }

    // Build extensions
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl4ExtCoors.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl4ExtCoors[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl4ExtCoors[i].y, STRUCTURE_EXTENSION);
    }

    // Build storage
    room.createConstructionSite(buildCentx - 1, buildCenty - 1, STRUCTURE_STORAGE);
 
}


function BuildRCLFive(room, buildCentx, buildCenty, roomIndexInMemory) {
    // Build extensions
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5ExtCoors.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5ExtCoors[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5ExtCoors[i].y, STRUCTURE_EXTENSION);
    }

    // Build tower
    room.createConstructionSite(buildCentx + 1, buildCenty, STRUCTURE_TOWER);

    // Build ramparts
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.outerBunkerRoads[i].y, STRUCTURE_RAMPART);
    }
    for(var i = 0; i < Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5AdditionalRampartCoords.length; i++) {
        room.createConstructionSite(buildCentx + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5AdditionalRampartCoords[i].x,
            buildCenty + Memory.ActiveRooms[roomIndexInMemory].buildingCoords.rcl5AdditionalRampartCoords[i].y, STRUCTURE_RAMPART);
    }

    // Build links
    ReturnLinkPos(room, Game.getObjectById(Memory.ActiveRooms[room.FindRoomInMemory()].furthestSource.id).pos).createConstructionSite(STRUCTURE_LINK);
    ReturnLinkPos(room, room.controller.pos).createConstructionSite(STRUCTURE_LINK)
}

// Returns pos two units away from pos parameter, ideally adjacemt to a road, used to find pos to construct links
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

        // If road exists at pos, return pos 
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