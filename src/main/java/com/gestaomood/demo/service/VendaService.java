
package com.gestaomood.demo.service;

import com.gestaomood.demo.model.Vendas;
import com.gestaomood.demo.repository.VendaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class VendaService {

    private final VendaRepository repository;

    public VendaService(VendaRepository repository) {
        this.repository = repository;
    }

    public Vendas registrar(Vendas venda) {
        if (venda.getData() == null) {
            venda.setData(LocalDate.now());
        }

        if (venda.getValorTotal() == null ||
                venda.getValorTotal().signum() <= 0) {
            throw new IllegalArgumentException("Informe um valor de venda valido.");
        }

        return repository.save(venda);
    }
}
