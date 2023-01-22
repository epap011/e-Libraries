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
    @Path("/all")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response getBooksWithTitle() throws SQLException, ClassNotFoundException {


        ArrayList<mainClasses.Book> books;
        books = new EditBooksTable().databaseToBooks();

        if (!books.isEmpty()) {
            String json = new Gson().toJson(books);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }

    @GET
    @Path("/genre/{genre}/")
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
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"toYear should be bigger than fromYear\"}").build();
            }
        }

        ArrayList<mainClasses.Book> books;
        books = new EditBooksTable().databaseToBooksGenre(genre);
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

    @GET
    @Path("/title/")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response getBooksWithTitle(@QueryParam("name") String name)
                                     throws SQLException, ClassNotFoundException {

        if(name == null) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"You need to give name of the book\"}").build();
        }

        ArrayList<mainClasses.Book> books;
        books = new EditBooksTable().databaseToBooksName(name);

        if (!books.isEmpty()) {
            String json = new Gson().toJson(books);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }

    @GET
    @Path("/author/")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response getBooksWithAuthor(@QueryParam("name") String name)
            throws SQLException, ClassNotFoundException {

        if(name == null) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"You need to give name of the author\"}").build();
        }

        ArrayList<mainClasses.Book> books;
        books = new EditBooksTable().databaseToBooksAuthor(name);

        if (!books.isEmpty()) {
            String json = new Gson().toJson(books);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }

    @GET
    @Path("/pages/")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response getBooksWithAuthor(@QueryParam("fromPages") String fromPages,
                                       @QueryParam("toPages") String toPages)
                                        throws SQLException, ClassNotFoundException {

        if(fromPages != null && toPages != null) {
            if(Integer.parseInt(fromPages) > Integer.parseInt(toPages)) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"toPages should be bigger than fromPages\"}").build();
            }
        }

        ArrayList<mainClasses.Book> books;
        books = new EditBooksTable().databaseToBooks();
        if(fromPages != null) {
            books.removeIf(b -> b.getPages() < Integer.parseInt(fromPages));
        }
        if(toPages != null) {
            books.removeIf(b -> b.getPages() > Integer.parseInt(toPages));
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
