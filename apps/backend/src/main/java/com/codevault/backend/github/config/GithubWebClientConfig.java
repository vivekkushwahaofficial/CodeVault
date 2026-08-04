package com.codevault.backend.github.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class GithubWebClientConfig {

    @Bean(name = "githubOAuthClient")
    public WebClient githubOAuthClient() {
        return WebClient.builder()
                .baseUrl("https://github.com")
                .build();
    }

    @Bean(name = "githubApiClient")
    public WebClient githubApiClient() {
        return WebClient.builder()
                .baseUrl("https://api.github.com")
                .build();
    }
}