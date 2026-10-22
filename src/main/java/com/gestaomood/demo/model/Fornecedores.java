
package com.gestaomood.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fornecedores")
public class Fornecedores {

   @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "id_fornecedor")
 private Integer idFor;

    @Column(name = "nome_fornecedor")
    private String nome;

    @Column(name = "cnpj")
    private String cnpj;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "email")
    private String email;

    public Fornecedores() {
    }

    public Integer getId() { return idFor; }
    public void setId(Integer id) { this.idFor = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
