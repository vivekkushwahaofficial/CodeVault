package com.codevault.backend.github.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.codevault.backend.github.config.GithubProperties;
import com.codevault.backend.github.dto.GithubTokenResponse;

@Service
public class GithubOAuthService {

    private final GithubProperties githubProperties;
    private final WebClient webClient;

    public GithubOAuthService(GithubProperties githubProperties) {

        this.githubProperties = githubProperties;

        this.webClient = WebClient.builder()
                .baseUrl("https://github.com")
                .build();
    }

    public GithubTokenResponse exchangeCode(String code) {

        MultiValueMap<String, String> formData
                = new LinkedMultiValueMap<>();

        formData.add("client_id", githubProperties.getClientId());

        formData.add("client_secret", githubProperties.getClientSecret());

        formData.add("code", code);

        formData.add(
                "redirect_uri",
                "https://bmafjmolaoanmmopmeefncjkooajaajp.chromiumapp.org/"
        );

        System.out.println("=================================");
        System.out.println("Client ID: " + githubProperties.getClientId());
        System.out.println("Client Secret Loaded: "
                + (githubProperties.getClientSecret() != null
                && !githubProperties.getClientSecret().isBlank()));
        System.out.println("Code: " + code);
        System.out.println("=================================");

        GithubTokenResponse response = webClient.post()
                .uri("/login/oauth/access_token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(GithubTokenResponse.class)
                .block();

        System.out.println("GitHub Response:");
        System.out.println(response);

        return response;
    }

}
