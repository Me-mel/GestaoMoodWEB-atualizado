package com.gestaomood.demo.model;

import java.math.BigDecimal;

public class VendaProduto {

    private int idVenda;
    private int idProduto;
    private int quantidade;
    private BigDecimal valorUnitario;

    public VendaProduto() {
    }

    public VendaProduto(int idVenda, int idProduto, int quantidade,
                        BigDecimal valorUnitario) {
        this.idVenda = idVenda;
        this.idProduto = idProduto;
        this.quantidade = quantidade;
        this.valorUnitario = valorUnitario;
    }

    public int getIdVenda() {
        return idVenda;
    }

    public int getIdProduto() {
        return idProduto;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public BigDecimal getValorUnitario() {
        return valorUnitario;
    }
}