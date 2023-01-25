package rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;

@Path("/")
public class BookAvailability {

    public BookAvailability() {}

    @PUT
    @Path("availability")
    @Produces({MediaType.APPLICATION_JSON})
    public Response changeAvailabilityOfBook(@Context HttpServletRequest request,
                                             @QueryParam("isbn") String isbn,
                                             @QueryParam("availability") Boolean availability) throws SQLException, ClassNotFoundException {

        HttpSession session = request.getSession();
        System.out.println("Session="+session.getAttributeNames());
        System.out.println("ISBN: " + isbn);
        System.out.println("Availability: " + availability);
//        try {
//            EditBooksInLibraryTable editBooksInLibraryTable = new EditBooksInLibraryTable();
//            editBooksInLibraryTable.
//        }
        return Response.status(Response.Status.OK).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
    }

}