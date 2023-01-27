package rest;

import com.google.gson.Gson;
import database.tables.EditBooksTable;
import database.tables.EditReviewsTable;
import mainClasses.Book;
import mainClasses.Review;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;

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
            books.sort((b1, b2) -> b2.getGenre().compareTo(b1.getGenre()));
            Collections.reverse(books);
            String json = new Gson().toJson(books);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }

    @GET
    @Path("/isbn/{isbn}")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response getBook(@PathParam("isbn") String isbn) throws SQLException, ClassNotFoundException {
        try {
            Book book = new EditBooksTable().databaseToBook(isbn);
            String json = new Gson().toJson(book);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } catch(Exception e) {
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

        String JSONreviewsPerBook = "";
        String JSONbook = "";
        ArrayList<String> reviewsList = new ArrayList<>();
        ArrayList<String> bookWithReviewsList = new ArrayList<>();
        if (!books.isEmpty()) {
            ArrayList<mainClasses.Review> reviews;
            for( Book book : books) {
                reviews = new EditReviewsTable().databaseToReviews(book.getIsbn());
                for(Review review : reviews){
                    JSONreviewsPerBook = new Gson().toJson(review);
                    reviewsList.add(JSONreviewsPerBook);
                }
                JSONbook = new Gson().toJson(book);
                String temp1 = JSONbook.substring(0 , JSONbook.length()-2);
                String temp2 = new Gson().toJson(reviewsList);
                temp1 += ", \"reviews\":" + temp2 + "}";
                System.out.println(temp1);
                bookWithReviewsList.add(temp1);
                temp1="";
                reviewsList.clear();
            }
            String json = new Gson().toJson(bookWithReviewsList);
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

        String JSONreviewsPerBook = "";
        String JSONbook = "";
        ArrayList<String> reviewsList = new ArrayList<>();
        ArrayList<String> bookWithReviewsList = new ArrayList<>();
        if (!books.isEmpty()) {
            ArrayList<mainClasses.Review> reviews;
            for( Book book : books) {
                reviews = new EditReviewsTable().databaseToReviews(book.getIsbn());
                for(Review review : reviews){
                    JSONreviewsPerBook = new Gson().toJson(review);
                    reviewsList.add(JSONreviewsPerBook);
                }
                JSONbook = new Gson().toJson(book);
                String temp1 = JSONbook.substring(0 , JSONbook.length()-2);
                String temp2 = new Gson().toJson(reviewsList);
                temp1 += ", \"reviews\":" + temp2 + "}";
                System.out.println(temp1);
                bookWithReviewsList.add(temp1);
                temp1="";
                reviewsList.clear();
            }
            String json = new Gson().toJson(bookWithReviewsList);
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
        String JSONreviewsPerBook = "";
        String JSONbook = "";
        ArrayList<String> reviewsList = new ArrayList<>();
        ArrayList<String> bookWithReviewsList = new ArrayList<>();
        if (!books.isEmpty()) {
            ArrayList<mainClasses.Review> reviews;
            for( Book book : books) {
                reviews = new EditReviewsTable().databaseToReviews(book.getIsbn());
                for(Review review : reviews){
                    JSONreviewsPerBook = new Gson().toJson(review);
                    reviewsList.add(JSONreviewsPerBook);
                }
                JSONbook = new Gson().toJson(book);
                String temp1 = JSONbook.substring(0 , JSONbook.length()-2);
                System.out.println("temp1 substring = " + temp1);
                String temp2 = new Gson().toJson(reviewsList);
                System.out.println("temp2 = " + temp2);
                temp1 += ", \"reviews\":" + temp2 + "}";
                System.out.println("temp1 after concatenate = " + temp1);
                bookWithReviewsList.add(temp1);
                temp1 = "";
                reviewsList.clear();
            }
            String json = new Gson().toJson(bookWithReviewsList);
            System.out.println("final jason = " + json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }
}
