package com.servify.backend.service;

import com.servify.backend.controller.AgendamentoController;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.servify.backend.constants.PerfilConstants;
import com.servify.backend.dto.AgendamentoRequestDTO;
import com.servify.backend.dto.AgendamentoResponseDTO;
import com.servify.backend.entity.Agendamento;
import com.servify.backend.entity.Comissao;
import com.servify.backend.entity.Servico;
import com.servify.backend.entity.Usuario;
import com.servify.backend.enums.AgendamentoStatus;
import com.servify.backend.repository.AgendamentoRepository;
import com.servify.backend.repository.ComissaoRepository;
import com.servify.backend.repository.ServicoRepository;
import com.servify.backend.repository.UsuarioRepository;

@Service
public class AgendamentoService {

    private final AgendamentoController agendamentoController;
    private final AgendamentoRepository agendamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ServicoRepository servicoRepository;
    private final ComissaoRepository comissaoRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository,
            UsuarioRepository usuarioRepository,
            ServicoRepository servicoRepository,
            ComissaoRepository comissaoRepository, AgendamentoController agendamentoController) {
        this.agendamentoRepository = agendamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.servicoRepository = servicoRepository;
        this.comissaoRepository = comissaoRepository;
        this.agendamentoController = agendamentoController;
    }

    public AgendamentoResponseDTO criar(AgendamentoRequestDTO dto) {
        Usuario cliente = usuarioRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        validarCliente(cliente);

        Usuario colaborador = usuarioRepository.findById(dto.colaboradorId())
                .orElseThrow(() -> new RuntimeException("Colaborador não encontrado"));

        validarColaborador(colaborador);

        Servico servico = servicoRepository.findById(dto.servicoId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        validarServico(servico);

        Comissao comissao = comissaoRepository.findByUsuario_Id(colaborador.getId())
                .orElseThrow(() -> new RuntimeException("Comissão do colaborador não encontrada"));

        validarComissao(comissao);

        validarDataHora(dto);

        validarDesconto(dto, servico);

        validarConflitoHorario(dto, colaborador, servico);

        Agendamento agendamento = criarAgendamento(dto, cliente, colaborador, servico, comissao);

        return toResponseDto(agendamentoRepository.save(agendamento));
    }

    public List<AgendamentoResponseDTO> listar(LocalDateTime inicio, LocalDateTime fim, Long clienteId,
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

    // #region Validações
    private void validarCliente(Usuario cliente) {
        if (cliente.isCadastroPendente()) {
            throw new RuntimeException("Cliente com cadastro pendente");
        }
    }

    private void validarColaborador(Usuario colaborador) {
        if (colaborador.getPerfil().getId() != PerfilConstants.COLABORADOR) {
            throw new RuntimeException("Usuário informado não é um colaborador");
        }

        if (colaborador.isCadastroPendente()) {
            throw new RuntimeException("Colaborador com cadastro pendente");
        }
    }

    private void validarServico(Servico servico) {
        if (!servico.isAtivo()) {
            throw new RuntimeException("Serviço está inativo");
        }
    }

    private void validarComissao(Comissao comissao) {
        if (comissao.getValor() == null || comissao.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Comissão do colaborador deve ser maior que zero");
        }
        if (comissao.getValor().compareTo(BigDecimal.ONE) > 0) {
            throw new RuntimeException("Comissão do colaborador deve ser um valor entre 0 e 1");
        }
    }

    private void validarDataHora(AgendamentoRequestDTO dto) {
        if (dto.dataHora().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Data e hora do agendamento devem ser futuras");
        }
    }

    private void validarDesconto(AgendamentoRequestDTO dto, Servico servico) {
        if (dto.desconto() != null) {
            if (dto.desconto().compareTo(servico.getValor()) > 0) {
                throw new RuntimeException("Desconto não pode ser maior que o valor do serviço");
            }
            if (dto.desconto().compareTo(java.math.BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Desconto não pode ser negativo");
            }
        }
    }

    private void validarConflitoHorario(AgendamentoRequestDTO dto, Usuario colaborador, Servico servico) {
        LocalDateTime inicioNovo = dto.dataHora();

        LocalDateTime fimNovo = inicioNovo.plusMinutes(
                servico.getDuracaoMinutos());

        LocalDateTime inicioDia = inicioNovo.toLocalDate().atStartOfDay();

        LocalDateTime fimDia = inicioNovo.toLocalDate().atTime(23, 59, 59);

        List<Agendamento> agendamentosExistentes = agendamentoRepository
                .findByColaborador_IdAndDataHoraBetweenAndAgendamentoStatusNot(
                        colaborador.getId(),
                        inicioDia,
                        fimDia,
                        AgendamentoStatus.CANCELADO);

        for (Agendamento agendamento : agendamentosExistentes) {

            LocalDateTime inicioExistente = agendamento.getDataHora();

            LocalDateTime fimExistente = inicioExistente.plusMinutes(
                    agendamento.getDuracaoMinutos());

            boolean possuiConflito = inicioNovo.isBefore(fimExistente)
                    && fimNovo.isAfter(inicioExistente);

            if (possuiConflito) {

                throw new RuntimeException(
                        "Colaborador já possui um agendamento nesse horário");
            }
        }
    }
    // #endregion

    // #region Helpers
    private Agendamento criarAgendamento(AgendamentoRequestDTO dto, Usuario cliente, Usuario colaborador,
            Servico servico,
            Comissao comissao) {
        Agendamento agendamento = new Agendamento();

        agendamento.setCliente(cliente);
        agendamento.setColaborador(colaborador);
        agendamento.setServico(servico);

        agendamento.setDataHora(dto.dataHora());

        agendamento.setValor(servico.getValor());

        agendamento.setDuracaoMinutos(
                servico.getDuracaoMinutos());

        agendamento.setDesconto(
                dto.desconto() != null
                        ? dto.desconto()
                        : BigDecimal.ZERO);

        agendamento.setComissao(comissao.getValor());

        agendamento.setAgendamentoStatus(
                AgendamentoStatus.AGENDADO);
        return agendamento;
    }

    private AgendamentoResponseDTO toResponseDto(Agendamento agendamento) {
        BigDecimal valorFinal = agendamento.getValor().subtract(agendamento.getDesconto());
        return new AgendamentoResponseDTO(
                agendamento.getId(),
                agendamento.getAgendamentoStatus().name(),
                agendamento.getCliente().getId(),
                agendamento.getCliente().getNome(),
                agendamento.getColaborador().getId(),
                agendamento.getColaborador().getNome(),
                agendamento.getServico().getId(),
                agendamento.getServico().getNome(),
                agendamento.getDataHora(),
                agendamento.getDuracaoMinutos(),
                agendamento.getValor(),
                agendamento.getDesconto(),
                valorFinal,
                agendamento.getComissao());
    }
    // #endregion
}
