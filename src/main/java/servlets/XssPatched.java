package servlets;

import com.google.gson.Gson;
import mainClasses.JSON_Converter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "XSS_PATCH", value = "/XSS_PATCH")
public class XssPatched extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String json = new JSON_Converter().getJSONFromAjax(request.getReader());
        Gson gson = new Gson();
        XSS xss = gson.fromJson(json, XSS.class);
        response.setContentType("text/html;charset=UTF-8");
        response.setStatus(200);
        xss.checkForXSSInjection();
        response.getWriter().write(xss.getInput());
    }
}

class XSS {
    String input;

    public void setInput(String input) {
        this.input = input;
    }

    public String getInput() {
        return input;
    }

    public void checkForXSSInjection() {
        input = input.replace(">", "&gt;");
        input = input.replace("<", "&lt;");
        input = input.replace("\"", "&quot;");
        input = input.replace("&", "&ampr;");
        input = input.replace("\'", "'");
        input = input.replace("\n", "<br/> ");
    }
}
