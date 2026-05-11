package com.servify.backend.dto;

public class LoginResponseDTO {
  private Long id;
  private Integer perfilId;
  private String perfilNome;
  /** "adm" | "colaborador" | "cliente" */
  private String cargo;
  private String nome;
  private String email;

  public LoginResponseDTO() {}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Integer getPerfilId() {
    return perfilId;
  }

  public void setPerfilId(Integer perfilId) {
    this.perfilId = perfilId;
  }

  public String getPerfilNome() {
    return perfilNome;
  }

  public void setPerfilNome(String perfilNome) {
    this.perfilNome = perfilNome;
  }

  public String getCargo() {
    return cargo;
  }

  public void setCargo(String cargo) {
    this.cargo = cargo;
  }

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}

