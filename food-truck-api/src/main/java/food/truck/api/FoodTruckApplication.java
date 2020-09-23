package food.truck.api;

import java.sql.SQLException;
import java.util.logging.*;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FoodTruckApplication {
    public static Logger logger = LogManager.getLogManager().getLogger(Logger.GLOBAL_LOGGER_NAME);

    public static void main(String[] args) {
        try {
          Database.get();
          logger.log(Level.INFO, "connected to database");
        } catch (SQLException ex) {
          logger.log(Level.SEVERE, "database connection failed");
          System.err.println(ex);
          System.exit(0);
        }

        SpringApplication.run(FoodTruckApplication.class);
    }
}
