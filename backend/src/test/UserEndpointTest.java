package food.truck.api.endpoint.UserEndpoint
import org.junit.jupiter.*;

public class UserEndpointTest {
    @Test
    public void getInfoTest() {
        UserEndpoint test = UserEndpoint();

        assertEquals(test.getInfo(""), "", "passing an empty email should retrieve an empty string");
    }

    @Test
    public void isOwnerTest() {
        User test = UserEndpoint();

        assertEquals(test.isOwner(""), "0", "passing an empty user should retrieve a non-owner");
    }
}