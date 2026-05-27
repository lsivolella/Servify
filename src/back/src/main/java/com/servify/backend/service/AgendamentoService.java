package com.servify.backend.service;

import java.time.LocalDate;
import java.util.List;

import com.servify.backend.constants.PerfilConstants;
import com.servify.backend.dto.AgendamentoRequestDTO;
import com.servify.backend.dto.AgendamentoResponseDTO;
import com.servify.backend.entity.Servico;
import com.servify.backend.entity.Usuario;
import com.servify.backend.enums.AgendamentoStatus;
import com.servify.backend.repository.AgendamentoRepository;
import com.servify.backend.repository.ServicoRepository;
import com.servify.backend.repository.UsuarioRepository;

public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ServicoRepository servicoRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository,
            UsuarioRepository usuarioRepository,
            ServicoRepository servicoRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.servicoRepository = servicoRepository;
    }

    public AgendamentoResponseDTO criar(AgendamentoRequestDTO dto) {
        Usuario cliente = usuarioRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Usuario colaborador = usuarioRepository.findById(dto.colaboradorId())
                .orElseThrow(() -> new RuntimeException("Colaborador não encontrado"));

        if (colaborador.getPerfil().getId() != PerfilConstants.COLABORADOR) {
            throw new RuntimeException("Usuário informado não é um colaborador");
        }

        Servico servico = servicoRepository.findById(dto.servicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        return null;
    }

    public List<AgendamentoResponseDTO> listar(LocalDate inicio, LocalDate fim, Long clienteId,
            Long colaboradorId, AgendamentoStatus status) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'listar'");
    }

    public AgendamentoResponseDTO buscarPorId(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'buscarPorId'");
    }

    public AgendamentoResponseDTO atualizar(Long id, AgendamentoRequestDTO dto) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'atualizar'");
    }

    public void deletar(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deletar'");
    }
}
