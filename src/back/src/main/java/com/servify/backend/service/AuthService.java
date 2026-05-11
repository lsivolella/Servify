package com.servify.backend.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.servify.backend.dto.LoginResponseDTO;
import com.servify.backend.entity.Usuario;
import com.servify.backend.repository.UsuarioRepository;

@Service
public class AuthService {
  private final UsuarioRepository usuarioRepository;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public AuthService(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  private static String cargoFromPerfilId(Integer perfilId) {
    if (perfilId == null) return "";
    if (perfilId == 1) return "adm";
    if (perfilId == 2) return "colaborador";
    if (perfilId == 3) return "cliente";
    return "";
  }

  public LoginResponseDTO login(String login, String senha) {
    String l = login == null ? "" : login.trim();
    if (l.isBlank() || senha == null || senha.isBlank()) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Informe login e senha.");
    }

    Optional<Usuario> userOpt = usuarioRepository.findByEmailIgnoreCase(l);
    if (userOpt.isEmpty()) {
      String cpfDigits = l.replaceAll("\\D", "");
      if (!cpfDigits.isBlank()) {
        userOpt = usuarioRepository.findByCpf(cpfDigits);
      }
    }

    Usuario user = userOpt.orElseThrow(
        () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado."));
    if (!passwordEncoder.matches(senha, user.getSenha())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha incorreta.");
    }

    LoginResponseDTO dto = new LoginResponseDTO();
    dto.setId(user.getId());
    dto.setPerfilId(user.getPerfil().getId());
    dto.setPerfilNome(user.getPerfil().getNome());
    dto.setCargo(cargoFromPerfilId(user.getPerfil().getId()));
    dto.setNome(user.getNome());
    dto.setEmail(user.getEmail());
    return dto;
  }
}

