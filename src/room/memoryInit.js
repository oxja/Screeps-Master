function CreateRoomMemory(room) {

    // Manual coords for building placement, automatisation easier with standard blueprint base design
    // even if the code is a little ugly
    RCL2ExtCoords = [];
    RCL2ExtCoords[0] = {x: 1, y: +5};
    RCL2ExtCoords[1] = {x: 0, y: +4};
    RCL2ExtCoords[2] = {x: -1, y: +3};
    RCL2ExtCoords[3] = {x: -2, y: +2};
    RCL2ExtCoords[4] = {x: -3, y: +1};

    InnerBunkerCircleCoords = [];
    InnerBunkerCircleCoords[0] = {x: 0, y: -3};
    InnerBunkerCircleCoords[1] = {x: 1, y: -2};
    InnerBunkerCircleCoords[2] = {x: 2, y: -1};
    InnerBunkerCircleCoords[3] = {x: 3, y: -0};
    InnerBunkerCircleCoords[4] = {x: 2, y: +1};
    InnerBunkerCircleCoords[5] = {x: 1, y: +2};
    InnerBunkerCircleCoords[6] = {x: 0, y: +3};
    InnerBunkerCircleCoords[7] = {x:-1, y: +2};
    InnerBunkerCircleCoords[8] = {x: -2, y: +1};
    InnerBunkerCircleCoords[9] = {x: -3, y: 0};
    InnerBunkerCircleCoords[10] = {x: -2, y: -1};
    InnerBunkerCircleCoords[11] = {x: -1, y: -2};
    InnerBunkerCircleCoords[12] = {x: 0, y: -3};

    InnerToOuterBunkerRoads = [];
    InnerToOuterBunkerRoads[0] = {x: -1, y: -4};
    InnerToOuterBunkerRoads[1] = {x: -2, y: -5};
    InnerToOuterBunkerRoads[2] = {x: +4, y: -1};
    InnerToOuterBunkerRoads[3] = {x: +5, y: -2};
    InnerToOuterBunkerRoads[4] = {x: +1, y: +4};
    InnerToOuterBunkerRoads[5] = {x: +2, y: +5};
    InnerToOuterBunkerRoads[6] = {x: -4, y: +1};
    InnerToOuterBunkerRoads[7] = {x: -5, y: +2};

    RCL3ExtCoords = [];
    RCL3ExtCoords[0] = {x: -1, y: -3};
    RCL3ExtCoords[1] = {x: -2, y: -2};
    RCL3ExtCoords[2] = {x: -3, y: -1};
    RCL3ExtCoords[3] = {x: -4, y: 0};
    RCL3ExtCoords[4] = {x: -5, y: +1};

    OuterBunkerRoads = [];
    OuterBunkerRoads[0] = {x: -2, y: -6};
    OuterBunkerRoads[1] = {x: -1, y: -6};
    OuterBunkerRoads[2] = {x: 0, y: -6};
    OuterBunkerRoads[3] = {x: +1, y: -6};
    OuterBunkerRoads[4] = {x: +2, y: -6};
    OuterBunkerRoads[5] = {x: +3, y: -5};
    OuterBunkerRoads[6] = {x: +4, y: -4};
    OuterBunkerRoads[7] = {x: +5, y: -3};
    OuterBunkerRoads[8] = {x: +6, y: -2};
    OuterBunkerRoads[9] = {x: +6, y: -1};
    OuterBunkerRoads[10] = {x: +6, y: 0};
    OuterBunkerRoads[11] = {x: +6, y: +1};
    OuterBunkerRoads[12] = {x: +6, y: +2};
    OuterBunkerRoads[13] = {x: +5, y: +3};
    OuterBunkerRoads[14] = {x: +4, y: +4};
    OuterBunkerRoads[15] = {x: +3, y: +5};
    OuterBunkerRoads[16] = {x: +2, y: +6};
    OuterBunkerRoads[17] = {x: +1, y: +6};
    OuterBunkerRoads[18] = {x: +0, y: +6};
    OuterBunkerRoads[19] = {x: -1, y: +6};
    OuterBunkerRoads[20] = {x: -2, y: +6};
    OuterBunkerRoads[21] = {x: -3, y: +5};
    OuterBunkerRoads[22] = {x: -4, y: +4};
    OuterBunkerRoads[23] = {x: -5, y: +3};
    OuterBunkerRoads[24] = {x: -6, y: +2};
    OuterBunkerRoads[25] = {x: -6, y: +1};
    OuterBunkerRoads[26] = {x: -6, y: +0};
    OuterBunkerRoads[27] = {x: -6, y: -1};
    OuterBunkerRoads[28] = {x: -6, y: -2};
    OuterBunkerRoads[29] = {x: -5, y: -3};
    OuterBunkerRoads[30] = {x: -4, y: -4};
    OuterBunkerRoads[31] = {x: -3, y: -5};

    RCL4ExtCoords = [];
    RCL4ExtCoords[0] = {x: -1, y: -5};
    RCL4ExtCoords[1] = {x: 0, y: -4};
    RCL4ExtCoords[2] = {x: +1, y: -3};
    RCL4ExtCoords[3] = {x: +2, y: -2};
    RCL4ExtCoords[4] = {x: +3, y: -1};
    RCL4ExtCoords[5] = {x: +1, y: +3};
    RCL4ExtCoords[6] = {x: +2, y: +2};
    RCL4ExtCoords[7] = {x: +3, y: +1};
    RCL4ExtCoords[8] = {x: +4, y: +0};
    RCL4ExtCoords[9] = {x: +5, y: -1};

    // All bunker coords are distance 8 from center, apart from the ones listed below (relative coords)
    _exclBunkerCoords = [];
    _exclBunkerCoords[0] = {x: -1, y: 7};
    _exclBunkerCoords[1] = {x: 0, y: 7};
    _exclBunkerCoords[2] = {x: 1, y: 7};
    _exclBunkerCoords[3] = {x: 0, y: 8};
    _exclBunkerCoords[4] = {x: -1, y: -7};
    _exclBunkerCoords[5] = {x: 0, y: -7};
    _exclBunkerCoords[6] = {x: 1, y: -7};
    _exclBunkerCoords[7] = {x: 0, y: -8};
    _exclBunkerCoords[8] = {x: 7, y: -1};
    _exclBunkerCoords[9] = {x: 7, y: 0};
    _exclBunkerCoords[10] = {x: 7, y: 1};
    _exclBunkerCoords[11] = {x: 8, y: 0};
    _exclBunkerCoords[12] = {x: -7, y: -1};
    _exclBunkerCoords[13] = {x: -7, y: 0};
    _exclBunkerCoords[14] = {x: -7, y: 1};
    _exclBunkerCoords[15] = {x: -8, y: 0};

    RCL5ExtCoords = [];
    RCL5ExtCoords[0] = {x: -4, y: 2};
    RCL5ExtCoords[1] = {x: -3, y: 2};
    RCL5ExtCoords[2] = {x: -2, y: 3};
    RCL5ExtCoords[3] = {x: -1, y: 4};
    RCL5ExtCoords[4] = {x: 0, y: 5};
    RCL5ExtCoords[5] = {x: 2, y: 4};
    RCL5ExtCoords[6] = {x: 2, y: 3};
    RCL5ExtCoords[7] = {x: 3, y: 2};
    RCL5ExtCoords[8] = {x: 4, y: 1};
    RCL5ExtCoords[9] = {x: 5, y: 0};

    // Ramparts can be constructed using the OuterBunkerRoads array, with these additional positions to cover corners
    RCL5AdditionalRampartCoords = [];
    RCL5AdditionalRampartCoords[0] = {x: 2, y: -5};
    RCL5AdditionalRampartCoords[1] = {x: 5, y: -2};
    RCL5AdditionalRampartCoords[2] = {x: 5, y: +2};
    RCL5AdditionalRampartCoords[3] = {x: 2, y: 5};
    RCL5AdditionalRampartCoords[4] = {x: -2, y: 5};
    RCL5AdditionalRampartCoords[5] = {x: -5, y: 2};
    RCL5AdditionalRampartCoords[6] = {x: -5, y: -2};
    RCL5AdditionalRampartCoords[7] = {x: -2, y: -5};





    // Objects of energy sources, containing game id and empty adjacent tiles
    furthestSourceObject = {id: room.find(FIND_MY_SPAWNS)[0].pos.FindFurthestByPath(room.find(FIND_SOURCES)).id,
        emptyAdjacentTiles: EmptyTilesAroundCoord(room, room.find(FIND_MY_SPAWNS)[0].pos.FindFurthestByPath(room.find(FIND_SOURCES)).pos)};

    closestSourceObject = {id: room.find(FIND_MY_SPAWNS)[0].pos.findClosestByPath(room.find(FIND_SOURCES)).id,
        emptyAdjacentTiles: EmptyTilesAroundCoord(room, room.find(FIND_MY_SPAWNS)[0].pos.findClosestByPath(room.find(FIND_SOURCES)).pos)};

    // Object containing coords relative to center of bunker for construction
    buildingCoordsObject = {rcl2ExtCoors: RCL2ExtCoords, innerBunkerCircleCoords: InnerBunkerCircleCoords, innerToOuterBunkerRoads: InnerToOuterBunkerRoads, rcl3ExtCoors: RCL3ExtCoords
                            , outerBunkerRoads: OuterBunkerRoads, rcl4ExtCoors: RCL4ExtCoords, rcl5ExtCoors: RCL5ExtCoords, rcl5AdditionalRampartCoords: RCL5AdditionalRampartCoords};

    // Object containing coordinates of the center of the bunker
    buildCenterObject = {x: room.find(FIND_MY_SPAWNS)[0].pos.x + 1, y: room.find(FIND_MY_SPAWNS)[0].pos.y - 1, exclBunkerCoords: _exclBunkerCoords, minRampartHits: 0.01, minRampartThresholdHits: 0.005};

    // Object containing defence conditions
    defenceObject = {defcon: 4, hostileCreepTick: 0};

    // Object containing expansion quantities, initially empty
    expanionObject = {};
    
    roomObject = {name: room.name, rclLevel: room.controller.level, buildCenter: buildCenterObject, buildingCoords: buildingCoordsObject, 
    furthestSource: furthestSourceObject, closestSource: closestSourceObject, defence: defenceObject, expansion: expanionObject};
    
    Memory.ActiveRooms[Memory.ActiveRooms.length] = roomObject;
}

// Returns the number of "empty" tiles (i.e. not walls) around the parameter pos, used to see how many empty tiles around energy sources
function EmptyTilesAroundCoord(room, pos) {
    SurroundingCoords = [];
    SurroundingCoords[0] = {x: 0, y: -1};
    SurroundingCoords[1] = {x: 1, y: -1};
    SurroundingCoords[2] = {x: 1, y: 0};
    SurroundingCoords[3] = {x: 1, y: 1};
    SurroundingCoords[4] = {x: 0, y: 1};
    SurroundingCoords[5] = {x: -1, y: 1};
    SurroundingCoords[6] = {x: -1, y: 0};
    SurroundingCoords[7] = {x: -1, y: -1};

    const terrain = new Room.Terrain(room.name);
    var counter = 0;
    for(var i = 0; i < SurroundingCoords.length; i++) {
        if(terrain.get(pos.x + SurroundingCoords[i].x, pos.y + SurroundingCoords[i].y) != 1) {
            counter++;
        }
    }

    return counter;
}

module.exports = CreateRoomMemory;