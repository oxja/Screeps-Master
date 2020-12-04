// Returns index of room in Memory.ActiveRooms, if doesn't exist then returns -1
Room.prototype.FindRoomInMemory = function FindRoomInMemory() {

    for(var i = 0; i < Memory.ActiveRooms.length; i++) {
        if(Memory.ActiveRooms[i].name == this.name) {
            return i;
        }
    }

    return -1;
}

// Returns index of room in Memory.ActiveRooms[this.FindRoomInMemory()].expansion.adjacentRooms, if doesn't exist then returns -1
Room.prototype.FindAdjRoomIndexInExplorerMemory = function FindAdjRoomIndexInExplorerMemory(targetRoomName) {
    for(var i = 0; i < Memory.ActiveRooms[this.FindRoomInMemory()].expansion.adjacentRooms.length; i++) {
        if(targetRoomName == Memory.ActiveRooms[this.FindRoomInMemory()].expansion.adjacentRooms[i].roomName) {
            return i;
        }
    }

    return -1;
}