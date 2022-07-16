class Users {
    constructor() {
        this.current_id = 10000;

        // user_id -> user (includes position, size, ...)
        this.user_info = new Map();

        // user_id -> socket_id
        this.sockets = new Map();
    }

    assign() {
        this.current_id += 1;
        return this.current_id;
    }

    updateLocation(user) {
        this.user_info.set(user.id, user);
    }

    getSocket(user_id) {
        return this.sockets.get(user_id);
    }

    setSocket(user_id, socket_id) {
        this.sockets.set(user_id, socket_id);
    }

    // Returns list of socket id's.
    getNearbyUsers(user_id) {
        var socket_list = [];

        this.user_info.forEach((user_id, user_info) => {
            socket_list.push()
        })
    }
    
    // Compute if target is located near source.
    isNearby(target, source) {
        
    }
}

exports.Users = Users;