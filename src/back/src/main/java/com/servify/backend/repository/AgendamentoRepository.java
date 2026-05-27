package com.servify.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servify.backend.entity.Agendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByDataHoraBetween(
            LocalDateTime inicio,
            LocalDateTime fim);
}
