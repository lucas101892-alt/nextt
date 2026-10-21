

// Modo escuro / claro
const modoBtn = document.getElementById("modoBtn");
const temaSalvo = localStorage.getItem("nextFightTema");

if (temaSalvo === "dark") {
    document.body.classList.add("dark");
    if (modoBtn) modoBtn.textContent = "Modo Claro";
}

if (modoBtn) {
    modoBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const dark = document.body.classList.contains
        ("dark");
        modoBtn.textContent = dark ? "Modo Claro" :
         "Modo Escuro";
        localStorage.setItem("nextFightTema", dark ?
         "dark" : "light");
    });
}
 


// "Ver modalidades": mostra os dias e horários da modalidade. 
document.querySelectorAll(".creative-btn").forEach(botao => {
    botao.addEventListener("click", () => {
        const modalidade = botao.dataset.modalidade;
        const id = "info-" + modalidade.toLowerCase().replace(/\s+/g, "-");
        const info = document.getElementById(id);
        document.querySelectorAll(".training-info").forEach(item => {
            if (item !== info) item.classList.remove("show");
        });
        if (info) {
            const aberto = info.classList.toggle("show");
            botao.textContent = aberto ? "Ocultar horários ↑" : "Ver modalidades";
        }
    });
});

// Cálculo automático dos planos.
const plano = document.getElementById("plano");
const valorPlano = document.getElementById("valorPlano");
if (plano && valorPlano) {
    plano.addEventListener("change", () => {
        const valor = Number(plano.value);
        valorPlano.textContent = valor ? valor.toLocaleString("pt-BR", {style:"currency", currency:"BRL"}) : "R$ 0,00";
    });
}

// Formulário da página de contato.
const formulario = document.getElementById("formulario");
if (formulario) {
    formulario.addEventListener("submit", event => {
        event.preventDefault();
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const assunto = document.getElementById("assunto").value;
        const mensagem = document.getElementById("mensagem").value.trim();
        const resposta = document.getElementById("mensagemForm");
        if (!nome || !email || !assunto || !mensagem) {
            resposta.textContent = "Por favor, preencha todos os campos.";
            resposta.style.color = "#e50914";
            return;
        }
        resposta.textContent = `Mensagem enviada com sucesso, ${nome}! A NEXT FIGHT entrará em contato.`;
        resposta.style.color = "green";
        formulario.reset();
    });
}

// Controle de cadastros: os dados são mantidos no localStorage deste navegador.
const cadastroForm = document.getElementById("cadastroForm");
const STORAGE_KEY = "nextFightCadastros";
const lerCadastros = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const salvarCadastros = cadastros => localStorage.setItem(STORAGE_KEY, JSON.stringify(cadastros));
const escapeHtml = valor => String(valor || "").replace(/[&<>'"]/g, caractere => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[caractere]));

if (cadastroForm) {
    const ids = ["cadNome", "cadNascimento", "cadEmail", "cadTelefone", "cadModalidade", "cadPlano", "cadNivel", "cadObservacao"];
    const resposta = document.getElementById("mensagemCadastro");
    const lista = document.getElementById("listaCadastros");
    const busca = document.getElementById("buscarCadastro");
    const filtroModalidade = document.getElementById("filtroModalidade");
    const filtroStatus = document.getElementById("filtroStatus");

    const atualizarFiltros = cadastros => {
        const atual = filtroModalidade.value;
        const modalidades = [...new Set(cadastros.map(item => item.modalidade))].sort();
        filtroModalidade.innerHTML = '<option value="">Todas as modalidades</option>' + modalidades.map(item => `<option>${escapeHtml(item)}</option>`).join("");
        filtroModalidade.value = modalidades.includes(atual) ? atual : "";
    };

    const renderizar = () => {
        const cadastros = lerCadastros();
        atualizarFiltros(cadastros);
        const termo = busca.value.trim().toLowerCase();
        const filtrados = cadastros.filter(item => {
            const combinaBusca = !termo || [item.nome, item.email, item.telefone].some(valor => valor.toLowerCase().includes(termo));
            return combinaBusca && (!filtroModalidade.value || item.modalidade === filtroModalidade.value) && (!filtroStatus.value || item.status === filtroStatus.value);
        });
        document.getElementById("totalCadastros").textContent = cadastros.length;
        document.getElementById("cadastrosAtivos").textContent = cadastros.filter(item => item.status === "ativo").length;
        document.getElementById("modalidadesAtivas").textContent = new Set(cadastros.map(item => item.modalidade)).size;
        lista.innerHTML = filtrados.length ? filtrados.map(item => `<tr>
            <td><strong>${escapeHtml(item.nome)}</strong><small>Nasc.: ${escapeHtml(item.nascimento)}</small></td>
            <td>${escapeHtml(item.email)}<small>${escapeHtml(item.telefone)}</small></td>
            <td>${escapeHtml(item.modalidade)}<small>${escapeHtml(item.nivel)}</small></td>
            <td>${escapeHtml(item.plano)}</td>
            <td><button class="status-badge ${item.status}" data-action="status" data-id="${item.id}">${item.status === "ativo" ? "Ativo" : "Inativo"}</button></td>
            <td class="action-buttons"><button data-action="editar" data-id="${item.id}" title="Editar cadastro">Editar</button><button class="danger" data-action="excluir" data-id="${item.id}" title="Excluir cadastro">Excluir</button></td>
        </tr>`).join("") : '<tr><td colspan="6" class="empty-state">Nenhum cadastro encontrado.</td></tr>';
    };

    cadastroForm.addEventListener("submit", event => {
        event.preventDefault();
        const dados = Object.fromEntries(ids.map(id => [id.replace("cad", "").toLowerCase(), document.getElementById(id).value.trim()]));
        const cadastros = lerCadastros();
        const idAtual = document.getElementById("cadastroId").value;
        if (idAtual) {
            const indice = cadastros.findIndex(item => String(item.id) === idAtual);
            if (indice >= 0) cadastros[indice] = {...cadastros[indice], ...dados};
            resposta.textContent = "Cadastro atualizado com sucesso!";
        } else {
            cadastros.unshift({id: Date.now(), ...dados, status: "ativo", criadoEm: new Date().toISOString()});
            resposta.textContent = `Cadastro realizado com sucesso, ${dados.nome}!`;
        }
        salvarCadastros(cadastros);
        resposta.style.color = "green";
        cadastroForm.reset();
        document.getElementById("cadastroId").value = "";
        document.getElementById("tituloFormulario").textContent = "Seus dados";
        document.getElementById("botaoCadastro").textContent = "FINALIZAR CADASTRO";
        document.getElementById("cancelarEdicao").classList.add("hidden");
        renderizar();
    });

    document.getElementById("cancelarEdicao").addEventListener("click", () => {
        cadastroForm.reset();
        document.getElementById("cadastroId").value = "";
        document.getElementById("tituloFormulario").textContent = "Seus dados";
        document.getElementById("botaoCadastro").textContent = "FINALIZAR CADASTRO";
        document.getElementById("cancelarEdicao").classList.add("hidden");
        resposta.textContent = "";
    });

    lista.addEventListener("click", event => {
        const botao = event.target.closest("button[data-action]");
        if (!botao) return;
        const id = Number(botao.dataset.id);
        const cadastros = lerCadastros();
        const item = cadastros.find(cadastro => cadastro.id === id);
        if (!item) return;
        if (botao.dataset.action === "excluir") {
            if (!window.confirm(`Excluir o cadastro de ${item.nome}?`)) return;
            salvarCadastros(cadastros.filter(cadastro => cadastro.id !== id));
            resposta.textContent = "Cadastro excluído.";
            resposta.style.color = "#e50914";
        } else if (botao.dataset.action === "status") {
            item.status = item.status === "ativo" ? "inativo" : "ativo";
            salvarCadastros(cadastros);
        } else {
            document.getElementById("cadastroId").value = item.id;
            ids.forEach(chave => document.getElementById(chave).value = item[chave.replace("cad", "").toLowerCase()] || "");
            document.getElementById("tituloFormulario").textContent = "Editar cadastro";
            document.getElementById("botaoCadastro").textContent = "SALVAR ALTERAÇÕES";
            document.getElementById("cancelarEdicao").classList.remove("hidden");
            window.scrollTo({top: 0, behavior: "smooth"});
        }
        renderizar();
    });

    [busca, filtroModalidade, filtroStatus].forEach(campo => campo.addEventListener("input", renderizar));
    document.getElementById("exportarCadastros").addEventListener("click", () => {
        const cadastros = lerCadastros();
        if (!cadastros.length) { resposta.textContent = "Não há cadastros para exportar."; resposta.style.color = "#e50914"; return; }
        const colunas = ["nome", "nascimento", "email", "telefone", "modalidade", "plano", "nivel", "observacao", "status"];
        const csv = [colunas.join(";"), ...cadastros.map(item => colunas.map(coluna => `"${String(item[coluna] || "").replace(/"/g, '""')}"`).join(";"))].join("\n");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], {type: "text/csv;charset=utf-8;"}));
        link.download = "cadastros-next-fight.csv";
        link.click();
        URL.revokeObjectURL(link.href);
    });
    renderizar();
}

/* =========================================================
   NEXT FIGHT IA - Assistente de modalidades
   ========================================================= */

(function () {
    const messagesEl = document.getElementById("iaMessages");
    const quickEl = document.getElementById("iaQuick");
    const inputEl = document.getElementById("iaInput");
    const sendBtn = document.getElementById("iaSend");

    if (!messagesEl || !inputEl) return; // só roda na página ia.html

    const recommendations = {
        "defesa pessoal": {
            title: "Defesa Pessoal",
            text: "Para defesa pessoal recomendamos <strong>Jiu-Jitsu</strong> ou <strong>Muay Thai</strong>. O Jiu-Jitsu ensina controle e finalizações no chão, enquanto o Muay Thai desenvolve golpes poderosos e distância. Ambos são excelentes para situações reais."
        },
        "condicionamento físico": {
            title: "Condicionamento Físico",
            text: "Para condicionamento físico intenso, o <strong>Muay Thai</strong> e o <strong>Boxe</strong> são ideais. Queimam muitas calorias, melhoram resistência cardiovascular e fortalecem o corpo de forma completa."
        },
        "competição": {
            title: "Competição",
            text: "Se o foco é competição, o <strong>Jiu-Jitsu</strong> e o <strong>Judô</strong> têm calendário de campeonatos bem estruturado. O Boxe e o Muay Thai também oferecem oportunidades de luta amadora e profissional."
        },
        "sou iniciante": {
            title: "Iniciante",
            text: "Como iniciante, qualquer modalidade da NEXT FIGHT é boa! Sugerimos começar pelo <strong>Boxe</strong> ou <strong>Judô</strong> — possuem progressão clara e são ótimos para aprender fundamentos de postura, respeito e disciplina."
        }
    };

    function addBotMessage(html, showQuick = false) {
        const div = document.createElement("div");
        div.className = "ia-msg bot";
        div.innerHTML = `<div class="ia-bot-bubble">${html}</div>`;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        if (showQuick) {
            quickEl.innerHTML = `
                <button class="ia-quick-btn" data-value="Defesa pessoal">Defesa pessoal</button>
                <button class="ia-quick-btn" data-value="Condicionamento físico">Condicionamento físico</button>
                <button class="ia-quick-btn" data-value="Competição">Competição</button>
                <button class="ia-quick-btn" data-value="Sou iniciante">Sou iniciante</button>
            `;
        } else {
            quickEl.innerHTML = "";
        }
    }

    function addUserMessage(text) {
        const div = document.createElement("div");
        div.className = "ia-msg user";
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function processAnswer(raw) {
        const text = raw.trim().toLowerCase();
        if (!text) return;

        addUserMessage(raw.trim());
        inputEl.value = "";

        // Procura a chave mais próxima
        let found = null;
        for (const key of Object.keys(recommendations)) {
            if (text.includes(key) || key.includes(text)) {
                found = recommendations[key];
                break;
            }
        }

        // Também aceita palavras soltas
        if (!found) {
            if (text.includes("defesa") || text.includes("proteção") || text.includes("rua")) {
                found = recommendations["defesa pessoal"];
            } else if (text.includes("condicionamento") || text.includes("físico") || text.includes("emagrecer") || text.includes("forma")) {
                found = recommendations["condicionamento físico"];
            } else if (text.includes("compet") || text.includes("luta") || text.includes("campeonato")) {
                found = recommendations["competição"];
            } else if (text.includes("inici") || text.includes("começar") || text.includes("primeiro")) {
                found = recommendations["sou iniciante"];
            }
        }

        setTimeout(() => {
            if (found) {
                addBotMessage(`
                    <strong>${found.title}</strong><br><br>
                    ${found.text}<br><br>
                    Quer saber mais sobre alguma modalidade ou tem outro objetivo?
                `);
                // botões de follow-up
                quickEl.innerHTML = `
                    <button class="ia-quick-btn" data-value="Defesa pessoal">Defesa pessoal</button>
                    <button class="ia-quick-btn" data-value="Condicionamento físico">Condicionamento físico</button>
                    <button class="ia-quick-btn" data-value="Competição">Competição</button>
                    <button class="ia-quick-btn" data-value="Sou iniciante">Sou iniciante</button>
                    <button class="ia-quick-btn" data-value="Reiniciar">Reiniciar conversa</button>
                `;
            } else if (text.includes("reiniciar") || text.includes("começar de novo")) {
                messagesEl.innerHTML = "";
                startConversation();
            } else {
                addBotMessage(`
                    Ainda não entendi bem o seu objetivo.<br><br>
                    Você pode escolher uma das opções abaixo ou digitar algo como: <strong>defesa pessoal</strong>, <strong>condicionamento</strong>, <strong>competição</strong> ou <strong>sou iniciante</strong>.
                `, true);
            }
        }, 450);
    }

    function startConversation() {
        addBotMessage(`
            Olá! Vou ajudar você a escolher uma modalidade.<br>
            <strong>Qual é o seu principal objetivo?</strong>
        `, true);
    }

    // Eventos
    sendBtn.addEventListener("click", () => processAnswer(inputEl.value));
    inputEl.addEventListener("keydown", e => {
        if (e.key === "Enter") processAnswer(inputEl.value);
    });

    quickEl.addEventListener("click", e => {
        const btn = e.target.closest(".ia-quick-btn");
        if (!btn) return;
        const value = btn.dataset.value;
        if (value === "Reiniciar") {
            messagesEl.innerHTML = "";
            startConversation();
        } else {
            processAnswer(value);
        }
    });

    // Inicia
    startConversation();
})();

/* =========================================================
   CHECKOUT DEMONSTRATIVO DE MATRÍCULA
   ========================================================= */
(function () {
    const form = document.getElementById("pagamentoForm");
    if (!form) return;

    const planInputs = [...document.querySelectorAll('input[name="planoPagamento"]')];
    const methodTabs = [...document.querySelectorAll(".method-tab")];
    const methodInput = document.getElementById("metodoPagamento");
    const cardFields = document.getElementById("cardFields");
    const pixFields = document.getElementById("pixFields");
    const successState = document.getElementById("successState");
    const summaryPlan = document.getElementById("summaryPlan");
    const summaryDescription = document.getElementById("summaryDescription");
    const summaryPrice = document.getElementById("summaryPrice");
    const summaryTotal = document.getElementById("summaryTotal");
    const summaryMethod = document.getElementById("summaryMethod");
    const successPlan = document.getElementById("successPlan");
    const novaMatricula = document.getElementById("novaMatricula");
    const formatCurrency = value => Number(value).toLocaleString("pt-BR", {style: "currency", currency: "BRL"});

    function selectedPlan() {
        return planInputs.find(input => input.checked) || planInputs[1];
    }

    function updateSummary() {
        const plan = selectedPlan();
        const price = formatCurrency(plan.dataset.price);
        summaryPlan.textContent = plan.dataset.name;
        summaryDescription.textContent = plan.dataset.description;
        summaryPrice.textContent = price;
        summaryTotal.textContent = price;
        summaryMethod.textContent = methodInput.value === "pix" ? "Pix" : "Cartão";
    }

    function setMethod(method) {
        methodInput.value = method;
        methodTabs.forEach(tab => {
            const active = tab.dataset.method === method;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-selected", String(active));
        });
        cardFields.classList.toggle("hidden", method !== "card");
        pixFields.classList.toggle("hidden", method !== "pix");
        pixFields.setAttribute("aria-hidden", String(method !== "pix"));
        updateSummary();
    }

    function onlyDigits(value) {
        return value.replace(/\D/g, "");
    }

    function maskCpf(value) {
        return onlyDigits(value).slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function maskPhone(value) {
        const digits = onlyDigits(value).slice(0, 11);
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    function maskCard(value) {
        return onlyDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    function maskExpiry(value) {
        return onlyDigits(value).slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
    }

    [
        ["alunoCpf", maskCpf],
        ["alunoTelefone", maskPhone],
        ["numeroCartao", maskCard],
        ["validadeCartao", maskExpiry]
    ].forEach(([id, mask]) => {
        const field = document.getElementById(id);
        field.addEventListener("input", () => { field.value = mask(field.value); });
    });

    function clearErrors() {
        form.querySelectorAll(".field-error").forEach(error => { error.textContent = ""; });
        form.querySelectorAll(".invalid").forEach(field => field.classList.remove("invalid"));
    }

    function setError(id, message) {
        const field = document.getElementById(id);
        const error = form.querySelector(`[data-error-for="${id}"]`);
        if (field) field.classList.add("invalid");
        if (error) error.textContent = message;
        return Boolean(field);
    }

    function validate() {
        clearErrors();
        const invalidIds = [];
        const value = id => document.getElementById(id).value.trim();
        const name = value("alunoNome");
        const email = value("alunoEmail");
        const cpf = onlyDigits(value("alunoCpf"));
        const phone = onlyDigits(value("alunoTelefone"));

        if (!selectedPlan()) invalidIds.push("planoPagamento");
        if (name.length < 3) { setError("alunoNome", "Informe seu nome completo."); invalidIds.push("alunoNome"); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("alunoEmail", "Digite um e-mail válido."); invalidIds.push("alunoEmail"); }
        if (cpf.length !== 11) { setError("alunoCpf", "Informe um CPF com 11 números."); invalidIds.push("alunoCpf"); }
        if (phone.length < 10) { setError("alunoTelefone", "Informe um celular válido."); invalidIds.push("alunoTelefone"); }

        if (methodInput.value === "card") {
            const card = onlyDigits(value("numeroCartao"));
            const holder = value("nomeCartao");
            const expiry = value("validadeCartao");
            const cvv = onlyDigits(value("cvvCartao"));
            if (card.length !== 16) { setError("numeroCartao", "Informe 16 números do cartão."); invalidIds.push("numeroCartao"); }
            if (holder.length < 3) { setError("nomeCartao", "Informe o nome impresso no cartão."); invalidIds.push("nomeCartao"); }
            const expiryMatch = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
            if (!expiryMatch) { setError("validadeCartao", "Use o formato MM/AA."); invalidIds.push("validadeCartao"); }
            if (cvv.length < 3 || cvv.length > 4) { setError("cvvCartao", "Informe um CVV válido."); invalidIds.push("cvvCartao"); }
        }

        if (!document.getElementById("termos").checked) {
            setError("termos", "É necessário concordar para continuar.");
            document.getElementById("termos").classList.add("invalid");
            invalidIds.push("termos");
        }
        return invalidIds;
    }

    const queryPlan = new URLSearchParams(window.location.search).get("plano");
    if (queryPlan) {
        const planFromUrl = planInputs.find(input => input.value === queryPlan.toLowerCase());
        if (planFromUrl) planFromUrl.checked = true;
    }
    planInputs.forEach(input => input.addEventListener("change", updateSummary));
    methodTabs.forEach(tab => tab.addEventListener("click", () => setMethod(tab.dataset.method)));
    updateSummary();

    form.addEventListener("submit", event => {
        event.preventDefault();
        const invalidIds = validate();
        if (invalidIds.length) {
            const firstInvalid = document.getElementById(invalidIds[0]);
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({behavior: "smooth", block: "center"});
            }
            return;
        }
        successPlan.textContent = selectedPlan().dataset.name;
        form.classList.add("hidden");
        successState.classList.remove("hidden");
        document.querySelectorAll(".checkout-step")[2].classList.add("active");
        window.scrollTo({top: 0, behavior: "smooth"});
    });

    novaMatricula.addEventListener("click", () => {
        form.reset();
        clearErrors();
        setMethod("card");
        form.classList.remove("hidden");
        successState.classList.add("hidden");
        document.querySelectorAll(".checkout-step")[2].classList.remove("active");
        updateSummary();
        window.scrollTo({top: 0, behavior: "smooth"});
    });
})();
