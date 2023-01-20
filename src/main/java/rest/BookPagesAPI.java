package rest;

import database.tables.EditBooksTable;
import mainClasses.Book;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.ArrayList;

@Path("bookpages")
public class BookPagesAPI {

    public BookPagesAPI() {}

    @PUT
    @Path("/{isbn}/{pages}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBookPages(@PathParam("isbn") String isbn, @PathParam("pages") int pages, @HeaderParam("Accept") String acceptHeader) {
        //HashMap<String, Book> books = Resources.getBooks();
        ArrayList<Book> books;
        try {
            books = new EditBooksTable().databaseToBooks();
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

        if (pages <= 0) {
            return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"Pages must be greater than 0\"}").build();
        }

        boolean bookExists = false;
        for (Book book : books) {
            if(book.getIsbn().equals(isbn)) {
                bookExists = true;
                break;
            }
        }

        if (bookExists) {
            try {
                new EditBooksTable().updateBookPages(isbn, pages);
            } catch (SQLException | ClassNotFoundException e) {
                throw new RuntimeException(e);
            }
        }
        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Pages Updated\"}").build();
    }
}
