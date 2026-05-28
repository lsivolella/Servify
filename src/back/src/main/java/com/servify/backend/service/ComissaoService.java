package com.servify.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servify.backend.dto.ColaboradorComissaoDTO;
import com.servify.backend.dto.ComissaoRequestDTO;
import com.servify.backend.dto.ComissaoResponseDTO;
import com.servify.backend.entity.Comissao;
import com.servify.backend.entity.Usuario;
import com.servify.backend.repository.ComissaoRepository;
import com.servify.backend.repository.UsuarioRepository;

@Service
public class ComissaoService {
    private final ComissaoRepository comissaoRepository;
    private final UsuarioRepository usuarioRepository;

    public ComissaoService(
            ComissaoRepository comissaoRepository,
            UsuarioRepository usuarioRepository) {
        this.comissaoRepository = comissaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public ComissaoResponseDTO atualizar(Long id, ComissaoRequestDTO dto) {
        Comissao comissao = comissaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comissão não encontrada"));

        comissao.setValor(dto.valor());

        return toResponseDTO(comissaoRepository.save(comissao));
    }

    public ComissaoResponseDTO buscarPorId(Long id) {
        Comissao comissao = comissaoRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Comissão não encontrada"));

        return toResponseDTO(comissao);
    }

    public List<ColaboradorComissaoDTO> listarColaboradoresComissao() {
        List<Usuario> colaboradores = usuarioRepository.findByPerfil_Id(2);

        return colaboradores.stream()
                .map(usuario -> {
                    Comissao comissao = comissaoRepository
                            .findByUsuario_Id(usuario.getId())
                            .orElseThrow(() -> new RuntimeException(
                                    "Colaborador sem comissão"));

                    return new ColaboradorComissaoDTO(
                            usuario.getId(),
                            usuario.getNome(),
                            comissao.getId(),
                            comissao.getValor());
                })
                .toList();
    }

    public ComissaoResponseDTO buscarPorUsuario(Long usuarioId) {
        Comissao comissao = comissaoRepository
                .findByUsuario_Id(usuarioId)
                .orElseThrow(() -> new RuntimeException("Comissão não encontrada"));

        return toResponseDTO(comissao);
    }

    public List<ComissaoResponseDTO> listarTodas() {
        return comissaoRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ComissaoResponseDTO toResponseDTO(Comissao comissao) {
        return new ComissaoResponseDTO(
                comissao.getId(),
                comissao.getUsuario().getId(),
                comissao.getUsuario().getNome(),
                comissao.getValor());
    }
}
