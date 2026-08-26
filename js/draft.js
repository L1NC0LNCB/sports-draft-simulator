// Lógica partilhada pelas páginas de draft (basquete-draft.html e futebol-draft.html):
// sistema de "pontos para distribuir" nos atributos + gravação do jogador no Firestore.

const ORCAMENTO_ATRIBUTOS = 325; // soma máxima permitida entre os 5 atributos
const ATRIBUTO_MIN = 40;
const ATRIBUTO_MAX = 99;

// attrIds: array com os ids dos 5 <input type="range">
// Chama onChange(somaAtual, ovrAtual, dentroDoOrcamento) sempre que um slider muda.
function ligarPontosDistribuidos(attrIds, totalElId, ovrElId, onChange) {
    function atualizar() {
        let soma = 0;
        attrIds.forEach((id) => {
            const input = document.getElementById(id);
            soma += Number(input.value);
            const saida = document.getElementById(id + "-valor");
            if (saida) saida.textContent = input.value;
        });

        const ovr = Math.round(soma / attrIds.length);
        const dentroDoOrcamento = soma <= ORCAMENTO_ATRIBUTOS;

        const totalEl = document.getElementById(totalElId);
        if (totalEl) {
            totalEl.textContent = `${soma} / ${ORCAMENTO_ATRIBUTOS}`;
            totalEl.classList.toggle("text-danger", !dentroDoOrcamento);
            totalEl.classList.toggle("text-orange", dentroDoOrcamento);
        }
        const ovrEl = document.getElementById(ovrElId);
        if (ovrEl) ovrEl.textContent = ovr;

        if (onChange) onChange(soma, ovr, dentroDoOrcamento);
    }

    attrIds.forEach((id) => {
        document.getElementById(id).addEventListener("input", atualizar);
    });
    atualizar();
}

// Grava (ou substitui) os dados do jogador de um desporto ("basketball" ou "football")
// no documento users/{uid}, e limpa qualquer temporada simulada anterior.
function salvarJogador(uid, chaveDesporto, dadosJogador) {
    const payload = {};
    payload[chaveDesporto] = Object.assign({}, dadosJogador, {
        criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
        temporada: null
    });
    return db.collection("users").doc(uid).set(payload, { merge: true });
}
