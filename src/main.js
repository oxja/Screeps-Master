let creepLogic = require('./creeps');
let rumOverseerLogic = require('./overminds');
let roomLogic = require('./room');
let prototypes = require('./prototypes');


module.exports.loop = function () {

    // Helps with differentiating between which logs are "from" each tick
    console.log("-----------------------------");

    // Array of all fully controlled rooms
    Game.myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);

    // Only executes code when memory has been initialised, which is seen when certain aspect of memory is undefined
    if(Memory.ActiveRooms == undefined) {

        // Sets up Memory.ActiveRooms
        Memory.ActiveRooms = [];
        _.forEach(Game.myRooms, r => roomLogic.memoryInit(r));

    } else {
        // Updates memory / environment to match demands of each room
        _.forEach(Game.myRooms, r => rumOverseerLogic.OverseeRoom(r));

        // Runs each creep function, specific job usualy decided in that function
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];

            let role = creep.memory.role;
            if (creepLogic[role]) {
                creepLogic[role].run(creep);
            }
        }

        // Deletes all dead creeps from memory
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }


}