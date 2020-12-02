import food.truck.api.endpoint.TruckEndpoint;
import org.junit.jupiter.*;

public class TruckEndpointTest {
    @Test
    public void reviewTest() {
        TruckEndpoint test = TruckEndpoint();

        assertEquals(test.review(""), "", "Giving empty review should return a failure");
    }

    @Test
    public void createTruckTest() {
        TruckEndpoint test = TruckEndpoint();

        assertEquals(test.createTruck(""), "", "Giving empty truck cred should return failure");
    }
}
