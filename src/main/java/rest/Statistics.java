package rest;

import database.tables.EditBooksInLibraryTable;
import database.tables.EditBooksTable;
import database.tables.EditLibrarianTable;
import database.tables.EditStudentsTable;
import mainClasses.Book;
import mainClasses.BookInLibrary;
import mainClasses.Student;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.*;

@Path("statistics")
public class Statistics {

    public Statistics() {}

    @GET
    @Path("/")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response getStudentAccounts() throws SQLException, ClassNotFoundException {
        System.out.println("statistics resource has been invoked");
        try {
            int mscCounter = 0, bscCounter = 0, phdCounter = 0;
            ArrayList<mainClasses.Student> students;
            students = new EditStudentsTable().databaseToStudents();

            for (Student student: students) {
                if (student.getStudent_type().equals("Msc")) mscCounter++;
                else if(student.getStudent_type().equals("BSc")) bscCounter++;
                else if(student.getStudent_type().equals("PhD")) phdCounter++;
            }

            StringBuilder json = new StringBuilder("{\"statistics\":{\"numberOfStudentsPerType\":{\"Msc\":" + mscCounter + ", \"BSc\":" + bscCounter + ", \"Phd\":" + phdCounter + "},");

            ArrayList<mainClasses.Book> books;
            books = new EditBooksTable().databaseToBooks();

            HashMap<String, Integer> genresCount = new HashMap<>();
            for (Book book: books)
                genresCount.put(book.getGenre(), 0);

            for (Book book: books)
                genresCount.put(book.getGenre(), genresCount.get(book.getGenre())+1);

            json.append("\"numberOfBooksPerGenre\":{");
            for (Map.Entry<String,Integer> entry : genresCount.entrySet())
                json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue()).append(",");

            json.deleteCharAt(json.length()-1);
            json.append("},");

            ArrayList<BookInLibrary> booksInLibraries = new ArrayList<>();
            booksInLibraries = new EditBooksInLibraryTable().databaseToBookInLibraries();

            booksInLibraries.sort(Comparator.comparingInt(BookInLibrary::getLibrary_id));
            HashMap<Integer, Integer> libraryIdToNumberOfBooks = new HashMap<>();

            int id = -1;
            for (BookInLibrary b: booksInLibraries) {
                libraryIdToNumberOfBooks.put(b.getLibrary_id(), 0);
            }
            for (BookInLibrary b: booksInLibraries) {
                libraryIdToNumberOfBooks.put(b.getLibrary_id(), libraryIdToNumberOfBooks.get(b.getLibrary_id()) + 1);
            }

            HashMap<String, Integer> librarynameToNumberOfBooks = new HashMap<>();
            EditLibrarianTable editLibrarianTable = new EditLibrarianTable();

            for (Map.Entry<Integer,Integer> entry : libraryIdToNumberOfBooks.entrySet()) {
                String libraryName = editLibrarianTable.getLibrarianName(entry.getKey());
                librarynameToNumberOfBooks.put(libraryName, entry.getValue());
            }

            json.append("\"numberOfBooksPerLibrary\":{");
            for (Map.Entry<String,Integer> entry : librarynameToNumberOfBooks.entrySet())
                json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue()).append(",");

            json.deleteCharAt(json.length()-1);
            json.append("}}}");
            return Response.status(Response.Status.OK).type("application/json").entity(json.toString()).build();
        } catch (Exception e){
            return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Books with these requirements not exist\"}").build();
        }
    }
}
