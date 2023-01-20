package servlets;

import mainClasses.JSON_Converter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "XSS", value = "/XSS")
public class XssUnpatched extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String json = new JSON_Converter().getJSONFromAjax(request.getReader());
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().write(json);
    }
}
