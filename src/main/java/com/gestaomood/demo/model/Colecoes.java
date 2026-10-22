
package com.gestaomood.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "colecoes")
public class Colecoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_colecao")
    private Integer id;

    @Column(name = "nome_colecao")
    private String nome;

    @Column(name = "tema")
    private String tema;

    @Column(name = "data_lancamento")
    private LocalDate data;

    @Column(name = "temporada")
    private String temporada;

    @Column(name = "fornecedor_id")
    private Integer idFornecedor;

    public Colecoes() {
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public String getTemporada() { return temporada; }
    public void setTemporada(String temporada) { this.temporada = temporada; }

    public Integer getIdFornecedor() { return idFornecedor; }
    public void setIdFornecedor(Integer idFornecedor) { this.idFornecedor = idFornecedor; }
}
