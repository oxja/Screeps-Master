// TODO - Repairing (if more efficient), healing friendly creeps, only attacking if economically worthwhile
function controlTower(tower) {

    const repairRoadTarget = tower.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax * 0.9 && s.structureType == STRUCTURE_ROAD });
    const hostileCreep = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if(hostileCreep) {
        tower.attack(hostileCreep);
    }
    if(repairRoadTarget) {
        tower.repair(repairRoadTarget);
    }
        
}

module.exports = controlTower;