class Others {
    constructor() {
        // object_id -> object. (object should contain id, pos, size, type)
        this.others_info = new Map();
        this.others_id = 100000;

        this.goose_count = 0;
        this.goose_speed = 0.1;
        this.goose_value = 100;

        // user_id -> object_id[] 
        this.others_neighbors = new Map();
    }

    randomInt(min, max) {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
        return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
    }

    // Returns list of geese from others_info.
    getGeeseList() {
        var list = [];
        this.others_info.forEach((object, id) => {
            if (object.type == "goose") {
                list.push(object);
            }
        });
        // console.log(`getGeeseList(): ${list.length} geese`)
        return list;
    }

    // Upgrades geese speed.
    upgradeGeese() {
        this.goose_speed += 0.1;
        switch (this.goose_value) {
            case 100:
                this.goose_value = 1000;
                break;
            case 1000:
                this.goose_value = 2500;
                break;
            case 2500:
                this.goose_value = 5000;
                break;
            case 5000:
                this.goose_value = 10000;
                break;
            default:
                throw Error(`${this.goose_value}`)
        }
    }

    gooseValue() {
        return this.goose_value;
    }

    // Create new goose and return it.
    // If there are already more than 10 geese, return undefined.
    generateGoose() {
        if (this.goose_count >= 10) {
            return undefined;
        }

        this.goose_count += 1;
        this.others_id += 1;
        const goose_id = this.others_id;

        const goose = {
            id: goose_id,
            pos: {x: this.randomInt(60, 80), y: this.randomInt(40, 60)},
            size: {width: 1, height: 1},
            type: "goose",
            img: "/images/goose/goose_down_1.png",
            speed: this.goose_speed
        };

        this.others_info.set(goose_id, goose);

        return goose;
    }

    // Remove goose from field.
    // About money: it should be handled in 'index.js', not here.
    removeGoose(goose_id) {
        this.others_info.delete(goose_id);
        this.goose_count -= 1;
    }

    // Move geese in random direction, and returns list of updated position of geese.
    moveGeese() {
        const geese_list = this.getGeeseList();

        geese_list.forEach((goose) => {
            var pos = goose.pos;
            var img = goose.img;
            const limit = [60, 80, 40, 60];

            var in_limit = false;
            while (!in_limit) {
                const direction = this.randomInt(0, 4);
                switch (direction) {
                    case 0:         // Left
                        if (pos.x - goose.speed > limit[0]) {
                            in_limit = true;
                            pos.x = pos.x - goose.speed;
                            if (img == '/images/goose/goose_left_1.png') {
                                img = '/images/goose/goose_left_2.png';
                            }
                            else {
                                img = '/images/goose/goose_left_1.png';
                            }
                        }
                        break;
                    case 1:         // Up
                        if (pos.y - goose.speed > limit[2]) {
                            in_limit = true;
                            pos.y = pos.y - goose.speed;
                            if (img == '/images/goose/goose_up_1.png') {
                                img = '/images/goose/goose_up_2.png';
                            }
                            else {
                                img = '/images/goose/goose_left_1.png';
                            }
                        }
                        break;
                    case 2:         // Right
                        if (pos.x + goose.speed < limit[1]) {
                            in_limit = true;
                            pos.x = pos.x + goose.speed;
                            if (img == '/images/goose/goose_right_1.png') {
                                img = '/images/goose/goose_right_2.png';
                            }
                            else {
                                img = '/images/goose/goose_right_1.png';
                            }
                        }
                        break;
                    case 3:         // Down
                        if (pos.y + goose.speed < limit[3]) {
                            in_limit = true;
                            pos.y = pos.y + goose.speed;
                            if (img == '/images/goose/goose_down_1.png') {
                                img = '/images/goose/goose_down_2.png';
                            }
                            else {
                                img = '/images/goose/goose_down_1.png';
                            }
                        }
                        break;
                    default:
                        throw Error("?!");
                }
            }

            goose.pos = pos;
            goose.img = img;
            // new_list.push(goose);
            this.others_info.set(goose.id, goose);
        });

        // return new_list;
    }

    // Collect nearby objects near user, from this.others_info.
    getNearbyObjects(user) {
        var nearby_list = [];
        this.others_info.forEach((object, goose_id) => {
            if (this.isNearby(object, user)) {
                nearby_list.push(object);
            }
        });
        return nearby_list;
    }

    // Compute if target is near source.
    isNearby(target, source) {
        if (source == undefined) {
            return false;
        }
        const target_x = parseFloat(target.pos.x);
        const target_y = parseFloat(target.pos.y);
        const target_width = parseFloat(target.size.width);
        const target_height = parseFloat(target.size.height);
        const source_x = parseFloat(source.pos.x);
        const source_y = parseFloat(source.pos.y);
        const source_width = parseFloat(source.size.width);
        const source_height = parseFloat(source.size.height);

        const v1 = (source_x <= target_x + target_width + 20);
        const v2 = (source_x + source_width > target_x - 20);
        const v3 = (source_y <= target_y + target_height + 15);
        const v4 = (source_y + source_height > target_y - 15);

        return v1 && v2 && v3 && v4;
    }

    // Return list of objects which should be added, moved, or deleted.
    getDiff(user) {
        // console.log(`getDiff(${user.id})`);
        var prev_list = this.others_neighbors.get(user.id);
        if (prev_list == undefined) {
            // console.log(`undefined..`);
            prev_list = [];
        }
        const new_list = this.getNearbyObjects(user);
        var mod_set = {
            add: [],
            move: [],
            delete: []
        };
        var overlap = [];

        prev_list.forEach((id1) => {
            new_list.forEach((o2) => {
                if (id1 == o2.id) {
                    // console.log(`move this: ${id1}`);
                    overlap.push(id1);
                    mod_set.move.push(o2);
                }
            });
        });

        prev_list.forEach((id1) => {
            var exists = false;
            overlap.forEach((id2) => {
                if (id1 == id2) {
                    exists = true;
                }
            });
            if (!exists) {
                // console.log(`delete this: ${id1}`)
                const value = this.others_info.get(id1);
                if (value != null) {
                    mod_set.delete.push(this.others_info.get(id1));
                }
                
            }
        });

        new_list.forEach((o1) => {
            var exists = false;
            overlap.forEach((id2) => {
                if (o1.id == id2) {
                    exists = true;
                }
            });
            if (!exists) {
                // console.log(`add this: ${o1.id}`)
                mod_set.add.push(this.others_info.get(o1.id));
            }
        });

        var new_ids = [];
        new_list.forEach((obj) => {
            new_ids.push(obj.id);
        });
        this.others_neighbors.set(user.id, new_ids);


        return mod_set;
    }
}

exports.Others = Others;