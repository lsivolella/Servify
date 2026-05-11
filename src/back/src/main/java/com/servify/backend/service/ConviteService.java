package com.servify.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.servify.backend.dto.ConviteRequestDTO;
import com.servify.backend.dto.ConviteResponseDTO;
import com.servify.backend.entity.Convite;
import com.servify.backend.entity.Perfil;
import com.servify.backend.entity.Usuario;
import com.servify.backend.enums.ConviteStatus;
import com.servify.backend.repository.ConviteRepository;
import com.servify.backend.repository.PerfilRepository;
import com.servify.backend.repository.UsuarioRepository;

@Service
public class ConviteService {
    private final ConviteRepository conviteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;

    private static final int EXPIRATION_HOURS = 24;

    public ConviteService(ConviteRepository conviteRepository,
            UsuarioRepository usuarioRepository,
            PerfilRepository perfilRepository) {
        this.conviteRepository = conviteRepository;
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
    }

    public ConviteResponseDTO criar(ConviteRequestDTO dto) {
        if (dto.getPerfilId() == 1) {
            throw new RuntimeException(
                    "Convites só podem ser enviados para colaboradores ou admins");
        }

        Usuario usuarioExistente = usuarioRepository.findByEmail(dto.getEmail())
                .orElse(null);

        if (usuarioExistente != null && usuarioExistente.getPerfil().getId() != 1) {
            throw new RuntimeException(
                    "Já existe um usuário cadastrado como admin/colaborador com este email");
        }

        Perfil perfil = perfilRepository.findById(dto.getPerfilId())
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));

        // Verificar se já existe um convite ativo para o email e força a sua expeiração
        conviteRepository
                .findByEmailAndStatus(
                        dto.getEmail(),
                        ConviteStatus.ATIVO)
                .ifPresent(conviteAtivo -> {

                    conviteAtivo.setStatus(
                            ConviteStatus.EXPIRADO);

                    conviteRepository.save(conviteAtivo);
                });

        Convite convite = new Convite();

        convite.setEmail(dto.getEmail());
        convite.setPerfil(perfil);
        convite.setToken(UUID.randomUUID().toString());
        convite.setDataCriacao(LocalDateTime.now());
        convite.setDataExpiracao(LocalDateTime.now().plusHours(EXPIRATION_HOURS));
        convite.setStatus(ConviteStatus.ATIVO);

        Convite salvo = conviteRepository.save(convite);

        return toResponseDTO(salvo);
    }

    public ConviteResponseDTO buscarPorId(Integer id) {

        Convite convite = conviteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

        return toResponseDTO(convite);
    }

    public List<ConviteResponseDTO> listar() {
        return conviteRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ConviteResponseDTO atualizar(Integer id, ConviteRequestDTO dto) {
        Convite convite = conviteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

        if (dto.getPerfilId() == 1) {
            throw new RuntimeException(
                    "Convites só podem ser enviados para colaboradores ou admins");
        }

        Perfil perfil = perfilRepository.findById(dto.getPerfilId())
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));

        convite.setEmail(dto.getEmail());
        convite.setPerfil(perfil);
        convite.setDataExpiracao(LocalDateTime.now().plusHours(EXPIRATION_HOURS));

        Convite atualizado = conviteRepository.save(convite);

        return toResponseDTO(atualizado);
    }

    public void deletar(Integer id) {

        Convite convite = conviteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

        conviteRepository.delete(convite);
    }

    public ConviteResponseDTO validarToken(String token) {

        Convite convite = conviteRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

        if (convite.getStatus() != ConviteStatus.ATIVO) {
            throw new RuntimeException("Convite inválido");
        }

        if (convite.getDataExpiracao()
                .isBefore(LocalDateTime.now())) {

            convite.setStatus(
                    ConviteStatus.EXPIRADO);

            conviteRepository.save(convite);

            throw new RuntimeException("Convite expirado");
        }

        return toResponseDTO(convite);
    }

    private ConviteResponseDTO toResponseDTO(Convite convite) {
        ConviteResponseDTO dto = new ConviteResponseDTO();

        dto.setId(convite.getId());
        dto.setEmail(convite.getEmail());
        dto.setPerfilId(convite.getPerfil().getId());
        dto.setPerfilNome(convite.getPerfil().getNome());
        dto.setDataExpiracao(convite.getDataExpiracao());
        dto.setStatus(convite.getStatus());

        return dto;
    }
}
