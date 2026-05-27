package com.servify.backend.enums;

public enum AgendamentoStatus {
    AGENDADO("Agendado"),
    CONCLUIDO("Concluído"),
    CANCELADO("Cancelado");

    private final String descricao;

    private AgendamentoStatus(String descricao) {
        this.descricao = descricao;
    }

    public String toString() {
        return descricao;
    }
}
