package com.servify.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.servify.backend.dto.CompletarConviteCadastroDTO;
import com.servify.backend.dto.ConviteRequestDTO;
import com.servify.backend.dto.ConviteResponseDTO;
import com.servify.backend.dto.UsuarioRequestDTO;
import com.servify.backend.dto.UsuarioResponseDTO;
import com.servify.backend.entity.Convite;
import com.servify.backend.entity.Perfil;
import com.servify.backend.entity.Usuario;
import com.servify.backend.enums.ConviteStatus;
import com.servify.backend.mail.GmailMailSender;
import com.servify.backend.mail.ProvisionalPasswordGenerator;
import com.servify.backend.repository.ConviteRepository;
import com.servify.backend.repository.PerfilRepository;
import com.servify.backend.repository.UsuarioRepository;

@Service
public class ConviteService {
    private final ConviteRepository conviteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final GmailMailSender gmailMailSender;

    private static final int EXPIRATION_HOURS = 24;
    private static final int SENHA_PROVISORIA_LENGTH = 8;

    public ConviteService(ConviteRepository conviteRepository,
            UsuarioRepository usuarioRepository,
            PerfilRepository perfilRepository,
            UsuarioService usuarioService,
            PasswordEncoder passwordEncoder,
            @Autowired(required = false) GmailMailSender gmailMailSender) {
        this.conviteRepository = conviteRepository;
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.gmailMailSender = gmailMailSender;
    }

    public ConviteResponseDTO criar(ConviteRequestDTO dto) {
        if (dto.getPerfilId() == 3) {
            throw new RuntimeException(
                    "Convites só podem ser enviados para administradores ou colaboradores");
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

        String senhaProvisoriaPlana = null;
        if (gmailMailSender != null) {
            senhaProvisoriaPlana = ProvisionalPasswordGenerator.generate(SENHA_PROVISORIA_LENGTH);
            convite.setSenhaProvisoriaHash(passwordEncoder.encode(senhaProvisoriaPlana));
        }

        Convite salvo = conviteRepository.save(convite);

        if (gmailMailSender != null && senhaProvisoriaPlana != null) {
            gmailMailSender.sendConviteEmail(
                    salvo.getEmail(),
                    salvo.getToken(),
                    senhaProvisoriaPlana,
                    EXPIRATION_HOURS);
        }

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

        if (dto.getPerfilId() == 3) {
            throw new RuntimeException(
                    "Convites só podem ser enviados para administradores ou colaboradores");
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
        Convite convite = obterConviteAtivoPorToken(token);
        return toResponseDTO(convite);
    }

    /**
     * Cria o usuário com o perfil do convite, valida e-mail e senha provisória (se houver)
     * e marca o convite como {@link ConviteStatus#USADO}.
     */
    public UsuarioResponseDTO completarCadastro(String token, CompletarConviteCadastroDTO dto) {
        Convite convite = obterConviteAtivoPorToken(token);

        if (!convite.getEmail().trim().equalsIgnoreCase(dto.getEmail().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "O e-mail informado não confere com o convite.");
        }

        String hash = convite.getSenhaProvisoriaHash();
        if (hash != null && !hash.isBlank()) {
            if (dto.getSenhaProvisoria() == null || dto.getSenhaProvisoria().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Informe a senha provisória enviada por e-mail.");
            }
            if (!passwordEncoder.matches(dto.getSenhaProvisoria(), hash)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha provisória inválida.");
            }
        }

        if (usuarioRepository.findByEmailIgnoreCase(convite.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe cadastro para este e-mail.");
        }

        UsuarioRequestDTO usuarioDto = new UsuarioRequestDTO();
        usuarioDto.setPerfilId(convite.getPerfil().getId());
        usuarioDto.setEmail(convite.getEmail());
        usuarioDto.setNome(dto.getNome());
        usuarioDto.setCpf(dto.getCpf());
        usuarioDto.setSenha(dto.getSenha());
        usuarioDto.setTelefone(dto.getTelefone());
        usuarioDto.setDataNascimento(dto.getDataNascimento());
        usuarioDto.setCep(dto.getCep());
        usuarioDto.setLogradouro(dto.getLogradouro());
        usuarioDto.setNumero(dto.getNumero());
        usuarioDto.setComplemento(dto.getComplemento() != null ? dto.getComplemento() : "");
        usuarioDto.setBairro(dto.getBairro());
        usuarioDto.setCidade(dto.getCidade());
        usuarioDto.setUf(dto.getUf());

        try {
            UsuarioResponseDTO criado = usuarioService.criar(usuarioDto);
            convite.setStatus(ConviteStatus.USADO);
            conviteRepository.save(convite);
            return criado;
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    ex.getMessage() != null && !ex.getMessage().isBlank()
                            ? ex.getMessage()
                            : "Não foi possível concluir o cadastro.");
        }
    }

    private Convite obterConviteAtivoPorToken(String token) {
        Convite convite = conviteRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convite não encontrado."));

        if (convite.getStatus() != ConviteStatus.ATIVO) {
            throw new ResponseStatusException(HttpStatus.GONE, "Convite inválido ou já utilizado.");
        }

        if (convite.getDataExpiracao().isBefore(LocalDateTime.now())) {
            convite.setStatus(ConviteStatus.EXPIRADO);
            conviteRepository.save(convite);
            throw new ResponseStatusException(HttpStatus.GONE, "Convite expirado.");
        }

        return convite;
    }

    private ConviteResponseDTO toResponseDTO(Convite convite) {
        ConviteResponseDTO dto = new ConviteResponseDTO();

        dto.setId(convite.getId());
        dto.setEmail(convite.getEmail());
        dto.setPerfilId(convite.getPerfil().getId());
        dto.setPerfilNome(convite.getPerfil().getNome());
        dto.setDataExpiracao(convite.getDataExpiracao());
        dto.setStatus(convite.getStatus());
        String h = convite.getSenhaProvisoriaHash();
        dto.setExigeSenhaProvisoria(h != null && !h.isBlank());

        return dto;
    }
}
