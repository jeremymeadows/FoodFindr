import { useCookies } from 'react-cookie';
//const [cookie, setCookie] = useCookies(['session']);

class User {
    constructor() {
        if (!User.user) {
            this.id = "";
            this.name = "";
            this.username = "";
            this.email = "";
            User.user = this;
        }
        return User.user;
    }
}
var user = new User();

export default user;
