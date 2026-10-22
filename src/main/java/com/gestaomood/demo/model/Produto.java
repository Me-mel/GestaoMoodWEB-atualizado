
package com.gestaomood.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto")
    private Integer id;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "cor")
    private String cor;

    @Column(name = "preco")
    private BigDecimal preco;

    @Column(name = "marca")
    private String marca;

    @Column(name = "SKU")
    private String sku;

   @Column(name = "quantidade_em_estoque")
   private Integer quantidade;

    @Column(name = "id_colecao")
    private Integer idColecao;

    public Produto() {
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Integer getQuantidadeEstoque() { return quantidade; }
    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidade = quantidadeEstoque;
    }

    public Integer getIdColecao() { return idColecao; }
    public void setIdColecao(Integer idColecao) { this.idColecao = idColecao; }
}
