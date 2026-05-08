package com.servify.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.servify.backend.dto.UsuarioRequestDTO;
import com.servify.backend.dto.UsuarioResponseDTO;
import com.servify.backend.entity.Usuario;
import com.servify.backend.repository.UsuarioRepository;

public class UsuarioServiceTest {
    @Mock
    private UsuarioRepository repository;

    private UsuarioService service;

    @BeforeEach
    public void SetUp() {
        MockitoAnnotations.openMocks(this);
        service = new UsuarioService(repository);
    }

    @Test
    public void deveAtualizarUsuario() {
        // Simula um usuário existente no banco de dados
        Usuario usuario = new Usuario();

        usuario.setUsuarioId(1L);
        usuario.setTelefone("31999999999");

        // Simula um usuário atualizado vindo da requisição
        UsuarioRequestDTO dto = new UsuarioRequestDTO();

        dto.setPerfilId(1);
        dto.setCpf("12345678901");
        dto.setNome("Teste Servify");
        dto.setEmail("teste@email.com");
        dto.setSenha("123456");
        dto.setTelefone("31111111111");
        dto.setDataNascimento(LocalDate.of(2000, 1, 1));
        dto.setCep("30140071");
        dto.setLogradouro("Rua A");
        dto.setNumero("100");
        dto.setComplemento("Casa");
        dto.setBairro("Centro");
        dto.setCidade("Belo Horizonte");
        dto.setUf("MG");

        // Configura o mock para retornar o usuário existente
        when(repository.findById(1L))
                .thenReturn(Optional.of(usuario));

        // Configura o mock para retornar o usuário atualizado ao salvar
        when(repository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Chama o método de atualização
        UsuarioResponseDTO response = service.atualizar(1L, dto);

        // Verifica se o telefone foi atualizado corretamente
        assertEquals("31111111111", response.getTelefone());
    }

    @Test
    public void deveCriptografarSenhaAoCriarUsuario() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();

        dto.setPerfilId(1);
        dto.setCpf("12345678901");
        dto.setNome("Teste Servify");
        dto.setEmail("teste@email.com");
        dto.setSenha("123456");
        dto.setTelefone("31999999999");
        dto.setDataNascimento(LocalDate.of(2000, 1, 1));
        dto.setCep("30140071");
        dto.setLogradouro("Rua A");
        dto.setNumero("100");
        dto.setComplemento("Casa");
        dto.setBairro("Centro");
        dto.setCidade("Belo Horizonte");
        dto.setUf("MG");

        when(repository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        service.criar(dto);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);

        verify(repository).save(captor.capture());

        Usuario usuarioSalvo = captor.getValue();

        assertNotEquals("123456", usuarioSalvo.getSenha());
        assertTrue(usuarioSalvo.getSenha().startsWith("$2"));
    }

    @Test
    public void deveNormalizarCpfAoCriarUsuario() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();

        dto.setPerfilId(1);
        dto.setCpf("123.456.789-01");
        dto.setNome("Teste Servify");
        dto.setEmail("teste@email.com");
        dto.setSenha("123456");
        dto.setTelefone("31999999999");
        dto.setDataNascimento(LocalDate.of(2000, 1, 1));
        dto.setCep("30140071");
        dto.setLogradouro("Rua A");
        dto.setNumero("100");
        dto.setComplemento("Casa");
        dto.setBairro("Centro");
        dto.setCidade("Belo Horizonte");
        dto.setUf("MG");

        when(repository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        service.criar(dto);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);

        verify(repository).save(captor.capture());

        Usuario usuarioSalvo = captor.getValue();

        assertEquals("12345678901", usuarioSalvo.getCpf());
    }

    @Test
    public void deveNormalizarTelefoneAoCriarUsuario() {
        UsuarioRequestDTO dto = new UsuarioRequestDTO();

        dto.setPerfilId(1);
        dto.setCpf("12345678901");
        dto.setNome("Teste Servify");
        dto.setEmail("teste@email.com");
        dto.setSenha("123456");
        dto.setTelefone("(31) 99999-9999");
        dto.setDataNascimento(LocalDate.of(2000, 1, 1));
        dto.setCep("30140071");
        dto.setLogradouro("Rua A");
        dto.setNumero("100");
        dto.setComplemento("Casa");
        dto.setBairro("Centro");
        dto.setCidade("Belo Horizonte");
        dto.setUf("MG");

        when(repository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        service.criar(dto);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);

        verify(repository).save(captor.capture());

        Usuario usuarioSalvo = captor.getValue();

        assertEquals("31999999999", usuarioSalvo.getTelefone());
    }

    @Test
    public void deveBuscarUsuarioPorId() {
        Usuario usuario = new Usuario();

        usuario.setUsuarioId(1L);
        usuario.setPerfilId(1);
        usuario.setCpf("12345678901");
        usuario.setNome("Teste Servify");
        usuario.setEmail("teste@email.com");
        usuario.setSenha("123456");
        usuario.setTelefone("31999999999");
        usuario.setDataNascimento(LocalDate.of(2000, 1, 1));
        usuario.setCep("30140071");
        usuario.setLogradouro("Rua A");
        usuario.setNumero("100");
        usuario.setComplemento("Casa");
        usuario.setBairro("Centro");
        usuario.setCidade("Belo Horizonte");
        usuario.setUf("MG");

        when(repository.findById(1L))
                .thenReturn(Optional.of(usuario));

        UsuarioResponseDTO response = service.buscarPorId(1L);

        assertEquals(1L, response.getUsuarioId());
        assertEquals("Teste Servify", response.getNome());
        assertEquals("12345678901", response.getCpf());
        assertEquals("teste@email.com", response.getEmail());
    }

    @Test
    public void deveLancarExcecaoQuandoUsuarioNaoExiste() {
        when(repository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.buscarPorId(1L));

        assertEquals(
                "Usuário não encontrado",
                exception.getMessage());
    }

    @Test
    public void deveDeletarUsuario() {
        Usuario usuario = new Usuario();
        usuario.setUsuarioId(1L);

        when(repository.findById(1L))
                .thenReturn(Optional.of(usuario));

        service.deletar(1L);

        verify(repository).delete(usuario);
    }
}
