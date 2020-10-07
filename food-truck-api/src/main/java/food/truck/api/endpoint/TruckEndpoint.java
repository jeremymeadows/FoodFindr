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

import food.truck.api.user.Truck;

@RestController
public class TruckEndpoint {
    @Autowired
    // TODO: CrossOrigin * is not secure, but it is easy to configure. It should be changed to the react server when it is running up on Heroku

    // @CrossOrigin(origins="*")
    // @GetMapping("/test/truck/{id}")
    // public String truckIdTest(@PathVariable String id) {
    //     try {
    //         ResultSet r = Database.query("SELECT * FROM trucks WHERE truck_id='" + id + "';");
    //         if (r.next()) {
    //             String email = r.getString("email") + '\n';
    //             logger.log(Level.INFO, email);
    //             return email;
    //         }
    //     } catch (SQLException ex) {
    //         logger.log(Level.WARNING, "user #" + id + " not found");
    //     }
    //
    //     return "truck not found";
    // }
    //
    // @CrossOrigin(origins="*")
    // @GetMapping("/truck/{id}")
    // public Truck findTruckById(@PathVariable Long id) {
    //     return null;
    // }

    @CrossOrigin(origins="*")
    @GetMapping("/trucks")
    public String getTrucks() {
        return "{ id: 1, name: 'truck1' }";
    }

    // @CrossOrigin(origins="*")
    // @PostMapping("/truck")
    // public Truck saveTruck(@RequestBody Truck user) {
    //     return null;
    // }
}
