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

        List<Agendamento> findByUsuario_IdAndAgendamentoStatus(
                        Long usuarioId,
                        AgendamentoStatus status);

        List<Agendamento> findByUsuario_IdAndDataHoraBetweenAndAgendamentoStatusNot(
                        Long usuarioId,
                        LocalDateTime inicio,
                        LocalDateTime fim,
                        AgendamentoStatus status);
}
