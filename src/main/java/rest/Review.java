package rest;

import com.google.gson.Gson;
import database.tables.EditReviewsTable;
import database.tables.EditStudentsTable;
import mainClasses.JSON_Converter;
import mainClasses.Student;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.sql.SQLException;

@Path("review")
public class Review {

    @POST
    @Path("/{isbn}")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentAccounts(@Context HttpServletRequest request, String body, @PathParam("isbn") String isbn)
            throws SQLException, ClassNotFoundException, IOException {

        System.out.println("review resource has been invoked with isbn: " + isbn);
        HttpSession session = request.getSession();

        try {
            
            EditReviewsTable editReviewsTable = new EditReviewsTable();
            EditStudentsTable est = new EditStudentsTable();
            Student student = est.databaseToStudent((String)session.getAttribute("loggedIn"));
            Integer studentID = student.getUser_id();

            Gson gson = new Gson();
            mainClasses.Review review = gson.fromJson(body, mainClasses.Review.class);

            review.setIsbn(isbn);
            review.setUser_id(studentID);

            editReviewsTable.createNewReview(review);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"review added\"}").build();
        } catch(Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"review didnt add\"}").build();
        }
    }
}