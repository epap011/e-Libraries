package servlets;

import java.io.IOException;
import java.sql.SQLException;

import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import mainClasses.JSON_Converter;
import mainClasses.Librarian;
import mainClasses.Student;
import mainClasses.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "UpdateUser", value = "/UpdateUser")
public class UpdateUser extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSON_Converter jsonConverter = new JSON_Converter();
        String json = jsonConverter.getJSONFromAjax(request.getReader());
        System.out.println(json);
        HttpSession session = request.getSession();
        if(session.getAttribute("loggedIn") != null) {
            System.out.println("Session exists, update can happen!");
            User user = Resources.registeredUsers.get(session.getAttribute("loggedIn").toString());
            try {
                if (user instanceof Student) {
                    System.out.println("mpika");
                    EditStudentsTable est = new EditStudentsTable();
                    Student student = est.jsonToStudent(json);
                    student.setUsername(session.getAttribute("loggedIn").toString());
                    System.out.println("Username: " + student.getUsername() + " student_type: " + student.getStudent_type());
                    Resources.registeredUsers.replace(student.getUsername(), student);
                    System.out.println("Student Update completed");
                    response.setStatus(200);
                    response.setContentType("application/json; charset=UTF-8");
                    est.updateStudent(student);
                } else if (user instanceof Librarian) {
                    EditLibrarianTable elt = new EditLibrarianTable();
                    Librarian librarian = elt.jsonToLibrarian(json);
                    librarian.setUsername(session.getAttribute("loggedIn").toString());
                    Resources.registeredUsers.replace(librarian.getUsername(), librarian);
                    System.out.println("Librarian Update completed");
                    response.setStatus(200);
                    response.setContentType("application/json; charset=UTF-8");
                    elt.updateLibrarian(librarian);
                }
                else {
                    System.out.println("no student / no librarian");
                    response.setStatus(403);
                }

            } catch (ClassNotFoundException | SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
