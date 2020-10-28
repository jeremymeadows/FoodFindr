import React, { Component } from 'react';

class User extends Component {
    static user = new User();
    // static cookie;

    constructor() {
        super();

        if (!User.user) {
            this.id = "";
            this.name = "";
            this.username = "";
            this.email = "";
            User.user = this;
        }
        return User.user;
    }

    render() {
        return (
            <div></div>
        )
    }
}
// const user = new User();

export default User.user;
// export default User.cookie;