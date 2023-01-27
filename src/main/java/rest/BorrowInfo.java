package rest;

import com.google.gson.Gson;
import database.tables.EditBooksInLibraryTable;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import mainClasses.BookInLibrary;
import mainClasses.Librarian;
import mainClasses.Student;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.ArrayList;

@Path("borrow-info")
public class BorrowInfo {

    @GET
    @Path("/{isbn}")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentAccounts(@PathParam("isbn") String isbn) throws SQLException, ClassNotFoundException {
        System.out.println("borrow-info resource has been invoked with isbn: " + isbn);
        try {
            EditBooksInLibraryTable ebil = new EditBooksInLibraryTable();
            EditLibrarianTable elt = new EditLibrarianTable();
            ArrayList<BookInLibrary> booksInLibraries = ebil.databaseToBookInLibraries();
            ArrayList<Librarian> availableLibrariesOfBook = new ArrayList<>();
            for (BookInLibrary book : booksInLibraries) {
                if(book.getIsbn().equals(isbn) && book.getAvailable().equals("true")) {
                    availableLibrariesOfBook.add(elt.databaseToLibrarian(book.getLibrary_id()));
                }
            }
            String JSONAvailableLibrarians = new Gson().toJson(availableLibrariesOfBook);
            System.out.println(JSONAvailableLibrarians);
            return Response.status(Response.Status.OK).type("application/json").entity(JSONAvailableLibrarians).build();
        } catch(Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Borrow info didnt retrieve\"}").build();
        }
    }
}