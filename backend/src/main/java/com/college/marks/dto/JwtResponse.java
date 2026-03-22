package com.college.marks.dto;

public class JwtResponse {
    private String token;
    private String role;
    private String username;
    private String linkedId;

    public JwtResponse(String token, String role, String username, String linkedId) {
        this.token = token;
        this.role = role;
        this.username = username;
        this.linkedId = linkedId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getLinkedId() { return linkedId; }
    public void setLinkedId(String linkedId) { this.linkedId = linkedId; }
}
