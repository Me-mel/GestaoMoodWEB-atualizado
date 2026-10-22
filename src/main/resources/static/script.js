
const API = "/api";

const clientes = [];
const vendas = [];

const rotasEstoque = {
    colecoes: "/colecoes",
    produtos: "/produtos",
    fornecedores: "/fornecedores"
};

const titulosEstoque = {
    colecoes: "Coleções",
    produtos: "Produtos",
    fornecedores: "Fornecedores"
};

async function requisicao(url, opcoes = {}) {
    const configuracao = {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...(opcoes.headers || {})
        }
    };

    const resposta = await fetch(url, configuracao);
    const texto = await resposta.text();

    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
        }
    }

    if (!resposta.ok) {
        const mensagem =
            dados && typeof dados === "object"
                ? dados.mensagem || dados.message || dados.error
                : null;

        throw new Error(
            mensagem || `Erro ${resposta.status}: ${resposta.statusText}`
        );
    }

    return dados;
}

function notificar(mensagem) {
    const elementoMensagem = document.getElementById("mensagemNotificacao");
    const elementoToast = document.getElementById("notificacao");

    if (!elementoMensagem || !elementoToast) {
        alert(mensagem);
        return;
    }

    elementoMensagem.textContent = mensagem;

    if (window.bootstrap && bootstrap.Toast) {
        bootstrap.Toast.getOrCreateInstance(elementoToast).show();
    } else {
        alert(mensagem);
    }
}

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.toggle("ativa", tela.id === id);
    });

    if (id === "venda") {
        carregarClientes();
    }
}

function converterNumero(valor) {
    if (typeof valor === "number") {
        return valor;
    }

    let texto = String(valor ?? "").trim();

    if (!texto) {
        return 0;
    }

    texto = texto.replace(/[R$\s]/g, "");

    if (texto.includes(",") && texto.includes(".")) {
        texto = texto.replace(/\./g, "").replace(",", ".");
    } else if (texto.includes(",")) {
        texto = texto.replace(",", ".");
    }

    const numero = Number(texto);

    return Number.isFinite(numero) ? numero : NaN;
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarCPF(valor) {
    let numero = valor.replace(/\D/g, "").slice(0, 11);

    if (numero.length > 9) {
        numero = numero.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
            "$1.$2.$3-$4"
        );
    } else if (numero.length > 6) {
        numero = numero.replace(
            /^(\d{3})(\d{3})(\d+)$/,
            "$1.$2.$3"
        );
    } else if (numero.length > 3) {
        numero = numero.replace(
            /^(\d{3})(\d+)$/,
            "$1.$2"
        );
    }

    return numero;
}

function formatarTelefone(valor) {
    let numero = valor.replace(/\D/g, "").slice(0, 11);

    if (numero.length === 11) {
        return numero.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    if (numero.length === 10) {
        return numero.replace(
            /^(\d{2})(\d{4})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    if (numero.length > 6) {
        return numero.replace(
            /^(\d{2})(\d{4})(\d+)$/,
            "($1) $2-$3"
        );
    }

    if (numero.length > 2) {
        return numero.replace(
            /^(\d{2})(\d+)$/,
            "($1) $2"
        );
    }

    return numero;
}

async function carregarClientes() {
    const campoCliente = document.getElementById("clienteVenda");

    if (!campoCliente) {
        return;
    }

    try {
        const resultado = await requisicao(API + "/clientes");
        const lista = Array.isArray(resultado) ? resultado : [];

        clientes.length = 0;
        clientes.push(...lista);

        campoCliente.replaceChildren();

        const opcaoInicial = document.createElement("option");
        opcaoInicial.value = "";
        opcaoInicial.textContent = "Selecione um cliente";
        campoCliente.appendChild(opcaoInicial);

        lista.forEach((cliente, indice) => {
            const opcao = document.createElement("option");

            opcao.value = String(indice);
            opcao.textContent =
                cliente.nome ||
                cliente.nomeCliente ||
                `Cliente ${cliente.id ?? indice + 1}`;

            campoCliente.appendChild(opcao);
        });
    } catch (erro) {
        notificar("Não foi possível carregar os clientes: " + erro.message);
    }
}

function normalizarOpcao(valor) {
    return String(valor ?? "")
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

async function consultarEstoque(opcaoRecebida) {
    const opcao = normalizarOpcao(opcaoRecebida);
    const rota = rotasEstoque[opcao];

    if (!rota) {
        notificar(
            `Opção de estoque inválida: "${opcaoRecebida}".`
        );
        return;
    }

    try {
        const resultado = await requisicao(API + rota);
        mostrarResultadoEstoque(
            titulosEstoque[opcao],
            resultado
        );
    } catch (erro) {
        notificar(
            `Erro ao consultar ${titulosEstoque[opcao]}: ${erro.message}`
        );
    }
}

function mostrarResultadoEstoque(titulo, dados) {
    let resultado = document.getElementById("resultadoEstoque");

    if (!resultado) {
        resultado = document.createElement("div");
        resultado.id = "resultadoEstoque";
        resultado.style.marginTop = "20px";
        resultado.style.maxHeight = "350px";
        resultado.style.overflowY = "auto";
        resultado.style.overflowWrap = "anywhere";

        const caixa = document.querySelector("#estoque .estoque-caixa");

        if (!caixa) {
            notificar("Não foi possível encontrar a área do estoque.");
            return;
        }

        caixa.appendChild(resultado);
    }

    resultado.replaceChildren();

    const cabecalho = document.createElement("h3");
    cabecalho.textContent = titulo;
    resultado.appendChild(cabecalho);

    if (Array.isArray(dados) && dados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum registro encontrado.";
        resultado.appendChild(mensagem);
        return;
    }

    if (dados === null || dados === undefined) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "A consulta não retornou dados.";
        resultado.appendChild(mensagem);
        return;
    }

    if (Array.isArray(dados)) {
        dados.forEach((item, indice) => {
            const registro = document.createElement("div");

            registro.style.padding = "10px";
            registro.style.marginBottom = "8px";
            registro.style.border = "1px solid #d5d5d5";
            registro.style.borderRadius = "6px";

            if (item && typeof item === "object") {
                Object.entries(item).forEach(([chave, valor]) => {
                    const linha = document.createElement("p");
                    linha.style.margin = "4px 0";
                    linha.textContent =
                        `${chave}: ${
                            valor === null || valor === undefined
                                ? ""
                                : typeof valor === "object"
                                    ? JSON.stringify(valor)
                                    : valor
                        }`;

                    registro.appendChild(linha);
                });
            } else {
                registro.textContent = String(item);
            }

            resultado.appendChild(registro);
        });

        return;
    }

    const conteudo = document.createElement("pre");
    conteudo.style.whiteSpace = "pre-wrap";
    conteudo.style.overflowWrap = "anywhere";
    conteudo.textContent = JSON.stringify(dados, null, 2);

    resultado.appendChild(conteudo);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-tela]").forEach(botao => {
        botao.addEventListener("click", () => {
            mostrarTela(botao.dataset.tela);
        });
    });

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async evento => {
            evento.preventDefault();

            const campoEmail = document.getElementById("usuario");
            const campoSenha = document.getElementById("senha");

            if (!campoEmail || !campoSenha) {
                notificar("Não foi possível localizar os campos de login.");
                return;
            }

            const email = campoEmail.value.trim();
            const senha = campoSenha.value;

            if (!email || !senha) {
                notificar("Preencha o email e a senha.");
                return;
            }

            const botaoEnviar = loginForm.querySelector(
                'button[type="submit"]'
            );

            if (botaoEnviar) {
                botaoEnviar.disabled = true;
            }

            try {
                await requisicao(API + "/login", {
                    method: "POST",
                    body: JSON.stringify({ email, senha })
                });

                mostrarTela("inicio");
                notificar("Login realizado com sucesso!");
            } catch (erro) {
                notificar("Não foi possível realizar o login: " + erro.message);
            } finally {
                if (botaoEnviar) {
                    botaoEnviar.disabled = false;
                }
            }
        });
    }

    const clienteForm = document.getElementById("clienteForm");

    if (clienteForm) {
        clienteForm.addEventListener("submit", async evento => {
            evento.preventDefault();

            const cliente = {
                nome: document.getElementById("nome").value.trim(),
                email: document.getElementById("email").value.trim(),
                endereco: document.getElementById("endereco").value.trim(),
                cpf: document.getElementById("cpf").value.trim(),
                telefone: document.getElementById("telefone").value.trim()
            };

            if (
                !cliente.nome ||
                !cliente.email ||
                !cliente.endereco ||
                !cliente.cpf ||
                !cliente.telefone
            ) {
                notificar("Preencha todos os campos do cliente.");
                return;
            }

            try {
                await requisicao(API + "/clientes", {
                    method: "POST",
                    body: JSON.stringify(cliente)
                });

                clienteForm.reset();
                await carregarClientes();

                notificar("Cliente cadastrado com sucesso!");
                mostrarTela("inicio");
            } catch (erro) {
                notificar("Não foi possível cadastrar o cliente: " + erro.message);
            }
        });
    }

    const campoCPF = document.getElementById("cpf");

    if (campoCPF) {
        campoCPF.addEventListener("input", evento => {
            evento.target.value = formatarCPF(evento.target.value);
        });
    }

    const campoTelefone = document.getElementById("telefone");

    if (campoTelefone) {
        campoTelefone.addEventListener("input", evento => {
            evento.target.value = formatarTelefone(evento.target.value);
        });
    }

    const compraForm = document.getElementById("compraForm");

    if (compraForm) {
        compraForm.addEventListener("submit", evento => {
            evento.preventDefault();

            const valor = converterNumero(
                document.getElementById("valorCompra").value
            );

            const desconto = converterNumero(
                document.getElementById("desconto").value
            );

            if (
                !Number.isFinite(valor) ||
                !Number.isFinite(desconto) ||
                valor < 0 ||
                desconto < 0 ||
                desconto > 100
            ) {
                notificar("Informe valores válidos.");
                return;
            }

            const total = valor * (1 - desconto / 100);

            document.getElementById("valorFinal").value =
                formatarMoeda(total);

            notificar("Cálculo realizado com sucesso!");
        });
    }

    const vendaForm = document.getElementById("vendaForm");

    if (vendaForm) {
        vendaForm.addEventListener("submit", async evento => {
            evento.preventDefault();

            const valor = converterNumero(
                document.getElementById("valorVenda").value
            );

            const pagamento = document.getElementById("pagamento").value;
            const indice = document.getElementById("clienteVenda").value;
            const funcionarioTexto =
                document.getElementById("funcionario").value.trim();

            if (!Number.isFinite(valor) || valor <= 0) {
                notificar("Informe um valor de venda válido.");
                return;
            }

            if (!pagamento) {
                notificar("Selecione a forma de pagamento.");
                return;
            }

            if (indice === "" || !clientes[Number(indice)]) {
                notificar("Selecione um cliente cadastrado.");
                return;
            }

            const funcionarioId = Number(funcionarioTexto);

            if (!Number.isInteger(funcionarioId) || funcionarioId <= 0) {
                notificar("Informe o número de identificação do funcionário.");
                return;
            }

            const clienteSelecionado = clientes[Number(indice)];
            const clienteId = Number(
                clienteSelecionado.id ?? clienteSelecionado.idCliente
            );

            if (!Number.isInteger(clienteId) || clienteId <= 0) {
                notificar("Não foi possível identificar o cliente selecionado.");
                return;
            }

            const venda = {
                data: new Date().toISOString().slice(0, 10),
                valorTotal: valor,
                pagamento: pagamento,
                idCliente: clienteId,
                idFuncionario: funcionarioId
            };

            try {
                await requisicao(API + "/vendas", {
                    method: "POST",
                    body: JSON.stringify(venda)
                });

                vendas.push(venda);
                vendaForm.reset();

                notificar("Venda registrada com sucesso!");
                mostrarTela("inicio");
            } catch (erro) {
                notificar("Não foi possível registrar a venda: " + erro.message);
            }
        });
    }

    document.querySelectorAll("[data-opcao]").forEach(botao => {
        botao.addEventListener("click", () => {
            consultarEstoque(botao.dataset.opcao);
        });
    });
});
