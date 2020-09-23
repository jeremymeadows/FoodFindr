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
    @GetMapping("/test/user/{id}")
    public String userIdTest(@PathVariable Long id) {
        try {
            ResultSet r = Database.query("SELECT * FROM users WHERE user_id=" + id + ";");
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
                String uname = r.getString("username");
                logger.log(Level.INFO, uname + " authenticated");
                return uname;
            } else {
                logger.log(Level.WARNING, email + " was not authenticated");
                return "";
            }
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "database query failed");
            return "";
        }
    }
}
