
package com.gestaomood.demo.service;

import com.gestaomood.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final UsuarioRepository repository;

    public LoginService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public boolean login(String email, String senha) {
        return repository.findByEmailAndSenha(email, senha).isPresent();
    }
}
