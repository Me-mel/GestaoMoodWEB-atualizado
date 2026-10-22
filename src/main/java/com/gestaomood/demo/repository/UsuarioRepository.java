
package com.gestaomood.demo.repository;

import com.gestaomood.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    Optional<Usuario> findByEmailAndSenha(String email, String senha);
}
