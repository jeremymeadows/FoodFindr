package food.truck.api;

import java.sql.*;

public class Database {
    private static Database singleton = null;

    private static Connection con;
    private static Statement st;

    private Database() throws SQLException {
        con = DriverManager.getConnection(
            // "jdbc:mysql://food-truck-finder-database.herokuapp.com/",
            "jdbc:mysql://127.0.0.1:3307/food-truck-finder",
            "root",
            "password"
        );
        st = con.createStatement(
            ResultSet.TYPE_SCROLL_INSENSITIVE,
            ResultSet.CONCUR_READ_ONLY
        );
    };

    public static Database get() throws SQLException {
        if (singleton == null) {
            singleton = new Database();
        }

        return singleton;
    }

    public static void close() throws SQLException {
        get().con.close();
        singleton = null;
    }

    public static ResultSet query(String q) throws SQLException {
        return get().st.executeQuery(q);
    }

    public static int update(String q) throws SQLException {
        return get().st.executeUpdate(q);
    }
}
