
package com.gestaomood.demo.controller;

import com.gestaomood.demo.model.Cliente;
import com.gestaomood.demo.model.Vendas;
import com.gestaomood.demo.repository.ProdutoRepository;
import com.gestaomood.demo.repository.ColecoesRepository;
import com.gestaomood.demo.repository.FornecedorRepository;
import com.gestaomood.demo.service.ClienteService;
import com.gestaomood.demo.service.LoginService;
import com.gestaomood.demo.service.VendaService;
import com.gestaomood.demo.service.CalculoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final LoginService loginService;
    private final ClienteService clienteService;
    private final VendaService vendaService;
    private final CalculoService calculoService;
    private final ProdutoRepository produtoRepository;
    private final ColecoesRepository colecaoRepository;
    private final FornecedorRepository fornecedorRepository;

    public ApiController(
            LoginService loginService,
            ClienteService clienteService,
            VendaService vendaService,
            CalculoService calculoService,
            ProdutoRepository produtoRepository,
            ColecoesRepository colecaoRepository,
            FornecedorRepository fornecedorRepository) {

        this.loginService = loginService;
        this.clienteService = clienteService;
        this.vendaService = vendaService;
        this.calculoService = calculoService;
        this.produtoRepository = produtoRepository;
        this.colecaoRepository = colecaoRepository;
        this.fornecedorRepository = fornecedorRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        boolean valido = loginService.login(
                dados.get("email"),
                dados.get("senha")
        );

        if (!valido) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensagem", "Email ou senha inválidos."));
        }

        return ResponseEntity.ok(
                Map.of("mensagem", "Login realizado com sucesso.")
        );
    }

    @GetMapping("/clientes")
    public ResponseEntity<?> listarClientes() {
        return ResponseEntity.ok(clienteService.listar());
    }

    @PostMapping("/clientes")
    public ResponseEntity<?> cadastrarCliente(@RequestBody Cliente cliente) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(clienteService.cadastrar(cliente));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensagem", e.getMessage()));
        }
    }

    @PostMapping("/vendas")
    public ResponseEntity<?> registrarVenda(@RequestBody Vendas venda) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(vendaService.registrar(venda));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensagem", e.getMessage()));
        }
    }

    @GetMapping("/produtos")
    public ResponseEntity<?> listarProdutos() {
        return ResponseEntity.ok(produtoRepository.findAll());
    }

    @GetMapping("/colecoes")
    public ResponseEntity<?> listarColecoes() {
        return ResponseEntity.ok(colecaoRepository.findAll());
    }

    @GetMapping("/fornecedores")
    public ResponseEntity<?> listarFornecedores() {
        return ResponseEntity.ok(fornecedorRepository.findAll());
    }

    @PostMapping("/calcular")
    public ResponseEntity<?> calcular(@RequestBody Map<String, BigDecimal> dados) {
        try {
            BigDecimal total = calculoService.calcular(
                    dados.get("valorCompra"),
                    dados.get("desconto")
            );

            return ResponseEntity.ok(Map.of("total", total));
        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensagem", "Informe valores válidos."));
        }
    }
}
