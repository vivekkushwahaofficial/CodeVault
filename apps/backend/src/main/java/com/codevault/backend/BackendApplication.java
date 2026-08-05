package com.codevault.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        setProperty(dotenv, "GITHUB_CLIENT_ID");
        setProperty(dotenv, "GITHUB_CLIENT_SECRET");
        setProperty(dotenv, "GITHUB_REDIRECT_URI");
        setProperty(dotenv, "EXTENSION_ALLOWED_ORIGIN");

        SpringApplication.run(BackendApplication.class, args);
    }

    private static void setProperty(
            Dotenv dotenv,
            String key
    ) {

        String value = dotenv.get(key);

        if (value != null && !value.isBlank()) {
            System.setProperty(key, value);
        }
    }
}
