package com.servify.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceUnit;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @PersistenceUnit
    private EntityManagerFactory emf;

    @GetMapping
    public String test() {
        return "Usuario funcionando";
    }
}
