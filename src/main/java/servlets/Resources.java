/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import mainClasses.Librarian;
import mainClasses.Student;
import mainClasses.User;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class Resources {
    static HashMap<String, User> registeredUsers = new HashMap<>();

    public static void initRecourses() {
        ArrayList<Librarian> librarians;
        ArrayList<Student> students;

        try {
            librarians = new EditLibrarianTable().databaseToLibrarians();
            students   = new EditStudentsTable().databaseToStudents();

            for (Student student: students) {
                registeredUsers.put(student.getUsername(), student);
            }

            for (Librarian librarian: librarians) {
                registeredUsers.put(librarian.getUsername(), librarian);
            }
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}