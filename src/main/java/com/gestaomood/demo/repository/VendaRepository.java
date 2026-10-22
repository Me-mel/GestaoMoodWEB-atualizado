
package com.gestaomood.demo.repository;

import com.gestaomood.demo.model.Vendas;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaRepository extends JpaRepository<Vendas, Integer> {
}

