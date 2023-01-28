package rest;

import com.google.gson.Gson;
import database.tables.*;
import mainClasses.Book;
import mainClasses.Borrowing;
import mainClasses.Student;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.swing.text.Document;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
@Path("borrowings")
public class Borrowings {

    public Borrowings(){}

    @GET
    @Path("/all")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response getBorrowings(@QueryParam("pdf") String pdf) throws SQLException, ClassNotFoundException, IOException {
        ArrayList<Borrowing> borrowings = new ArrayList<>();
        borrowings = new EditBorrowingTable().databaseToBorrowings();

        if(pdf == null) {
            if (!borrowings.isEmpty()) {
                String json = new Gson().toJson(borrowings);
                System.out.println(json);
                return Response.status(Response.Status.OK).type("application/json").entity(json).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"borrowing table is empty\"}").build();
            }
        }
        else{
            System.out.println("pdf");
            if(!borrowings.isEmpty()) {
                for (Borrowing bor : borrowings) {
                    if(!bor.getStatus().equals("borrowed") && !bor.getStatus().equals("returned")){
                        borrowings.remove(bor);
                    }
                }
//                PDDocument document = new PDDocument();
//                PDPage page = new PDPage();
//                document.addPage(page);
//
//                PDPageContentStream contentStream = new PDPageContentStream(document, page);
//
//                contentStream.setFont(PDType1Font.COURIER, 12);
//                contentStream.beginText();
//                contentStream.showText("Hello World");
//                contentStream.endText();
//                contentStream.close();
//
//                document.save("pdfBoxHelloWorld.pdf");
//                document.close();
                String json = new Gson().toJson(borrowings);
                System.out.println(json);
                return Response.status(Response.Status.OK).type("application/json").entity(json).build();
            }else {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"borrowing table is empty\"}").build();
            }
        }
    }

    @PUT
    @Path("/status")
    @Produces({ MediaType.APPLICATION_JSON})
    public Response changeStatus(@QueryParam("id") String id) throws SQLException, ClassNotFoundException {
        Borrowing borrow = new EditBorrowingTable().databaseToBorrowing(Integer.parseInt(id));

        int borId = borrow.getBorrowing_id();
        String status = borrow.getStatus();
        if (status.equals("requested")){
            new EditBorrowingTable().updateBorrowing(borId , "borrowed");
            new EditBooksInLibraryTable().updateBookInLibrary(id , "false");
            String json = new Gson().toJson(borrow);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else if (status.equals("returned")) {
            new EditBorrowingTable().updateBorrowing(borId , "successEnd");
            new EditBooksInLibraryTable().updateBookInLibrary(id , "true");
            String json = new Gson().toJson(borrow);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } else {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"you cant change the status\"}").build();
            }
        }

    @GET
    @Path("/userId")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentBorrowings(@Context HttpServletRequest request) throws SQLException, ClassNotFoundException {
        System.out.println("borrowings resource has been invoked");
        HttpSession session = request.getSession();
        try {
            EditStudentsTable est = new EditStudentsTable();
            Student student = est.databaseToStudent((String)session.getAttribute("loggedIn"));

            ArrayList<Borrowing> bors = new EditBorrowingTable().databaseToBorrowingsUserId(student.getUser_id());
            String json = new Gson().toJson(bors);
            System.out.println(json);
            return Response.status(Response.Status.OK).type("application/json").entity(json).build();
        } catch(Exception e) {
            System.err.println(e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"review didnt add\"}").build();
        }
    }

    @POST
    @Path("/")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentBorrowings(@Context HttpServletRequest request,
                                         @QueryParam("bookId") String bookId,
                                         @QueryParam("from") String from,
                                         @QueryParam("to") String to) throws SQLException, ClassNotFoundException {
        System.out.println("borrowings resource has been invoked to POST");
        HttpSession session = request.getSession();
        try {
            EditStudentsTable est = new EditStudentsTable();
            Student student = est.databaseToStudent((String)session.getAttribute("loggedIn"));
            int userId = student.getUser_id();

            Borrowing bor = new Borrowing();
            bor.setBookcopy_id(Integer.parseInt(bookId));
            bor.setStatus("requested");
            bor.setFromDate(from);
            bor.setToDate(to);
            bor.setUser_id(userId);

            new EditBorrowingTable().createNewBorrowing(bor);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"all good\":\"add borrow table\"}").build();
        } catch(Exception e) {
            System.err.println(e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"cant add in borrow table\"}").build();
        }
    }
}
