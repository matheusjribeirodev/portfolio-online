// Espera o carregamento do DOM para conectar os comportamentos em todas as páginas
document.addEventListener("DOMContentLoaded", () => {
    inicializarMenu();
    inicializarAlternadorTema();
    inicializarLinkAtivo();
    inicializarFormularioContato();
    inicializarElementosRevelados();
});

function inicializarMenu() {
    const botaoMenu = document.querySelector(".botaoMenu");
    const menuPrincipal = document.querySelector(".menuPrincipal");

    if (!botaoMenu || !menuPrincipal) {
        return;
    }

    // Menu mobile com botão hambúrguer controlado por JavaScript puro
    botaoMenu.addEventListener("click", () => {
        const menuEstaAberto = menuPrincipal.classList.toggle("estaAberto");
        botaoMenu.classList.toggle("estaAberto", menuEstaAberto);
        botaoMenu.setAttribute("aria-expanded", String(menuEstaAberto));
        botaoMenu.setAttribute("aria-label", menuEstaAberto ? "Fechar menu" : "Abrir menu");
    });

    document.querySelectorAll(".listaNavegacao a").forEach((linkNavegacao) => {
        linkNavegacao.addEventListener("click", () => {
            if (window.innerWidth <= 820) {
                menuPrincipal.classList.remove("estaAberto");
                botaoMenu.classList.remove("estaAberto");
                botaoMenu.setAttribute("aria-expanded", "false");
                botaoMenu.setAttribute("aria-label", "Abrir menu");
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            menuPrincipal.classList.remove("estaAberto");
            botaoMenu.classList.remove("estaAberto");
            botaoMenu.setAttribute("aria-expanded", "false");
            botaoMenu.setAttribute("aria-label", "Abrir menu");
        }
    });
}

function inicializarAlternadorTema() {
    const alternadorTema = document.querySelector(".alternadorTema");
    const temaSalvo = localStorage.getItem("temaSitePessoal");
    const prefereTemaEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (temaSalvo === "escuro" || (!temaSalvo && prefereTemaEscuro)) {
        document.body.classList.add("temaEscuro");
    }

    atualizarRotuloAlternadorTema(alternadorTema);

    if (!alternadorTema) {
        return;
    }

    // Alternância de tema com persistência da preferência do usuário
    alternadorTema.addEventListener("click", () => {
        document.body.classList.toggle("temaEscuro");
        const temaAtual = document.body.classList.contains("temaEscuro") ? "escuro" : "claro";
        localStorage.setItem("temaSitePessoal", temaAtual);
        atualizarRotuloAlternadorTema(alternadorTema);
    });
}

function atualizarRotuloAlternadorTema(alternadorTema) {
    if (!alternadorTema) {
        return;
    }

    const temaEstaEscuro = document.body.classList.contains("temaEscuro");
    alternadorTema.textContent = temaEstaEscuro ? "Tema claro" : "Tema escuro";
}

function inicializarLinkAtivo() {
    const paginaAtual = document.body.dataset.pagina || window.location.pathname.split("/").pop();
    const linksNavegacao = document.querySelectorAll(".listaNavegacao a");

    // Destaque visual do link ativo para orientar a navegação do usuário
    linksNavegacao.forEach((linkNavegacao) => {
        const paginaDestino = linkNavegacao.getAttribute("href");
        if (paginaDestino === paginaAtual) {
            linkNavegacao.classList.add("ativo");
            linkNavegacao.setAttribute("aria-current", "page");
        }
    });
}

function inicializarFormularioContato() {
    const formularioContato = document.getElementById("formularioContato");

    if (!formularioContato) {
        return;
    }

    const camposFormulario = {
        campoNome: {
            campo: document.getElementById("campoNome"),
            elementoErro: document.getElementById("mensagemErroNome"),
            textoErro: "Preencha seu nome."
        },
        campoEmail: {
            campo: document.getElementById("campoEmail"),
            elementoErro: document.getElementById("mensagemErroEmail"),
            textoErro: "Preencha seu e-mail."
        },
        campoMensagem: {
            campo: document.getElementById("campoMensagem"),
            elementoErro: document.getElementById("mensagemErroMensagem"),
            textoErro: "Escreva uma mensagem."
        }
    };

    const mensagemSucessoFormulario = document.getElementById("mensagemSucessoFormulario");

    Object.values(camposFormulario).forEach(({ campo }) => {
        campo.addEventListener("input", () => {
            limparErroCampo(campo);
            if (mensagemSucessoFormulario) {
                mensagemSucessoFormulario.textContent = "";
            }
        });
    });

    // Validação obrigatória e simulação de envio sem recarregar a página
    formularioContato.addEventListener("submit", (eventoEnvio) => {
        eventoEnvio.preventDefault();

        let formularioEstaValido = true;
        if (mensagemSucessoFormulario) {
            mensagemSucessoFormulario.textContent = "";
        }

        Object.entries(camposFormulario).forEach(([nomeCampo, configuracaoCampo]) => {
            const valorCampo = configuracaoCampo.campo.value.trim();

            if (!valorCampo) {
                definirErroCampo(configuracaoCampo.campo, configuracaoCampo.elementoErro, configuracaoCampo.textoErro);
                formularioEstaValido = false;
                return;
            }

            if (nomeCampo === "campoEmail" && !emailEhValido(valorCampo)) {
                definirErroCampo(configuracaoCampo.campo, configuracaoCampo.elementoErro, "Digite um e-mail válido.");
                formularioEstaValido = false;
                return;
            }

            limparErroCampo(configuracaoCampo.campo);
        });

        if (!formularioEstaValido) {
            return;
        }

        formularioContato.reset();
        Object.values(camposFormulario).forEach(({ campo }) => limparErroCampo(campo));
        if (mensagemSucessoFormulario) {
            mensagemSucessoFormulario.textContent = "Mensagem enviada com sucesso!";
        }
    });
}

function definirErroCampo(campo, elementoErro, textoErro) {
    const grupoFormulario = campo.closest(".grupoFormulario");
    if (grupoFormulario) {
        grupoFormulario.classList.add("temErro");
    }
    if (elementoErro) {
        elementoErro.textContent = textoErro;
    }
}

function limparErroCampo(campo) {
    const grupoFormulario = campo.closest(".grupoFormulario");
    if (grupoFormulario) {
        grupoFormulario.classList.remove("temErro");
    }

    const elementoErro = grupoFormulario ? grupoFormulario.querySelector(".mensagemErro") : null;
    if (elementoErro) {
        elementoErro.textContent = "";
    }
}

function emailEhValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function inicializarElementosRevelados() {
    const elementosRevelados = document.querySelectorAll(".revelar");

    if (!elementosRevelados.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        elementosRevelados.forEach((elementoRevelado) => elementoRevelado.classList.add("estaVisivel"));
        return;
    }

    // Pequena interação visual para tornar a leitura mais agradável sem exagerar na animação
    const observadorIntersecao = new IntersectionObserver((entradasObservadas, observadorAtual) => {
        entradasObservadas.forEach((entradaObservada) => {
            if (entradaObservada.isIntersecting) {
                entradaObservada.target.classList.add("estaVisivel");
                observadorAtual.unobserve(entradaObservada.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elementosRevelados.forEach((elementoRevelado) => observadorIntersecao.observe(elementoRevelado));
}
