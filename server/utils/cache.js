const objects = require('./objects');
const Building = objects.BuildingObj;
const Point = objects.Point;

const path = require('path');
const image_path = "../../client/forest-of-kaist/public/images/"

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
        // console.log("OK, default.");
        this.user_location.set(id, {x: 490, y: 490});
    }

    // Get difference list, and update user information.
    getDiff(user_info) {
        const prev_pos = this.user_location.get(user_info.id);
        const current_pos = user_info.pos;
        const prev_list = this.getObjectList(prev_pos);
        const current_list = this.getObjectList(current_pos);

        if (prev_pos != undefined) {
            this.user_location.set(user_info.id, user_info.pos);
        }
        else {
            return {
                add: [],
                delete: []
            };
        }

        if (Math.floor(prev_pos.x) == Math.floor(current_pos.x)
             && Math.floor(prev_pos.y) == Math.floor(current_pos.y)) {
            return {
                add: [],
                delete: []
            }
        }

        return this.computeDiff(prev_list, current_list);
    }

    // Get nearby objects using position.
    getObjectList(pos) {
        if (pos == undefined) {
            return this.map_data;
        }
        var object_list = [];
        // Use key as 1000 * x + y.
        const x = Math.floor(pos.x);
        const y = Math.floor(pos.y);
        const point_key = 1000 * x + y;
        const consult = this.map.get(point_key);
        console.log(point_key);

        if (consult == undefined) {
            for (const object of this.map_data) {
                if ((x > object.pos.x - 15 && x < object.pos.x + object.size.width + 15)
                    && y > object.pos.y - 13 && y < object.pos.y + object.size.height + 13) {
                    object_list.push(object);
                }
            }
            
            this.map.set(point_key, object_list);
        }
        else {
            object_list = consult;
        }
        // console.log(object_list);
        return object_list;
    }

    computeDiff(prev_list, current_list) {
        // console.log("computeDiff prev: ", prev_list);
        // console.log("computeDiff curr: ", current_list);

        var update_info = {
            add: [],
            delete: []
        };

        var overlap = [];

        for (const b2 of current_list) {
            var exists = false;
            for (const b1 of prev_list) {
                if (b1.id == b2.id) {
                    exists = true;
                    break;
                }
            }
            if (exists) {
                overlap.push(b2.id);
            }
        }
        // console.log("overlap: ", overlap);

        prev_list.forEach(i1 => {
            var exists = false;
            overlap.forEach(i2 => {
                if (i1.id == i2) {
                    exists = true;
                }
            });
            if (!exists) {
                update_info.delete.push(i1);
            }
        });

        current_list.forEach(i1 => {
            var exists = false;
            overlap.forEach(i2 => {
                if (i1.id == i2) {
                    exists = true;
                }
            });
            if (!exists) {
                update_info.add.push(i1);
            }
        })

        // for (const b1 of prev_list) {
        //     for (const id of overlap) {
        //         if (b1.id != id) {
        //             console.log(b1);
        //             update_info.delete.push(b1);
        //         }
        //     }
        // }
        // for (const b2 in current_list) {
        //     for (const id in overlap) {
        //         if (b2.id != id) {
        //             console.log(b2);
        //             update_info.add.push(b2);
        //         }
        //     }
        // }
        // console.log(update_info);
        return update_info;
    }
}

exports.Cache = Cache;