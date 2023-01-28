package rest;

import com.google.gson.Gson;
import database.tables.EditBooksInLibraryTable;
import database.tables.EditLibrarianTable;
import database.tables.EditReviewsTable;
import database.tables.EditStudentsTable;
import mainClasses.Student;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;

@Path("review")
public class Review {

    @POST
    @Path("/{isbn}")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentAccounts(@Context HttpServletRequest request, @PathParam("isbn") String isbn) throws SQLException, ClassNotFoundException {
        System.out.println("review resource has been invoked with isbn: " + isbn);
        HttpSession session = request.getSession();
        try {
            EditReviewsTable editReviewsTable = new EditReviewsTable();
            EditStudentsTable est = new EditStudentsTable();
            mainClasses.Review review = new mainClasses.Review();
            Student student = est.databaseToStudent((String)session.getAttribute("loggedIn"));
            Integer studentID = Integer.parseInt(student.getStudent_id());

            review.setIsbn(isbn);
            review.setUser_id(studentID);
            review.setReviewText("a dummy review");
            review.setReviewScore("1");

            editReviewsTable.createNewReview(review);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"review added\"}").build();
        } catch(Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"review didnt add\"}").build();
        }
    }
}