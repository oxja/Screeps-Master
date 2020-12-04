RoomPosition.prototype.FindFurthestByPath = function FindFurthestByPath(objList) {

    if(!objList) {
        return -1;
    }

    var indexOfFurthestObject = 0;
    var furthestDistance = 0;
    for(var i = 0; i < objList.length; i++) {
        var pathlength = Game.rooms[this.roomName].findPath(this, objList[i].pos, {ignoreCreeps: true}).length;
        if(pathlength > furthestDistance) {
            indexOfFurthestObject = i;
            furthestDistance = pathlength;
        }
    }

    return objList[indexOfFurthestObject];
}