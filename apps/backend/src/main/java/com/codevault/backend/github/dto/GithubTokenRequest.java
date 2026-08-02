package com.codevault.backend.github.dto;

import jakarta.validation.constraints.NotBlank;

public record GithubTokenRequest(

    @NotBlank(message = "Authorization code is required")
    String code

) {
}