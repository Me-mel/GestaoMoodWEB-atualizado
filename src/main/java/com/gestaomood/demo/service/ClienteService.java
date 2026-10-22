
package com.gestaomood.demo.service;

import com.gestaomood.demo.model.Cliente;
import com.gestaomood.demo.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public Cliente cadastrar(Cliente cliente) {
        if (repository.existsByCpf(cliente.getCpf())) {
            throw new IllegalArgumentException("Este CPF ja está cadastrado.");
        }

        return repository.save(cliente);
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }
}

