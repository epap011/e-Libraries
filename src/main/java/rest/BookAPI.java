package rest;

import com.google.gson.Gson;
import database.tables.EditBooksTable;
import mainClasses.Book;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.ArrayList;

@Path("book")
public class BookAPI {

    public BookAPI() {}

    @POST
    @Path("/")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addBook(String jsonBook) throws SQLException, ClassNotFoundException {
        Gson gson = new Gson();
        Book newBook = gson.fromJson(jsonBook, Book.class);
        ArrayList<Book> books = new EditBooksTable().databaseToBooks();

        if(newBook.getIsbn().length() != 10 && newBook.getIsbn().length() != 13)
            return Response.status(Response.Status.CONFLICT).type("application/json").entity("{\"error\":\"ISBN should be 10 or 13 digits\"}").build();

        if(newBook.getPages() <= 0)
            return Response.status(Response.Status.CONFLICT).type("application/json").entity("{\"error\":\"Pages should be greater than 0\"}").build();

        if(newBook.getPublicationyear() < 1200)
            return Response.status(Response.Status.CONFLICT).type("application/json").entity("{\"error\":\"Publication Year should >= 1200\"}").build();

        if(!newBook.getUrl().startsWith("http") || !newBook.getPhoto().startsWith("http"))
            return Response.status(Response.Status.CONFLICT).type("application/json").entity("{\"error\":\"Links should start with http\"}").build();

        for (Book book: books) {
            if(book.getIsbn().equals(newBook.getIsbn())) {
                return Response.status(Response.Status.CONFLICT).type("application/json").entity("{\"error\":\"Book Exists\"}").build();
            }
        }

        new EditBooksTable().addBookFromJSON(jsonBook);
        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Book Added\"}").build();
    }
}
