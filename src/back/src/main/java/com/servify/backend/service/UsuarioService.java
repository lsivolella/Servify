package com.servify.backend.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.servify.backend.entity.Usuario;
import com.servify.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Usuario criar(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
        Usuario usuario = buscarPorId(id);

        usuario.setPerfilId(usuarioAtualizado.getPerfilId());
        usuario.setCpf(usuarioAtualizado.getCpf());
        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        if (usuarioAtualizado.getSenha() != null) {
            usuario.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
        }
        usuario.setTelefone(usuarioAtualizado.getTelefone());
        usuario.setDataNascimento(usuarioAtualizado.getDataNascimento());
        usuario.setCep(usuarioAtualizado.getCep());
        usuario.setLogradouro(usuarioAtualizado.getLogradouro());
        usuario.setNumero(usuarioAtualizado.getNumero());
        usuario.setComplemento(usuarioAtualizado.getComplemento());
        usuario.setBairro(usuarioAtualizado.getBairro());
        usuario.setCidade(usuarioAtualizado.getCidade());
        usuario.setUf(usuarioAtualizado.getUf());

        return repository.save(usuario);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
