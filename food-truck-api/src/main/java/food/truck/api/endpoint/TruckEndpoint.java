package food.truck.api.endpoint;

import static food.truck.api.FoodTruckApplication.logger;
import food.truck.api.Database;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.*;

import org.h2.util.json.JSONString;
import org.h2.util.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import food.truck.api.user.Truck;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
public class TruckEndpoint {
    // TODO: CrossOrigin * is not secure, but it is easy to configure. It should be changed to the react server when it is running up on Heroku

    @CrossOrigin(origins="*")
    @GetMapping("/truck/{id}")
    public String findTruckById(@PathVariable String id) {
        try {
            ResultSet r = Database.query("SELECT * FROM trucks WHERE truck_id='" + id + "';");
            if (r.next()) {
                String name = r.getString("name");
                String description = r.getString("description");
                Float rating = r.getFloat("rating");

                Truck t = new Truck(id, name, description, rating);

                logger.log(Level.INFO, t.toString());
                return t.toString();
            }
        } catch (SQLException ex) {
            logger.log(Level.WARNING, "user #" + id + " not found");
        }

        return "truck not found";
    }

    @CrossOrigin(origins="*")
    @GetMapping("/trucks")
    public String getTrucks() {
        String json = "[";
        try {
            ResultSet r = Database.query("SELECT * FROM trucks WHERE truck_id LIKE '%';");
            while (r.next()) {
                String id = r.getString("truck_id");
                String name = r.getString("name");
                String description = r.getString("description");
                Float rating = r.getFloat("rating");

                Truck t = new Truck(id, name, description, rating);
                logger.log(Level.INFO, t.toString());
                json = json + t.toString() + ",";
            }
        } catch (SQLException ex) {
            logger.log(Level.WARNING, ex.toString());
        }
        json = json.substring(0, json.length() - 1) + "]";
        logger.log(Level.INFO, json);
        return json;
    }

    @CrossOrigin(origins="*")
    @GetMapping("/trucks/locations")
    public String getTrucksWithLocations() {
        String list = "[";
        try {
            ResultSet rs = Database.query("SELECT truck_id, location FROM trucks WHERE location IS NOT NULL;");
            while(rs.next()){
                list = list.concat("\"" + rs.getString("truck_id") + "\",\"");
                list = list.concat(rs.getString("location") + "\",");
            }
            list = list.substring(0, list.length()-1);
            list = list.concat("]");
            return list;
        }
        catch(SQLException ex){
            logger.log(Level.WARNING, ex.toString());
        }

        return null;
    }

    @CrossOrigin(origins="*")
    @GetMapping("/truck/{name}")
    public String findTruckByName(@PathVariable String name) {
        String json = "[";
        try {
            ResultSet r = Database.query("SELECT * FROM trucks WHERE name='" + name + "';");
            while (r.next()) {
                String description = r.getString("description");
                Float rating = r.getFloat("rating");
                String id = r.getString("truck_id");

                Truck t = new Truck(id, name, description, rating);

                logger.log(Level.INFO, t.toString());
                json = json + t.toString() + ",";
            }
        } catch (SQLException ex) {
            logger.log(Level.WARNING, ex.toString(), "truck " + name + " not found");
        }
        return "";
    }


    // this method has the same signature as the one below it, and didn't look like it was being used

     @CrossOrigin(origins="*")
     @PostMapping("/trucks/manage")
     public String manageTruck(@RequestBody String truck_cred) {
         //var truck_cred = truck.name + ';' + description + ';' + rating;


        String[] fields = truck_cred.split(";");
        String name = fields[0]; //truck.getName()
        String description = fields[1]; //truck.getDescription()
        String rating = fields[2]; //truck.getRating();
        String id = fields[3];

        logger.log(Level.INFO, "updating truck " + name);
        try {
            String qry = "UPDATE trucks SET name='" + name + "', description='" + description +
                     "', rating='" + rating + "' WHERE truck_id='" + id + "';";
            logger.log(Level.INFO, qry);
            Database.update(qry);
            return name + '_' + Integer.toHexString((id).hashCode()) + '_' + description + '_' + rating;

        } catch (SQLException ex) {
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }

    @CrossOrigin(origins="*")
    @PostMapping("/trucks/searchTrucks")
    public String searchTruck(@RequestBody String search_cred) {
        //var truck_cred = truck.name + ';' + description + ';' + rating;

        String json = "[";
        String[] fields = search_cred.split(";");
        String name = fields[0]; //truck.getName()
        String range = fields[1]; //truck.getDescription()


        logger.log(Level.INFO, "searching truck " + name);
        try {
            if (name != null) {
                ResultSet r = Database.query("SELECT * FROM trucks WHERE name='" + name + "';");
                if (r.next()) {
                    String description = r.getString("description");
                    Float rating = r.getFloat("rating");
                    String id = r.getString("truck_id");

                    Truck t = new Truck(id, name, description, rating);

                    logger.log(Level.INFO, t.toString());
                    json = json + t.toString() + ",";
                }
            }
            if (range != null) {
                ResultSet r = Database.query("SELECT * FROM trucks;");
                while (r.next()) {
                    name = r.getString("name");
                    String description = r.getString("description");
                    Float rating = r.getFloat("rating");
                    String id = r.getString("truck_id");

                    Truck t = new Truck(id, name, description, rating);

                    logger.log(Level.INFO, t.toString());
                    json = json + t.toString() + ",";
                }
            }

        } catch (SQLException ex) {
            logger.log(Level.WARNING, ex.toString());
        }
        json = json.substring(0, json.length() - 1) + "]";
        logger.log(Level.INFO, json);
        return json;
    }

    @CrossOrigin(origins="*")
    @PutMapping("/trucks/create")
    public String createTruck(@RequestBody String truck_cred) {
        String[] fields = truck_cred.split(";");
        String name = fields[0]; //truck.getName()
        String description = fields[1]; //truck.getDescription()
        float rating = Float.parseFloat(fields[2]); //truck.getRating();
        String id = Integer.toHexString(name.hashCode()).substring(0, 4); // generate truck id

        logger.log(Level.INFO, "changing truck " + name + " data");
        try {
            String qry = "INSERT INTO trucks (truck_id, name, description, rating) VALUES('" +
              id + "','" +
              name + "','" +
              description + "'," +
              rating + ");";
            logger.log(Level.INFO, qry);
            Database.update(qry);

            return name + '_' + Integer.toHexString((id).hashCode()) + '_' + description + '_' + rating;
        } catch (SQLException ex) {
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }

    @CrossOrigin(origins="*")
    @PostMapping("/trucks/schedule")
    public String manageSchedule(@RequestBody String truck_cred) {
        //var truck_cred = truck.name + ';' + description + ';' + rating;


        String[] fields = truck_cred.split(";");
        String id = fields[0]; //truck.getName()
        String schedule = fields[1]; //truck.getDescription()

        logger.log(Level.INFO, "updating truck schedule " + id);
        try {
            String qry = "UPDATE trucks SET schedule='" + schedule + "' WHERE truck_id='" + id + "';";
            logger.log(Level.INFO, qry);
            Database.update(qry);
            return Integer.toHexString((id).hashCode()) + '_' + schedule;

        } catch (SQLException ex) {
            logger.log(Level.WARNING, ex.toString());
            return "";
        }
    }
    // @CrossOrigin(origins="*")
    // @PostMapping("/truck")
    // public Truck saveTruck(@RequestBody Truck user) {
    //     return null;
    // }
}
