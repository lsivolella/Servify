package com.servify.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servify.backend.entity.Agendamento;
import com.servify.backend.enums.AgendamentoStatus;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByDataHoraBetween(
            LocalDateTime inicio,
            LocalDateTime fim);

    List<Agendamento> findByColaborador_IdAndAgendamentoStatus(
            Long colaboradorId,
            AgendamentoStatus status);

    List<Agendamento> findByColaborador_IdAndDataHoraBetweenAndAgendamentoStatusNot(
            Long colaboradorId,
            LocalDateTime inicio,
            LocalDateTime fim,
            AgendamentoStatus status);
}
