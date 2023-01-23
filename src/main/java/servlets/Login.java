package servlets;

import java.io.IOException;
import java.sql.SQLException;

import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import database.tables.GeneralQueries;
import mainClasses.Librarian;
import mainClasses.Student;
import mainClasses.User;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "Login", value = "/Login")
public class Login extends HttpServlet {

    @Override
    public void init(){
        Resources.initRecourses();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();

        response.setContentType("text/html;charset=UTF-8");
        if(session.getAttribute("loggedIn") != null){
            System.out.println("Session exists");
            response.setStatus(200);

            User user = Resources.registeredUsers.get(session.getAttribute("loggedIn").toString());
            if(user instanceof Student) {
                String studentJson = new EditStudentsTable().studentToJSON((Student) user);
                response.getWriter().write(studentJson);
            }
            else if(user instanceof Librarian) {
                String librarianJson = new EditLibrarianTable().librarianToJSON((Librarian) user);
                response.getWriter().write(librarianJson);
            }
            else {
                response.getWriter().write("admin");
            }
        }
        else{
            System.out.println("Session not exists");
            response.setStatus(403);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        HttpSession session = request.getSession();
        GeneralQueries generalQueries = new GeneralQueries();

        response.setContentType("text/html;charset=UTF-8");
        if (Resources.registeredUsers.containsKey(username)) {
            System.out.println("Username " + username + " is a registered user");
            if (Resources.registeredUsers.get(username).getPassword().equals(password)) {
                System.out.println("Password of " + username + " is OK");
                session.setAttribute("loggedIn", username);
                response.setStatus(200);
                User user = Resources.registeredUsers.get(username);
                if(user instanceof Student) {
                    String studentJson = new EditStudentsTable().studentToJSON((Student) user);
                    response.getWriter().write(studentJson);
                }
                else if(user instanceof Librarian) {
                    String librarianJson = new EditLibrarianTable().librarianToJSON((Librarian) user);
                    response.getWriter().write(librarianJson);
                }
                else {
                    response.getWriter().write("admin");
                }
            } else {
                System.out.println("Password of " + username + " is Wrong");
                response.setStatus(403);
            }
        } else {
            System.out.println("Refreshing local registered users..");
            try {
                if(generalQueries.isUsernameStudent(username)) {
                    Student student = new EditStudentsTable().databaseToStudent(username, password);
                    Resources.registeredUsers.put(username, student);
                    session.setAttribute("loggedIn", username);
                    response.setStatus(200);
                }
                else if(generalQueries.isUsernameLibrarian(username)) {
                    Librarian librarian = new EditLibrarianTable().databaseToLibrarian(username, password);
                    Resources.registeredUsers.put(username, librarian);
                    session.setAttribute("loggedIn", username);
                    response.setStatus(200);
                }
                else {
                    response.setStatus(403);
                }
            } catch (SQLException | ClassNotFoundException e) {
                response.setStatus(403);
            }
        }
    }
}