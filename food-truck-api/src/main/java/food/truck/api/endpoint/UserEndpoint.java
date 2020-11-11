package food.truck.api.endpoint;

import static food.truck.api.FoodTruckApplication.logger;
import food.truck.api.Database;
import java.sql.*;
import java.util.ArrayList;
import java.util.logging.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public String getUserSubscriptions(@PathVariable String id) {
        String json = "[";
        boolean empty = true;
        try {
            ResultSet r = Database.query("SELECT truck_id FROM subscriptions WHERE user_id='" + id + "';");
            while (r.next()) {
                empty = false;
                json = json + "\"" + r.getString("truck_id") + "\",";
            }
            if (!empty) {
                json = json.substring(0, json.length() - 1);
            }
            json = json + "]";

            logger.log(Level.INFO, json);
            return json;
        } catch (SQLException ex) {
            logger.log(Level.WARNING, ex.toString());
        }

        return "user not found";
    }

    @CrossOrigin(origins="*")
    @PostMapping("/trucks/subscribe")
    public String subscribeToTruck(@RequestBody String id) {
        try {
            Database.update("INSERT INTO ")

        } catch(SQLException ex) {
            logger.log(Level.WARNING, "database query failed");
            return "";
        }
    }

    @CrossOrigin(origins="*")
    @PostMapping("/dashboard/messages")
    public String getMessages(@RequestBody String email) {
        try {
            logger.log(Level.INFO, email);
            logger.log(Level.INFO, "SELECT messageContent FROM inbox, users WHERE recipientID = users.user_id" +
                    " and users.email = '" + email + "';");
            ResultSet r = Database.query("SELECT messageContent FROM inbox, users WHERE recipientID = users.user_id" +
                    " and users.email = '" + email + "';");
            String message = "";
            while (r.next()) {
                message += r.getString("messageContent") + ";";
            }
            return message;
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "database query failed");
            return "";
        }
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
    @PostMapping("/manageaccount/username")
    public String editUsername(@RequestBody String new_username) {

        String[] fields = new_username.split(";");
        String email = fields[0];
        String newUsername = fields[1];

        logger.log(Level.INFO, "creating new username " + email);
        try {
            //Set email new user using update
            String qry = "UPDATE users SET username='" + newUsername + "' WHERE email='" + email + "';";
            logger.log(Level.INFO, qry);
            Database.update(qry);
            
            ResultSet r = Database.query("SELECT * FROM users WHERE email='" + email + "';");
            if (r.next()) {
                String id = r.getString("user_id");
                String uname = r.getString("username");
                int owner = r.getInt("owner");

                logger.log(Level.INFO, uname + " changed");
                return uname + ';' + email + ';' + id + ';' + owner;
            } else {
                return "user not found";
            }
            //return email + '_' + Integer.toHexString((id + passw).hashCode());

            //  ResultSet r = Database.query("SELECT username, user_id FROM users WHERE email='" + email + "';");

            //return email + '_' + Integer.toHexString((newUsername).hashCode());
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "database update failed");
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }

    @CrossOrigin(origins="*")
    @PostMapping("/dashboard/ownercheck")
    public String isOwner(@RequestBody String email){
        try{
            // Query the database for if email is owner
            ResultSet r = Database.query("SELECT owner FROM users WHERE email='" + email + "';");

            if(r.next()){
                String owner = r.getString("owner");

                // Return if owner
                return owner;
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
    @PatchMapping("/dashboard/message")
    public String sendmessage(@RequestBody String owner_message) {
        String[] fields = owner_message.split(";");
        String message = fields[0];
        String id = fields[1];

        logger.log(Level.INFO, "sending message " + message + " to truck " + id + " subscribers");
        try {
            ResultSet r = Database.query("SELECT user_id FROM subscriptions WHERE truck_id LIKE '" + id + "';");
            ArrayList<String> recipients = new ArrayList<String>();
            // Go through every row of the result set
            while (r.next()) {
                // Store every message recipient into an array list from the result set
                String recipient_id = r.getString("user_id");
                recipients.add(recipient_id);
            }

            // For every recipient, store the recipient and message into the inbox table
            for(String r_ID : recipients){
                Database.update("INSERT INTO inbox (recipientID, " +
                        "messageContent) VALUES ('" + r_ID +
                        "', '" + message + "');");
            }
            return "Notification [" + message + "] sent.";
        } catch(SQLException ex) {
            logger.log(Level.WARNING, "message send failed");
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }
    /*
    @CrossOrigin(origins="*")
    @PatchMapping("/dashboard/getmessage")
    public String showmessage(@RequestBody String email) {

        logger.log(Level.INFO, "getting message for " + recipientID + " subscriber");
        try {
            String recipientID = Database.query("SELECT user_id FROM users WHERE email='" + email + "';");
            ResultSet r = Database.query("SELECT messageContent FROM subscriptions WHERE recipientID LIKE '" + recipientID + "';");
            String messages = "";
            while (r.next()) {
                // Store every message recipient into an array list from the result set
                String message = r.getString("messageContent");
                messages += message + ";";
            }
            return messages;
        } catch(SQLException ex) {
            logger.log(Level.WARNING, "message retrieval failed");
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }*/

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
                int owner = r.getInt("owner");

                logger.log(Level.INFO, uname + " authenticated");
                return uname + ';' + email + ';' + id + ';' + owner;
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
            return uname + ';' + email + ';' + id + ';' + isOwner;
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "database update failed");
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }


    @CrossOrigin(origins="*")
    @PostMapping("/getOwnership/")
    public String getOwnership(@RequestBody String email){
        try{
            logger.log(Level.INFO, "email is: " + email);
            ResultSet r = Database.query("SELECT owner FROM users WHERE email='" + email + "';");
            if(r.next()) {
                String isOwner = r.getString("owner");
                logger.log(Level.INFO, isOwner);
                return isOwner;
            }
        }
        catch(SQLException ex){
            logger.log(Level.WARNING, "fetching from database failed");
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
        return "";
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
