package rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.ArrayList;

import com.google.gson.Gson;
import database.tables.EditBooksInLibraryTable;
import database.tables.EditBorrowingTable;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import mainClasses.BookInLibrary;
import mainClasses.Borrowing;
import mainClasses.Librarian;
import mainClasses.Student;

@Path("availability")
public class BookAvailability {

    public BookAvailability() {}

    @PUT
    @Path("/")
    @Produces({MediaType.APPLICATION_JSON})
    public Response changeAvailabilityOfBook(@Context HttpServletRequest request,
                                             @QueryParam("isbn") String isbn,
                                             @QueryParam("availability") Boolean availability) throws SQLException, ClassNotFoundException {

        HttpSession session = request.getSession();
        EditLibrarianTable elt = new EditLibrarianTable();
        Librarian librarian = elt.databaseToLibrarian((String)session.getAttribute("loggedIn"));
        Integer librarianID = librarian.getLibrary_id();

        try {
            EditBooksInLibraryTable editBooksInLibraryTable = new EditBooksInLibraryTable();
            editBooksInLibraryTable.updateAvailabilityBookInLibrary(String.valueOf(librarianID), availability, isbn);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"error\":\"book's availability didn't change\"}").build();
        }
        catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"book's availability didn't change\"}").build();
        }
    }

    @GET
    @Path("/copyId")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentBorrowings(@Context HttpServletRequest request,
                                         @QueryParam("id") String id) throws SQLException, ClassNotFoundException {
        System.out.println("availability resource has been invoked");
        try {
            BookInLibrary book = new EditBooksInLibraryTable().databaseToBookInLibraryBookId(id);
            String json = new Gson().toJson(book);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } catch(Exception e) {
            System.err.println(e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"review didnt add\"}").build();
        }
    }

    @GET
    @Path("/isbn")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getBooksIsbn(@Context HttpServletRequest request,
                                         @QueryParam("isbn") String isbn) throws SQLException, ClassNotFoundException {
        System.out.println("availability getBooksIsbn resource has been invoked");
        try {
            BookInLibrary book = new EditBooksInLibraryTable().databaseToBookInLibraryIsbn(isbn);
            String json = new Gson().toJson(book);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } catch(Exception e) {
            System.err.println(e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"review didnt add\"}").build();
        }
    }
}