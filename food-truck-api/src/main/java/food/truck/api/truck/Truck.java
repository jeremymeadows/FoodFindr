package food.truck.api.user;

public class Truck {
    private String id;
    private String name;
    private String description;
    private Float rating;
    private Float price;
    private String type;
    private String menu;

    public Truck(String id, String name, String description, Float rating, Float price, String type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.rating = rating;
		this.price = price;
		this.type = type;
        this.menu = "null";
    }
    public Truck(String id, String name, String description, Float rating, Float price, String type, String menu) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.rating = rating;
		this.price = price;
		this.type = type;
        this.menu = menu;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
    }

    public Float getRating() {
        return this.rating;
    }

    public String toString() {
        return ("{\"id\":\"" + this.id + "\"," +
            "\"name\":\"" + this.name + "\"," +
            "\"description\":\"" + this.description + "\"," +
            "\"rating\":" + this.rating + "," +
            "\"price\":" + this.price + "," +
            "\"type\":\"" + this.type +"\"," +
            "\"menu\":\"" + this.menu + "\"}"
        );
    }
}
