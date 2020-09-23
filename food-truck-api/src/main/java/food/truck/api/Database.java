package food.truck.api;

import java.sql.*;

public class Database {
    private static Database singleton = null;

    private static Connection con;
    private static Statement st;

    private Database() throws SQLException {
        con = DriverManager.getConnection(
            "jdbc:mariadb://localhost:3306",
            "root",
            "seven725"
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
