package rest;

import com.google.gson.Gson;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import mainClasses.Student;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.ArrayList;

@Path("user")
public class User {

    public User() {}

    @GET
    @Path("/student")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentAccounts() throws SQLException, ClassNotFoundException {
        ArrayList<mainClasses.Student> students;
        students = new EditStudentsTable().databaseToStudents();

        System.out.println("student invoked");

        if (!students.isEmpty()) {
            String json = new Gson().toJson(students);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }

    @GET
    @Path("/info")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentInfo(@Context HttpServletRequest request) throws SQLException, ClassNotFoundException {
        System.out.println("student invoked");
        HttpSession session = request.getSession();

        try {
            EditStudentsTable est = new EditStudentsTable();
            Student student = est.databaseToStudent((String)session.getAttribute("loggedIn"));
            Gson gson = new Gson();
            String json = gson.toJson(student);

            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        }catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }

    @GET
    @Path("/librarian")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getLibrarianAccounts() throws SQLException, ClassNotFoundException {
        ArrayList<mainClasses.Librarian> librarians;
        librarians = new EditLibrarianTable().databaseToLibrarians();

        if (!librarians.isEmpty()) {
            String json = new Gson().toJson(librarians);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }

    @DELETE
    @Path("/student/{id}/")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response deleteStudentAccount(@PathParam("id") int id) throws SQLException, ClassNotFoundException {
        EditStudentsTable studentsEditTable = new EditStudentsTable();

        studentsEditTable.deleteStudent(id);
        try {
            return Response.status(Response.Status.OK).type("application/json").entity("{\"status\":\"Student was successfully deleted\"}").build();
        } catch (Exception e){
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"status\":\"Student's deletion failed\"\"}").build();
        }
    }

    @DELETE
    @Path("/librarian/{id}/")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response deleteLibrarianAccount(@PathParam("id") int id) throws SQLException, ClassNotFoundException {
        EditLibrarianTable editLibrarianTable = new EditLibrarianTable();

        editLibrarianTable.deleteLibrarian(id);
        try {
            return Response.status(Response.Status.OK).type("application/json").entity("{\"status\":\"Student was successfully deleted\"}").build();
        } catch (Exception e){
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"status\":\"Student's deletion failed\"\"}").build();
        }
    }

}
