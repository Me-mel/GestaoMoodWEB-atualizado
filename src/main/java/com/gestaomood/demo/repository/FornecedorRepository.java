
package com.gestaomood.demo.repository;

import com.gestaomood.demo.model.Fornecedores;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FornecedorRepository extends JpaRepository<Fornecedores, Integer> {
}
