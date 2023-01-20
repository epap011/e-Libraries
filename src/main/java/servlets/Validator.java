package servlets;

import database.tables.EditStudentsTable;
import database.tables.GeneralQueries;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "Validator", value = "/Validator")
public class Validator extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username  = request.getParameter("username");
        String email     = request.getParameter("email");
        String studentID = request.getParameter("student_id");

        if(username != null)       handleUsernameValidation(response, username);
        else if(email != null)     handleEmailValidation(response, email);
        else if(studentID != null) handleStudentIDValidation(response, studentID);

    }

    private void handleUsernameValidation(HttpServletResponse response, String username) throws ServletException, IOException{
        GeneralQueries gq = new GeneralQueries();

        try {
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            if(gq.usernameExistsAtDatabase(username)) {
                System.out.println("Username " + username +  " exists");
                response.setStatus(403);
                out.print("username already exists");
            } else {
                System.out.println("Username " + username +  " not exists");
                response.setStatus(200);
                out.print("username is free to use");
            }
            out.flush();
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    private void handleEmailValidation(HttpServletResponse response, String email) throws ServletException, IOException {
        GeneralQueries gq = new GeneralQueries();

        try {
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            if(gq.emailExistsAtDatabase(email)) {
                System.out.println("Email " + email +  " exists");
                response.setStatus(403);
                out.print("email already exists");
            } else {
                System.out.println("Email " + email +  " not exists");
                response.setStatus(200);
                out.print("email is free to use");
            }
            out.flush();
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    private void handleStudentIDValidation(HttpServletResponse response, String studentID) throws ServletException, IOException {
        EditStudentsTable eut = new EditStudentsTable();

        try {
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            if(eut.studentIDExistsAtDatabase(studentID)) {
                System.out.println("StudentID " + studentID +  " exists");
                response.setStatus(403);
                out.print("student id already exists");
            } else {
                System.out.println("StudentID " + studentID +  " not exists");
                response.setStatus(200);
                out.print("student id is free to use");
            }
            out.flush();
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}