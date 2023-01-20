package servlets;

import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import mainClasses.JSON_Converter;
import mainClasses.Librarian;
import mainClasses.Student;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "PostUser", value = "/PostUser")
public class PostUser extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSON_Converter jsonConverter = new JSON_Converter();
        String json = jsonConverter.getJSONFromAjax(request.getReader());

        String userType = request.getParameter("user_type");
        try {
            if(userType.equals("student")) {
                EditStudentsTable est = new EditStudentsTable();
                est.addStudentFromJSON(json);
                response.setStatus(200);
                response.setContentType("application/json; charset=UTF-8");
                Student student = est.jsonToStudent(json);
                response.getWriter().println(est.studentToJSON(student));
            } else {
                EditLibrarianTable elt = new EditLibrarianTable();
                elt.addLibrarianFromJSON(json);
                response.setStatus(200);
                response.setContentType("application/json; charset=UTF-8");
                Librarian librarian = elt.jsonToLibrarian(json);
                response.getWriter().println(elt.librarianToJSON(librarian));
            }

        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
