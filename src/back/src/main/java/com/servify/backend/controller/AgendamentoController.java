package com.servify.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.servify.backend.dto.AgendamentoRequestDTO;
import com.servify.backend.dto.AgendamentoResponseDTO;
import com.servify.backend.enums.AgendamentoStatus;
import com.servify.backend.service.AgendamentoService;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @PostMapping
    public AgendamentoResponseDTO criar(@Valid @RequestBody AgendamentoRequestDTO dto) {
        return service.criar(dto);
    }

    @GetMapping
    public List<AgendamentoResponseDTO> listar(
            @RequestParam(required = false) LocalDate inicio,
            @RequestParam(required = false) LocalDate fim,
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) Long colaboradorId,
            @RequestParam(required = false) AgendamentoStatus status) {

        return service.listar(
                inicio,
                fim,
                clienteId,
                colaboradorId,
                status);
    }

    @GetMapping("/{id}")
    public AgendamentoResponseDTO buscar(@RequestParam Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public AgendamentoResponseDTO editar(@PathVariable Long id, @RequestBody AgendamentoRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
