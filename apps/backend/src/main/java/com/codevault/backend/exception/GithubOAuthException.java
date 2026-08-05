package com.codevault.backend.exception;

public class GithubOAuthException extends RuntimeException {

    public GithubOAuthException(String message) {
        super(message);
    }

    public GithubOAuthException(String message, Throwable cause) {
        super(message, cause);
    }
}