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

        // This is temporary map data.
        const img_path = path.join(__dirname, image_path + "building_center.png");
        this.map_data.push(new Building({width: 6, height: 6}, {x: 500, y: 500}, img_path, 1, "building_center"));
    }

    setDefaultUserLocation(id) {
        this.user_location.set(id, {x: 490, y: 490});
    }

    // Get difference list, and update user information.
    getDiff(user_info) {
        const prev_list = getObjectList(this.user_location.get(user_info.id));
        const current_list = getObjectList(user_info.pos);

        this.user_location.set()

        return this.compute_diff(prev_list, current_list);
    }

    // Get nearby objects using position.
    getObjectList(pos) {
        var object_list = [];
        // Use key as 1000 * x + y.
        const x = Math.floor(pos.x);
        const y = Math.floor(pos.y);
        const point_key = 1000 * x + y;
        const consult = this.map.get(point_key);
        console.log(point_key);

        if (consult == undefined) {
            // Compute here.
            
            console.log("not cached yet");

            for (let [i, object] in this.map_data) {
                if (object.pos.x - 15 > x || object.pos.x + object.size.width + 15 < x) {
                    object_list.push(object);
                } 
                if (object.pos.y - 13 > y || object.pos.y + object.size.height + 13 < y) {
                    object_list.push(object);
                }
            }
            
            this.map.set(point_key, object_list);
        }
        else {
            console.log("cached..");
            object_list = consult;
        }

        return object_list;
    }

    compute_diff(prev_list, current_list) {
        var update_info = {
            add: [],
            delete: []
        };

        var overlap = [];

        for (let b2 in current_list) {
            var exists = false;
            for (let b1 in prev_list) {
                if (b1.id == b2.id) {
                    exists = true;
                }
            }
            if (exists) {
                overlap.push(b1.id);
            }
        }

        for (let b1 in prev_list) {
            for (let id in overlap) {
                if (b1.id != id) {
                    update_info.delete.push(b1);
                }
            }
        }
        for (let b2 in current_list) {
            for (let id in overlap) {
                if (b2.id != id) {
                    update_info.add.push(b2);
                }
            }
        }

        return update_info;
    }
}

exports.Cache = Cache;