package com.codevault.backend.github.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.codevault.backend.exception.GithubOAuthException;
import com.codevault.backend.github.config.GithubProperties;
import com.codevault.backend.github.dto.GithubTokenResponse;

@Service
public class GithubOAuthService {

    private static final Logger logger =
            LoggerFactory.getLogger(GithubOAuthService.class);

    private final GithubProperties githubProperties;
    private final WebClient githubOAuthClient;

    public GithubOAuthService(
            GithubProperties githubProperties,
            @Qualifier("githubOAuthClient") WebClient githubOAuthClient
    ) {
        this.githubProperties = githubProperties;
        this.githubOAuthClient = githubOAuthClient;
    }

    public GithubTokenResponse exchangeCode(String code) {

        logger.info("Exchanging GitHub authorization code.");

        MultiValueMap<String, String> formData =
                new LinkedMultiValueMap<>();

        formData.add("client_id", githubProperties.getClientId());
        formData.add("client_secret", githubProperties.getClientSecret());
        formData.add("code", code);
        formData.add("redirect_uri", githubProperties.getRedirectUri());

        GithubTokenResponse response;

        try {

            response = githubOAuthClient.post()
                    .uri("/login/oauth/access_token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(GithubTokenResponse.class)
                    .block();

        } catch (Exception ex) {

            logger.error("Failed to exchange GitHub authorization code.", ex);

            throw new GithubOAuthException(
                    "Failed to communicate with GitHub.",
                    ex
            );
        }

        if (response == null) {

            logger.error("GitHub returned a null response.");

            throw new GithubOAuthException(
                    "GitHub did not return a response."
            );
        }

        if (response.hasError()) {

            logger.error(
                    "GitHub OAuth failed: {}",
                    response.errorDescription()
            );

            throw new GithubOAuthException(
                    response.errorDescription()
            );
        }

        if (!response.hasAccessToken()) {

            logger.error("GitHub did not return an access token.");

            throw new GithubOAuthException(
                    "Access token not received from GitHub."
            );
        }

        logger.info("GitHub token exchange completed successfully.");

        return response;
    }
}