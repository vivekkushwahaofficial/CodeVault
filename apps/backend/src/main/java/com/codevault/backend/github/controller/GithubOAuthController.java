package com.codevault.backend.github.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codevault.backend.github.dto.GithubTokenRequest;
import com.codevault.backend.github.dto.GithubTokenResponse;
import com.codevault.backend.github.service.GithubOAuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/github/oauth")
public class GithubOAuthController {

    private final GithubOAuthService githubOAuthService;

    public GithubOAuthController(
            GithubOAuthService githubOAuthService
    ) {
        this.githubOAuthService = githubOAuthService;
    }

    @PostMapping("/token")
    public GithubTokenResponse exchangeToken(
            @Valid @RequestBody GithubTokenRequest request
    ) {

        return githubOAuthService.exchangeCode(
                request.code()
        );
    }
}
