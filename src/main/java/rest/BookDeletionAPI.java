package rest;

import database.tables.EditBooksTable;
import mainClasses.Book;

import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.ArrayList;

@Path("bookdeletion")
public class BookDeletionAPI{

    @DELETE
    @Path("/{isbn}/")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response deleteBookWithISBN(@PathParam("isbn") String isbn) {
        Response.Status status = Response.Status.OK;
        ArrayList<Book> books;
        try {
            books = new EditBooksTable().databaseToBooks();
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }

        boolean bookDeleted = false;
        for (Book book : books) {
            if(book.getIsbn().equals(isbn)) {
                try {
                    new EditBooksTable().deleteBook(isbn);
                    bookDeleted = true;
                    break;
                } catch (SQLException | ClassNotFoundException e) {
                    throw new RuntimeException(e);
                }

            }
        }

        if(bookDeleted){
            return Response.status(status).type("application/json").entity("{\"success\":\"rest.Book Deleted\"}").build();
        }
        else{
            return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"rest.Book Does not Exists\"}").build();
        }
    }
}
