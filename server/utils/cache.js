const objects = require('./objects');
const Building = objects.BuildingObj;
const Point = objects.Point;

const path = require('path');
const image_path = "../client/forest-of-kaist/public/images/"

class Cache {
    constructor() {
        this.map = new Map();
        this.map_data = [];
        // Stores truncated position.
        // ex) If user's actual location is (1.4, 2.5), it has (1, 2)
        this.user_location = new Map();
    }

    // Get nearby buildings.
    get(user_info) {
        // MEMO: user_info.id should not be null here.
        var update_info = {
            add: [],
            delete: []
        };
        // Use key as 1000 * x + y.
        const x = Math.floor(user_info.pos.x);
        const y = Math.floor(user_info.pos.y);
        const point_key = 1000 * x + y;
        const consult = this.map.get(point_key);
        console.log(point_key);
        if (consult == undefined) {
            // Compute here.
            
            console.log("not cached yet");

            const img_path = path.join(__dirname, image_path + "building_center.png")
            const test_b = new Building({width: 6, height: 6}, {x: 490, y: 490}, img_path, "building_center");

            update_info.add.push(test_b);
            this.map.set(point_key, building_list);
        }
        else {
            console.log("cached..");
            building_list = consult;
        }
        this.user_location.set(user_info.id, {x: x, y: y});

        return update_info;
    }

}

exports.Cache = Cache;