package com.codevault.backend.github.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GithubTokenResponse(

        @JsonProperty("access_token")
        String accessToken,

        @JsonProperty("token_type")
        String tokenType,

        @JsonProperty("scope")
        String scope

) {
}