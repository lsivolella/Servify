package com.servify.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.servify.backend.dto.UsuarioRequestDTO;
import com.servify.backend.dto.UsuarioResponseDTO;
import com.servify.backend.entity.Usuario;
import com.servify.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {

        Usuario usuario = new Usuario();

        usuario.setPerfilId(dto.getPerfilId());
        usuario.setCpf(dto.getCpf()
                .replaceAll("\\D", ""));
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setTelefone(dto.getTelefone()
                .replaceAll("\\D", ""));
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setCep(dto.getCep()
                .replaceAll("\\D", ""));
        usuario.setLogradouro(dto.getLogradouro());
        usuario.setNumero(dto.getNumero());
        usuario.setComplemento(dto.getComplemento());
        usuario.setBairro(dto.getBairro());
        usuario.setCidade(dto.getCidade());
        usuario.setUf(dto.getUf());

        Usuario salvo = repository.save(usuario);

        return toResponseDTO(salvo);
    }

    public List<UsuarioResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public UsuarioResponseDTO buscarPorId(Long id) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return toResponseDTO(usuario);
    }

    public UsuarioResponseDTO atualizar(Long id, UsuarioRequestDTO dto) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setPerfilId(dto.getPerfilId());
        usuario.setCpf(dto.getCpf());
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        usuario.setTelefone(dto.getTelefone());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setCep(dto.getCep());
        usuario.setLogradouro(dto.getLogradouro());
        usuario.setNumero(dto.getNumero());
        usuario.setComplemento(dto.getComplemento());
        usuario.setBairro(dto.getBairro());
        usuario.setCidade(dto.getCidade());
        usuario.setUf(dto.getUf());

        Usuario atualizado = repository.save(usuario);

        return toResponseDTO(atualizado);
    }

    public void deletar(Long id) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        repository.delete(usuario);
    }

    private Usuario toEntity(UsuarioRequestDTO dto) {

        Usuario usuario = new Usuario();

        usuario.setPerfilId(dto.getPerfilId());
        usuario.setCpf(dto.getCpf());
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefone(dto.getTelefone());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setCep(dto.getCep());
        usuario.setLogradouro(dto.getLogradouro());
        usuario.setNumero(dto.getNumero());
        usuario.setComplemento(dto.getComplemento());
        usuario.setBairro(dto.getBairro());
        usuario.setCidade(dto.getCidade());
        usuario.setUf(dto.getUf());

        return usuario;
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {

        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        dto.setId(usuario.getId());
        dto.setPerfilId(usuario.getPerfilId());
        dto.setCpf(usuario.getCpf());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setTelefone(usuario.getTelefone());
        dto.setDataNascimento(usuario.getDataNascimento());
        dto.setCep(usuario.getCep());
        dto.setLogradouro(usuario.getLogradouro());
        dto.setNumero(usuario.getNumero());
        dto.setComplemento(usuario.getComplemento());
        dto.setBairro(usuario.getBairro());
        dto.setCidade(usuario.getCidade());
        dto.setUf(usuario.getUf());

        return dto;
    }
}
