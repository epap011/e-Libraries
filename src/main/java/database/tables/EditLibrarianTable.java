/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package database.tables;

import mainClasses.Librarian;
import com.google.gson.Gson;
import mainClasses.User;
import database.DB_Connection;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Student;

/**
 *
 * @author Mike
 */
public class EditLibrarianTable {

    public void addLibrarianFromJSON(String json) throws ClassNotFoundException {
        Librarian lib = jsonToLibrarian(json);
        addNewLibrarian(lib);
    }

    public Librarian jsonToLibrarian(String json) {
        Gson gson = new Gson();

        Librarian lib = gson.fromJson(json, Librarian.class);
        return lib;
    }

    public String librarianToJSON(Librarian lib) {
        Gson gson = new Gson();

        String json = gson.toJson(lib, Librarian.class);
        return json;
    }

    public void printLibrarianDetails(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians WHERE username = '" + username + "' AND password='" + password + "'");
            while (rs.next()) {
                System.out.println("===Result===");
                DB_Connection.printResults(rs);
            }

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }

    public Librarian databaseToLibrarian(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians WHERE username = '" + username + "' AND password='" + password + "'");
            rs.next();
            String json = DB_Connection.getResultsToJSON(rs);
            Gson gson = new Gson();
            Librarian lib = gson.fromJson(json, Librarian.class);
            return lib;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Librarian> databaseToLibrarians() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Librarian> librarians=new ArrayList<Librarian>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM librarians");
            while (rs.next()) {
                String json = DB_Connection.getResultsToJSON(rs);
                Gson gson = new Gson();
                Librarian lib = gson.fromJson(json, Librarian.class);
                librarians.add(lib);
            }
            return librarians;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void updateLibrarian(Librarian librarian) throws SQLException, ClassNotFoundException{
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String username = librarian.getUsername();

        System.out.println(username);

        String updateLibraryInfo = "UPDATE librarians SET libraryinfo='"+librarian.getLibraryinfo()+"' WHERE username = '"+username+"'";
        String updateLibraryName ="UPDATE librarians SET libraryname='"+librarian.getLibraryname()+"' WHERE username = '"+username+"'";
        String updatePassword = "UPDATE librarians SET password='"+librarian.getPassword()+"' WHERE username = '"+username+"'";
        String updateFirstName ="UPDATE librarians SET firstname='"+librarian.getFirstname()+"' WHERE username = '"+username+"'";
        String updateLastName ="UPDATE librarians SET lastname='"+librarian.getLastname()+"' WHERE username = '"+username+"'";
        String updateBirthday="UPDATE librarians SET birthdate='"+librarian.getBirthdate()+"' WHERE username = '"+username+"'";
        String updateGender="UPDATE librarians SET gender='"+librarian.getGender()+"' WHERE username = '"+username+"'";
        String updateCountry="UPDATE librarians SET country='"+librarian.getCountry()+"' WHERE username = '"+username+"'";
        String updateCity="UPDATE librarians SET city='"+librarian.getCity()+"' WHERE username = '"+username+"'";
        String updateAddress="UPDATE librarians SET address='"+librarian.getAddress()+"' WHERE username = '"+username+"'";
        String updatePersonalPage="UPDATE librarians SET personalpage='"+librarian.getPersonalpage()+"' WHERE username = '"+username+"'";
        String updateTelephone="UPDATE librarians SET telephone='"+librarian.getTelephone()+"' WHERE username = '"+username+"'";
        String updateLat="UPDATE librarians SET lat='"+librarian.getLat()+"' WHERE username = '"+username+"'";
        String updateLon="UPDATE librarians SET lon='"+librarian.getLon()+"' WHERE username = '"+username+"'";

        stmt.executeUpdate(updatePassword);
        stmt.executeUpdate(updateFirstName);
        stmt.executeUpdate(updateLastName);
        stmt.executeUpdate(updateBirthday);
        stmt.executeUpdate(updateGender);
        stmt.executeUpdate(updateCountry);
        stmt.executeUpdate(updateCity);
        stmt.executeUpdate(updateAddress);
        stmt.executeUpdate(updatePersonalPage);
        stmt.executeUpdate(updateTelephone);
        stmt.executeUpdate(updateLat);
        stmt.executeUpdate(updateLon);
        stmt.executeUpdate(updateLibraryInfo);
        stmt.executeUpdate(updateLibraryName);
    }

    public void createLibrariansTable() throws SQLException, ClassNotFoundException {

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE librarians"
                + "(library_id INTEGER not NULL AUTO_INCREMENT, "
                + "    username VARCHAR(30) not null unique,"
                + "    email VARCHAR(200) not null unique,	"
                + "    password VARCHAR(32) not null,"
                + "    firstname VARCHAR(30) not null,"
                + "    lastname VARCHAR(30) not null,"
                + "    birthdate DATE not null,"
                + "    gender  VARCHAR (7) not null,"
                + "    country VARCHAR(30) not null,"
                + "    city VARCHAR(50) not null,"
                + "    address VARCHAR(50) not null,"
                + "    libraryname VARCHAR(100) not null,"
                + "    libraryinfo VARCHAR(1000) not null,"
                + "    lat DOUBLE,"
                + "    lon DOUBLE,"
                + "    telephone VARCHAR(14),"
                + "    personalpage VARCHAR(200),"
                + " PRIMARY KEY (library_id))";
        stmt.execute(query);
        stmt.close();
    }

    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public void addNewLibrarian(Librarian lib) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " librarians (username,email,password,firstname,lastname,birthdate,gender,country,city,address,"
                    + "libraryname,libraryinfo,lat,lon,telephone,personalpage)"
                    + " VALUES ("
                    + "'" + lib.getUsername() + "',"
                    + "'" + lib.getEmail() + "',"
                    + "'" + lib.getPassword() + "',"
                    + "'" + lib.getFirstname() + "',"
                    + "'" + lib.getLastname() + "',"
                    + "'" + lib.getBirthdate() + "',"
                    + "'" + lib.getGender() + "',"
                    + "'" + lib.getCountry() + "',"
                    + "'" + lib.getCity() + "',"
                    + "'" + lib.getAddress() + "',"
                      + "'" + lib.getLibraryname()+ "',"
                   + "'" + lib.getLibraryinfo()+ "',"
                    + "'" + lib.getLat() + "',"
                    + "'" + lib.getLon() + "',"
                    + "'" + lib.getTelephone() + "',"
                   + "'" + lib.getPersonalpage()+ "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The libarian was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditLibrarianTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void deleteLibrarian(int id) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.getConnection();
            Statement stmt = con.createStatement();

            //First all the books of this librarian must be deleted

            String insertQuery = "DELETE FROM booksinlibraries WHERE library_id="+id;
            stmt.executeUpdate(insertQuery);

            insertQuery = "DELETE FROM librarians WHERE library_id="+id;
            stmt.executeUpdate(insertQuery);
            System.out.println("# The user was successfully deleted.");

            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditStudentsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
