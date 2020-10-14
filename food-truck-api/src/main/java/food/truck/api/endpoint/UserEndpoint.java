package food.truck.api.endpoint;

import static food.truck.api.FoodTruckApplication.logger;
import food.truck.api.Database;
import java.sql.*;
import java.util.logging.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import food.truck.api.user.User;
import food.truck.api.user.UserService;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    // TODO: CrossOrigin * is not secure, but it is easy to configure. It should be changed to the react server when it is running up on Heroku

    @CrossOrigin(origins="*")
    @PostMapping("/test/user/{id}")
    public String userIdTest(@PathVariable Long id) {
        try {
            ResultSet r = Database.query("SELECT * FROM users WHERE user_id='" + id + "';");
            if (r.next()) {
                String email = r.getString("email") + '\n';
                logger.log(Level.INFO, email);
                return email;
            }
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "user #" + id + " not found");
        }

        return "user not found";
    }

    @CrossOrigin(origins="*")
    @GetMapping("/user/{id}")
    public User findUserById(@PathVariable Long id) {
        var user = userService.findUser(id);
        return user.orElse(null);
    }



    @CrossOrigin(origins="*")
    @PostMapping("/dashboard")
    public String getInfo(@RequestBody String email){
        try{
            // Query the database for the username and user_id of the associated email
            ResultSet r = Database.query("SELECT username, email, owner FROM users WHERE email='" + email + "';");

            // Look at the only result from the result set
            if(r.next()){
                // Assign the result's values for username and user_id to strings
                String username = r.getString("username");
                String email_address = r.getString("email");
                String owner = r.getString("owner");

                // Return the strings with a semi-colon delimiter between the two
                return username + ';' + email_address + ';' + owner;
            }
            // If there was no result in the set
            else{
                // Log that there was no user associated to the email
                logger.log(Level.INFO, "no user associated to " + email);
                return "";
            }

        }catch(SQLException ex){
            logger.log(Level.WARNING, "database query failed");
            return "";
        }
    }

    @CrossOrigin(origins="*")
    @PostMapping("/manageaccount")
    public String editPassword(@RequestBody String new_login) {

        String[] fields = new_login.split(";");
        String email = fields[0];
        String newPassword = fields[1];
        String oldPassword = fields[2];

        if (login(email + ';' + oldPassword) == "") {
            logger.log(Level.INFO, "wrong old password");
            return "";
        }

        logger.log(Level.INFO, "creating new password " + email);
        try {

            //Set email new password using update
            String qry = "UPDATE users SET password='" + newPassword + "' WHERE email='" + email + "';";
            logger.log(Level.INFO, qry);
            Database.update(qry);
            //return email + '_' + Integer.toHexString((id + passw).hashCode());

          //  ResultSet r = Database.query("SELECT username, user_id FROM users WHERE email='" + email + "';");

            return email + '_' + Integer.toHexString((newPassword).hashCode());
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "database update failed");
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }


    @CrossOrigin(origins="*")
    @PostMapping("/user")
    public User saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @CrossOrigin(origins="*")
    @PostMapping("/login")
    public String login(@RequestBody String cred) {
        int delim = cred.indexOf(';');
        String email = cred.substring(0, delim);
        String passw = cred.substring(delim + 1, cred.length());

        logger.log(Level.INFO, "logging in " + email);
        try {
            ResultSet r = Database.query("SELECT * FROM users WHERE email='" + email + "' AND password='" + passw + "';");
            if (r.next()) {
                String id = r.getString("user_id");
                String uname = r.getString("username");
                logger.log(Level.INFO, uname + " authenticated");
                return email + '_' + Integer.toHexString((id + passw).hashCode());
            } else {
                logger.log(Level.WARNING, email + " was not authenticated");
                return "";
            }
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "database query failed");
            return "";
        }
    }

    @CrossOrigin(origins="*")
    @PostMapping("/register")
    public String register(@RequestBody String cred) {
        String id = Integer.toHexString(cred.hashCode()).substring(0, 8);

        String[] fields = cred.split(";");
        String email = fields[0];
        String uname = fields[1];
        String passw = fields[2];
        String owner = fields[3];

        int isOwner = 0;
        if(owner.equals("true")) isOwner = 1;

        if (login(email + ';' + passw) != "") {
          logger.log(Level.INFO, "account already exists");
          return "";
        }

        logger.log(Level.INFO, "registering " + email);
        try {
            String qry = "INSERT INTO users (user_id, email, username, password, owner) VALUES('" +
              id + "','" +
              email + "','" +
              uname + "','" +
              passw + "'," +
              isOwner + ");";
            logger.log(Level.INFO, qry);
            Database.update(qry);
            return email + '_' + Integer.toHexString((id + passw).hashCode());
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "database update failed");
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }

    @CrossOrigin(origins="*")
    @PostMapping("/autologin")
    public String autologin(@RequestBody String cookie) {
        String[] fields = cookie.split("_");
        String email = fields[0];
        String hash = fields[1];

        try {
            ResultSet r = Database.query("SELECT * FROM users WHERE email='" + email + "';");
            if (r.next()) {
                if (Integer.toHexString((r.getString("id") + r.getString("password")).hashCode()).equals(hash)) {
                    return hash;
                }
            }
        } catch (SQLException ex) {
        } finally {
            return "";
        }
    }
}
