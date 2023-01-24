package rest;

import com.google.gson.Gson;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;

import javax.ws.rs.*;
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
}
