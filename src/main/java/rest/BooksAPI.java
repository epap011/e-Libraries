package rest;

import com.google.gson.Gson;
import database.tables.EditBooksTable;
import mainClasses.Book;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

@Path("books")
public class BooksAPI {

    public BooksAPI() {}

    @GET
    @Path("/{genre}/")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response getBooksWithGenre(@PathParam("genre") String genre,
                                      @QueryParam("fromYear") String fromYear,
                                      @QueryParam("toYear") String toYear) throws SQLException, ClassNotFoundException {

        if(fromYear != null && (Integer.parseInt(fromYear) <= 1200)) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"fromYear should be greater than 1200\"}").build();
        }
        if(toYear != null && (Integer.parseInt(toYear) <= 1200)) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"toYear should be greater than 1200\"}").build();
        }
        if(fromYear != null && toYear != null) {
            if(Integer.parseInt(fromYear) > Integer.parseInt(toYear)) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"toYear should be smaller than fromYear\"}").build();
            }
        }


        ArrayList<mainClasses.Book> books;
        if(genre.equals("all")) {
            books = new EditBooksTable().databaseToBooks();
        } else {
            books = new EditBooksTable().databaseToBooks(genre);
        }

        if(fromYear != null) {
            books.removeIf(b -> b.getPublicationyear() < Integer.parseInt(fromYear));
        }

        if(toYear != null) {
            books.removeIf(b -> b.getPublicationyear() > Integer.parseInt(toYear));
        }

        if (!books.isEmpty()) {
            Collections.sort(books, (b1, b2) -> b2.getGenre().compareTo(b1.getGenre()));
            String json = new Gson().toJson(books);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }
}
