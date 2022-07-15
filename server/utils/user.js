class Users {
    constructor() {
        this.current_id = 10000;
    }

    assign() {
        this.current_id += 1;
        return this.current_id;
    }
}

exports.Users = Users;