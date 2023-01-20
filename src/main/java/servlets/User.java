package servlets;

import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;

import java.io.IOException;
import java.sql.SQLException;

import database.tables.GeneralQueries;
import mainClasses.Librarian;
import mainClasses.Student;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "User", value = "/User")
public class User extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int statusCode = 403;
        boolean isUsernameStudent;
        boolean isUsernameLibrarian;

        response.setContentType("text/html;charset=UTF-8");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        GeneralQueries generalQueries = new GeneralQueries();
        try {
            isUsernameStudent   = generalQueries.isUsernameStudent(username);
            isUsernameLibrarian = generalQueries.isUsernameLibrarian(username);

            if(isUsernameStudent) {
                EditStudentsTable eut  = new EditStudentsTable();
                Student su = eut.databaseToStudent(username, password);
                if (su != null) {
                    String json = eut.studentToJSON(su);
                    response.getWriter().println(json);
                    statusCode = 200;
                }
            }
            else if(isUsernameLibrarian) {
                EditLibrarianTable eut  = new EditLibrarianTable();
                Librarian lib = eut.databaseToLibrarian(username, password);
                if (lib != null) {
                    String json = eut.librarianToJSON(lib);
                    response.getWriter().println(json);
                    statusCode = 200;
                }
            }
            response.setStatus(statusCode);
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}