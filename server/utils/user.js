class Users {
    constructor() {
        this.current_id = 10000;

        // Stores currently online user information.
        // user_id -> user (includes position, size, ...)
        this.user_info = new Map();

        // Stores currently online users' socket id's.
        // user_id -> socket_id
        this.sockets = new Map();

        // It's like graph. Stores neighbor relationship of currently online users.
        // user_id -> ListOfUserId
        this.user_neighbors = new Map();
    }

    assign() {
        this.current_id += 1;
        return this.current_id;
    }

    getUser(user_id) {
        return this.user_info.get(user_id);
    }

    setUserInfo(user) {
        // console.log(`setUserInfo: ${user.id}, ${user.pos.x}, ${user.pos.y}`);
        this.user_info.set(user.id, user);
    }

    getSocket(user_id) {
        return this.sockets.get(user_id);
    }

    setSocket(user_id, socket_id) {
        console.log(`setSocket(${user_id}, ${socket_id})`);
        this.sockets.set(user_id, socket_id);
    }

    // Returns list of user_id's.
    computeNeighbors(user) {
        // console.log(`computeNeighbors of ${user.id}`);
        var user_list = [];

        this.user_info.forEach((neigh_info, neigh_id) => {
            if (this.isNeighbor(user, neigh_info)) {
                user_list.push(neigh_id);
            }
        });

        // console.log(`   Result was ${user_list}`);

        return user_list;
    }
    
    // Compute if target is located near source.
    isNeighbor(target, source) {
        // console.log(`   isNeighbor: ${target.id}, ${source.id}`);
        // console.log(`       target: ${target.pos.x}, ${target.pos.y}, ${target.size.width}, ${target.size.height}`);
        // console.log(`       source: ${source.pos.x}, ${source.pos.y}, ${source.size.width}, ${source.size.height}`);

        if (target.id == source.id) {
            // console.log("same id~");
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

        // console.log(`       ${source.pos.x}, ${target.pos.x + target.size.width + 20}`);
        // console.log(`       Boolean is.. ${v1}, ${v2}, ${v3}, ${v4}`);

        const value = v1 && v2 && v3 && v4;

        return value;
    }

    // Update neighbors information, and returns appropriate tags.
    updateNeighbors(user) {
        var previous_neighbors = this.user_neighbors.get(user.id);
        if (previous_neighbors == undefined) {
            previous_neighbors = [];
        }
        const new_neighbors = this.computeNeighbors(user);

        var instruction_set = [];
        var vanishing = [];
        var overlap = [];
        var emerging = [];

        // Collect overlapping ones.
        // Users captured here would receive "move" type message.
        // It means: I was neighbor, am neighbor now, but just moved.
        previous_neighbors.forEach((id1) => {
            new_neighbors.forEach((id2) => {
                if (id1 == id2) {
                    overlap.push(id1);
                    instruction_set.push({
                        type: "move",
                        target: id1,
                        user: user
                    });
                }
            });
        });

        // Collect vanishing ones.
        // Users captured here would receive "delete" type message.
        // It means: I am no longer your neighbor.
        previous_neighbors.forEach((id1) => {
            var exists = false;
            overlap.forEach((id2) => {
                if (id1 == id2) {
                    exists = true;
                }
            });
            if (!exists && id1 != user.id) {
                vanishing.push(id1);
                instruction_set.push({
                    type: "delete",
                    target: id1,
                    user: user
                });
            }
        });

        // Collect new ones.
        // Users captured here would receive "add" type message.
        // It means: I am now your neighbor.
        new_neighbors.forEach((id1) => {
            var exists = false;
            overlap.forEach((id2) => {
                if (id1 == id2) {
                    exists = true;
                }
            });
            if (!exists && id1 != user.id) {
                emerging.push(id1);
                instruction_set.push({
                    type: "add",
                    target: id1,
                    user: user
                });
            }
        });

        // Now.. update values.
        this.user_neighbors.set(user.id, new_neighbors);

        vanishing.forEach((id) => {
            var prev_list = this.user_neighbors.get(id);
            if (prev_list == undefined) {
                prev_list = [];
            }
            prev_list = prev_list.filter(neigh_id => neigh_id != id);
            this.user_neighbors.set(user.id, prev_list);
        })

        emerging.forEach((id) => {
            var prev_list = this.user_neighbors.get(id);
            if (prev_list == undefined) {
                prev_list = [];
            }
            prev_list.push(user.id);
            this.user_neighbors.set(id, prev_list);
        });
        
        return instruction_set;
    }

    getUserIdFromSocket(socket_id) {
        var id = undefined;
        this.sockets.forEach((sock, uid) => {
            if (sock.toString() === socket_id.toString()) {
                id = uid;
            }
        });
        return id;
    }

    // Cleans up resources of socket id.
    // Additionally, sends delete to all users.
    cleanUp(socket_id) {
        const id = this.getUserIdFromSocket(socket_id);
        this.sockets.delete(id);

        if (id === undefined) {
            console.log("That socket does not exist")
            return;
        }
        console.log(`User ${id} disconnected.`);

        const user = this.user_info.get(id);
        this.user_info.delete(id);

        // remove entry of this.user_neighbors

        const neighbors = this.user_neighbors.get(id);
        
        neighbors.forEach((neigh_id) => {
            var neigh_list = this.user_neighbors.get(neigh_id);
            neigh_list = neigh_list === undefined ? [] : neigh_list.filter(myid => myid != id);
            this.user_neighbors.set(neigh_id, neigh_list);
        });
        this.user_neighbors.delete(id);

        return user;
    }
}

exports.Users = Users;