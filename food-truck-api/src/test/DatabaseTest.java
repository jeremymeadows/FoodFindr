import food.truck.api.Database;
import org.junit.jupiter.*;

public class DatabaseTest {
    @Test
    public void queryTest() {
        Database test = Database();

        assert(!test.query("").next());
    }
}