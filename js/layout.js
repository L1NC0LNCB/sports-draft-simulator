// Layout partilhado (navbar + rodapé) usado por todas as páginas.
// Construído em JS (em vez de fetch/includes) para funcionar mesmo abrindo
// os ficheiros .html diretamente, sem servidor.

const RL_ANO = new Date().getFullYear();

function montarAcaoNavbar(acao) {
    const classe = `btn btn-sm fw-semibold ${acao.solid ? "btn-orange" : "btn-outline-orange"} ${acao.ocultarMobile ? "d-none d-sm-inline-flex" : "d-inline-flex"} align-items-center`;
    const icone = acao.icon ? `<i class="bi ${acao.icon} me-1"></i>` : "";
    const idAttr = acao.id ? `id="${acao.id}"` : "";

    if (acao.tag === "button") {
        return `<button type="button" ${idAttr} class="${classe}">${icone}${acao.label}</button>`;
    }
    return `<a href="${acao.href}" ${idAttr} class="${classe}">${icone}${acao.label}</a>`;
}

// cfg: { emailId (mostra span com id para o email do utilizador), acoes: [...] }
function montarNavbarApp(cfg) {
    cfg = cfg || {};
    const acoes = (cfg.acoes || []).map(montarAcaoNavbar).join("");
    const emailSpan = cfg.mostrarEmail
        ? `<span id="email-usuario" class="text-secondary small d-none d-sm-inline text-truncate" style="max-width: 200px;"></span>`
        : "";

    return `
    <nav class="app-navbar navbar navbar-expand-lg navbar-dark bg-dark-glass border-bottom border-secondary border-opacity-25 py-3">
        <div class="container">
            <a class="brand-logo" href="index.html">
                <i class="bi bi-lock-fill text-orange me-2"></i>SPORTS<span class="text-orange">BAR</span>
            </a>
            <div class="d-flex align-items-center gap-2 gap-md-3">
                ${emailSpan}
                ${acoes}
            </div>
        </div>
    </nav>`;
}

function montarFooterApp() {
    return `
    <footer class="app-footer text-center py-4 mt-auto">
        <div class="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <small class="text-secondary">&copy; ${RL_ANO} <span class="text-white fw-semibold">SPORTS<span class="text-orange">BAR</span></span> — Simulador Esportivo</small>
            <small class="d-flex gap-3">
                <a href="index.html">Início</a>
                <a href="basquete-resultado.html">Basquete</a>
                <a href="futebol-resultado.html">Futebol</a>
            </small>
        </div>
    </footer>`;
}

// Injeta a navbar da aplicação no elemento #app-navbar e liga o logout (se existir botão "btn-logout")
function montarLayoutApp(cfg) {
    const navEl = document.getElementById("app-navbar");
    if (navEl) navEl.outerHTML = montarNavbarApp(cfg);

    const footerEl = document.getElementById("app-footer");
    if (footerEl) footerEl.outerHTML = montarFooterApp();

    if (typeof ligarLogout === "function") ligarLogout("btn-logout");
}
