let towerLogic = require('../towers');

/** Function to specify creep jobs depending on the environment, e.g. hostile creeps present
  * or unfinsihed construction sites
  **/
function AllocateCreeps(room) {

    // Checks whether any adjacent rooms are "active" for remove harvesting
    var roomIsRemoteHarvesting = false;
    if(Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms != undefined) {
        for(var i = 0; i < Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms.length; i++) {
            if(Memory.ActiveRooms[room.FindRoomInMemory()].expansion.adjacentRooms[i].activeRemoteHarv == true) {
                roomIsRemoteHarvesting = true;
                break;
            }
        }
    }


    // Constants for number of worker "targets"
    const constructionTargets = room.find(FIND_CONSTRUCTION_SITES);
    const repairRoadTargets = room.find(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * 0.5 && s.structureType == STRUCTURE_ROAD });
    const repairRampartTargets = room.find(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.minRampartThresholdHits && s.structureType == STRUCTURE_RAMPART });
    // Constants for room defence
    const defcon = Memory.ActiveRooms[room.FindRoomInMemory()].defence.defcon;

    // ------------------------------------------------------------
    //                       CREEP ALLOC.
    // ------------------------------------------------------------


    // Finds all worker creeps "belonging" to such room and allows the ability to filter them by their current job
    var workerList = _(Game.creeps).filter(function(c) {return c.memory.role == 'worker' && c.memory.defaultRoom == room.name}).value();
    var listOfWorkerJobs = ['upgrade', 'repair', 'build', 'repairRoad', 'repairRampart', 'remoteHarv'];
    var numberOfCreeps = {};
    for (var job of listOfWorkerJobs) {
        numberOfCreeps[job] = _.sum(workerList, (c) => c.memory.job == job);
    }
    
    // Prints list of number of creeps
    console.log("Num workers: " + workerList.length);
    console.log("Num upgraders:" + numberOfCreeps['upgrade']);
    console.log("Num builders:" + numberOfCreeps['build']);
    console.log("Num repairRoad:" + numberOfCreeps['repairRoad']);
    console.log("Num repairRampart:" + numberOfCreeps['repairRampart']);
    console.log("Num remoteHarv:" + numberOfCreeps['remoteHarv']);

    // Allocates creep labour depending on environment
    for(let worker of workerList) {

        if(defcon == 4) {
            if(Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.controllerLinkActive) {
                // TODO, defence of room when links active. Ideally want creeps safe in ramparts
                // to continue, other creeps to do standard
            }
            if(numberOfCreeps['upgrade'] == 0) {
                worker.memory.job = 'upgrade';
            } else if(numberOfCreeps['upgrade'] == 1 && worker.memory.job == 'upgrade') {
                worker.memory.job = 'upgrade';
    
            } else if(numberOfCreeps['remoteHarv'] == 0 && roomIsRemoteHarvesting) {
                worker.memory.job = 'remoteHarv';
            } else if(numberOfCreeps['remoteHarv'] == 1 && worker.memory.job == 'remoteHarv' && roomIsRemoteHarvesting) {
                worker.memory.job = 'remoteHarv';
    
            } else if(numberOfCreeps['repairRoad'] < 1 && repairRoadTargets.length > 0) {
                worker.memory.job = 'repairRoad';
            } else if(repairRoadTargets.length > 0 && worker.memory.job == 'repairRoad') {
                worker.memory.job = 'repairRoad';
                
            } else if(repairRampartTargets.length > 0) {
                worker.memory.job = 'repairRampart';
            } else if(worker.memory.job == 'repairRampart') {
                worker.memory.job = 'repairRampart';
            } 
            
            else if(constructionTargets.length > 0) {
                worker.memory.job = 'build';
            } else {
                worker.memory.job = 'upgrade';
            }
        } else {
            if(room.controller.level >= 4) { // Defence oriented around storage
                const distanceToBunkerCenter = worker.pos.findPathTo(Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.x, Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.y, {ignoreCreeps: true}).length;
                if(distanceToBunkerCenter < 8 && !creepInExclBunkerCoords(worker, room)) { // If worker is inside bunker
                    worker.memory.job = "defensiveRepair";
                } else {
                    worker.memory.job = "moveInsideBunker";
                }
            } else {
                // TODO, handle room defence when RCL < 4
            }

        }


        // Updates values
        for (var job of listOfWorkerJobs) {
            numberOfCreeps[job] = _.sum(workerList, (c) => c.memory.job == job);
        }
    }


    // Finds all transfer creeps "belonging" to such room and allows the ability to filter them by their current job
    var transferList = _(Game.creeps).filter(function(c) {return c.memory.role == 'transfer' && c.memory.defaultRoom == room.name}).value();
    var listOfTransferJobs = ['defaultTransfer', 'hostileTransfer'];
    var numberOfCreeps = {};
    for (var job of listOfTransferJobs) {
        numberOfCreeps[job] = _.sum(transferList, (c) => c.memory.job == job);
    }

    for(let transfer of transferList) {
        if(defcon == 4) {
            transfer.memory.job = "defaultTransfer";
        } else {
            transfer.memory.job = "hostileTransfer";
        }
    }

    
    // Finds all miner creeps "belonging" to such room and allows the ability to filter them by their current job
    var minerList = _(Game.creeps).filter(function(c) {return c.memory.role == 'miner' && c.memory.defaultRoom == room.name}).value();
    var listOfMinerJobs = ['defaultMine', 'hostileMine'];
    var numberOfCreeps = {};
    for (var job of listOfMinerJobs) {
        numberOfCreeps[job] = _.sum(minerList, (c) => c.memory.job == job);
    }

    for(let miner of minerList) {
        if(defcon == 4) {
            miner.memory.job = "defaultMine";
        } else {
            miner.memory.job = "moveInsideBunker";
        }
    }



    // ------------------------------------------------------------
    //                       TOWER ALLOC.
    // ------------------------------------------------------------

    const towers = room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_TOWER});
    _.forEach(towers, r => towerLogic.towerController(r));

}

// Returns true if creep is in the "bunker", false otherwise
function creepInExclBunkerCoords(creep, room) {
    const roomIndexInMemory = room.FindRoomInMemory();

    for(var i = 0; i < Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.exclBunkerCoords.length; i++) {
        var tmpRoomPos = new RoomPosition(Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.x + Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.exclBunkerCoords[i].x, Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.y + Memory.ActiveRooms[room.FindRoomInMemory()].buildCenter.exclBunkerCoords[i].y, room.name);
        if(tmpRoomPos == creep.pos) {
            return true;
        }
    }

    return false;
}

module.exports = AllocateCreeps;