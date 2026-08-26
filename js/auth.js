// Funções partilhadas de autenticação (login, cadastro, logout, guarda de rotas)

function mensagemErroFirebase(erro) {
    const mapa = {
        "auth/invalid-email": "Email inválido.",
        "auth/user-disabled": "Esta conta foi desativada.",
        "auth/user-not-found": "Não existe conta com este email.",
        "auth/wrong-password": "Palavra-passe incorreta.",
        "auth/invalid-credential": "Email ou palavra-passe incorretos.",
        "auth/email-already-in-use": "Já existe uma conta com este email.",
        "auth/weak-password": "A palavra-passe deve ter pelo menos 6 caracteres.",
        "auth/network-request-failed": "Falha de ligação. Verifique a internet."
    };
    return mapa[erro.code] || "Ocorreu um erro. Tente novamente.";
}

function mostrarErro(elId, texto) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = texto;
    el.classList.remove("d-none");
}

function esconderErro(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.classList.add("d-none");
    el.textContent = "";
}

// Usada nas páginas login.html e cadastro.html: se já estiver logado, manda para index.html
function redirecionarSeLogado() {
    auth.onAuthStateChanged((user) => {
        if (user) window.location.href = "index.html";
    });
}

// Usada em todas as páginas internas (index, draft, resultado): exige login.
// callback(user) só corre depois de confirmarmos que há sessão ativa.
function exigirLogin(callback) {
    const loader = document.getElementById("auth-loading");
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }
        if (loader) loader.classList.add("d-none");
        document.querySelectorAll(".auth-content").forEach((el) => el.classList.remove("d-none"));
        callback(user);
    });
}

function ligarLogout(botaoId) {
    const btn = document.getElementById(botaoId);
    if (!btn) return;
    btn.addEventListener("click", () => {
        auth.signOut().then(() => {
            window.location.href = "login.html";
        });
    });
}
