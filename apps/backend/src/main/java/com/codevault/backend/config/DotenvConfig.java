package com.codevault.backend.config;

import org.springframework.context.annotation.Configuration;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

@Configuration
public class DotenvConfig {

    @PostConstruct
    public void load() {

        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        String clientId = dotenv.get("GITHUB_CLIENT_ID");
        String clientSecret = dotenv.get("GITHUB_CLIENT_SECRET");

        System.out.println("=================================");
        System.out.println("DOTENV CLIENT ID: " + clientId);
        System.out.println("DOTENV SECRET FOUND: " + (clientSecret != null));
        System.out.println("=================================");

        if (clientId != null) {
            System.setProperty("GITHUB_CLIENT_ID", clientId);
        }

        if (clientSecret != null) {
            System.setProperty("GITHUB_CLIENT_SECRET", clientSecret);
        }
    }
}
