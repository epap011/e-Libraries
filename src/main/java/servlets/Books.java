package servlets;

import database.tables.EditBooksTable;
import mainClasses.Book;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;

@WebServlet(name = "Books", value = "/Books")
public class Books extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        EditBooksTable ebt = new EditBooksTable();
        String allBooksJson;

        response.setContentType("application/json; charset=UTF-8");
        try {
            ArrayList<Book> books = ebt.databaseToBooks();
            allBooksJson = ebt.booksToJson(books);
            System.out.println(allBooksJson);
            response.setStatus(200);
            response.getWriter().println(allBooksJson);
        } catch (SQLException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
