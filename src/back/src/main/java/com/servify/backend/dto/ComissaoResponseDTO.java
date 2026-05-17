package com.servify.backend.dto;

import java.math.BigDecimal;

public class ComissaoResponseDTO {
    private Long id;
    private Long usuarioId;
    private String usuarioNome;
    private BigDecimal valor;

    public ComissaoResponseDTO() {
    }

    public ComissaoResponseDTO(Long id, Long usuarioId, String usuarioNome, BigDecimal valor) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.usuarioNome = usuarioNome;
        this.valor = valor;
    }

    public Long getId() {
        return id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getUsuarioNome() {
        return usuarioNome;
    }

    public BigDecimal getValor() {
        return valor;
    }
}
