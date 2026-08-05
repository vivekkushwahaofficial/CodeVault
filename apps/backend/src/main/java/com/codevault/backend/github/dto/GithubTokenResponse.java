package com.codevault.backend.github.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubTokenResponse(

        @JsonProperty("access_token")
        String accessToken,

        @JsonProperty("token_type")
        String tokenType,

        @JsonProperty("scope")
        String scope,

        @JsonProperty("error")
        String error,

        @JsonProperty("error_description")
        String errorDescription,

        @JsonProperty("error_uri")
        String errorUri

) {

    public boolean hasError() {
        return error != null && !error.isBlank();
    }

    public boolean hasAccessToken() {
        return accessToken != null && !accessToken.isBlank();
    }
}