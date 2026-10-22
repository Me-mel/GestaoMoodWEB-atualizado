package com.gestaomood.demo.model;

import java.time.LocalDate;

public class Funcionario {

    private int id;
    private String nome;
    private String cargo;
    private LocalDate dataContratacao;
    private String status;

    public Funcionario() {
    }

    public Funcionario(int id, String nome, String cargo,
                       LocalDate dataContratacao, String status) {
        this.id = id;
        this.nome = nome;
        this.cargo = cargo;
        this.dataContratacao = dataContratacao;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCargo() {
        return cargo;
    }

    public LocalDate getDataContratacao() {
        return dataContratacao;
    }

    public String getStatus() {
        return status;
    }
}