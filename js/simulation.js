// Motor de simulação das temporadas (tudo aleatório, ponderado pelos atributos/OVR)

function numAleatorio(min, max) {
    return min + Math.random() * (max - min);
}

function statAPartirDeAtributo(attr, min, max) {
    const base = min + ((attr - 40) / (99 - 40)) * (max - min);
    return Math.max(0, base * numAleatorio(0.75, 1.25));
}

function poisson(lambda) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}

// ---------- BASQUETE ----------
function simularTemporadaBasquete(jogador, timeUsuario) {
    const forcaTime = timeUsuario.ovr + (jogador.ovr - 70) * 0.15;
    const adversarios = NBA_TEAMS.filter((t) => t.id !== timeUsuario.id);

    let vitorias = 0;
    let derrotas = 0;
    const jogos = [];
    const totais = { pts: 0, reb: 0, ast: 0, rb: 0, tp: 0 };
    const totaisAcumulados = { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 };

    for (let i = 0; i < 82; i++) {
        const adv = adversarios[i % adversarios.length];
        const probVitoria = 1 / (1 + Math.pow(10, (adv.ovr - forcaTime) / 12));
        const venceu = Math.random() < probVitoria;
        if (venceu) vitorias++; else derrotas++;

        const pts = statAPartirDeAtributo((jogador.attrs.arremesso + jogador.attrs.finalizacao) / 2, 6, 32);
        const reb = statAPartirDeAtributo((jogador.attrs.fisico + jogador.attrs.defesa) / 2, 2, 12);
        const ast = statAPartirDeAtributo(jogador.attrs.passe, 1, 10);
        const stl = statAPartirDeAtributo(jogador.attrs.defesa, 0.3, 2.5);
        const blk = statAPartirDeAtributo((jogador.attrs.defesa + jogador.attrs.fisico) / 2, 0.1, 2);

        totaisAcumulados.pts += pts;
        totaisAcumulados.reb += reb;
        totaisAcumulados.ast += ast;
        totaisAcumulados.stl += stl;
        totaisAcumulados.blk += blk;

        jogos.push({
            adversario: adv.nome,
            resultado: venceu ? "V" : "D",
            pts: Math.round(pts),
            reb: Math.round(reb),
            ast: Math.round(ast),
            stl: Math.round(stl * 10) / 10,
            blk: Math.round(blk * 10) / 10
        });
    }

    const medias = {
        pts: (totaisAcumulados.pts / 82).toFixed(1),
        reb: (totaisAcumulados.reb / 82).toFixed(1),
        ast: (totaisAcumulados.ast / 82).toFixed(1),
        stl: (totaisAcumulados.stl / 82).toFixed(1),
        blk: (totaisAcumulados.blk / 82).toFixed(1)
    };

    let premio = null;
    if (Number(medias.pts) >= 28) premio = "Artilheiro da Liga";
    else if (Number(medias.ast) >= 9) premio = "Melhor Armador da Liga";
    else if (Number(medias.reb) >= 11) premio = "Rei do Rebote";

    return {
        vitorias,
        derrotas,
        medias,
        jogos,
        classificado: vitorias >= 42,
        premio,
        simuladoEm: new Date().toISOString()
    };
}

// ---------- FUTEBOL ----------
function golsEsperados(atacante, defensor, mandante) {
    let esperado = 1.3 + (atacante.ovr - defensor.ovr) / 18 + (mandante ? 0.25 : -0.1);
    return Math.min(4.2, Math.max(0.25, esperado));
}

const FRACAO_GOLO = { gol: 0.01, zag: 0.05, mei: 0.16, ata: 0.36 };
const FRACAO_ASSIST = { gol: 0.01, zag: 0.08, mei: 0.30, ata: 0.16 };

function simularTemporadaFutebol(jogador, timeUsuario) {
    const equipas = PL_TEAMS;
    const tabela = {};
    equipas.forEach((t) => {
        tabela[t.id] = { id: t.id, nome: t.nome, pontos: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 };
    });

    const jogosDoUsuario = [];
    let golsJogador = 0;
    let assistJogador = 0;
    let somaNotas = 0;

    for (let i = 0; i < equipas.length; i++) {
        for (let j = 0; j < equipas.length; j++) {
            if (i === j) continue;
            const mandante = equipas[i];
            const visitante = equipas[j];

            const forcaMandante = mandante.id === timeUsuario.id ? { ovr: mandante.ovr + (jogador.ovr - 70) * 0.12 } : mandante;
            const forcaVisitante = visitante.id === timeUsuario.id ? { ovr: visitante.ovr + (jogador.ovr - 70) * 0.12 } : visitante;

            const xgMandante = golsEsperados(forcaMandante, forcaVisitante, true);
            const xgVisitante = golsEsperados(forcaVisitante, forcaMandante, false);
            const golsMandante = poisson(xgMandante);
            const golsVisitante = poisson(xgVisitante);

            tabela[mandante.id].gp += golsMandante;
            tabela[mandante.id].gc += golsVisitante;
            tabela[visitante.id].gp += golsVisitante;
            tabela[visitante.id].gc += golsMandante;

            if (golsMandante > golsVisitante) {
                tabela[mandante.id].v++; tabela[mandante.id].pontos += 3;
                tabela[visitante.id].d++;
            } else if (golsMandante < golsVisitante) {
                tabela[visitante.id].v++; tabela[visitante.id].pontos += 3;
                tabela[mandante.id].d++;
            } else {
                tabela[mandante.id].e++; tabela[mandante.id].pontos += 1;
                tabela[visitante.id].e++; tabela[visitante.id].pontos += 1;
            }

            const envolveUsuario = mandante.id === timeUsuario.id || visitante.id === timeUsuario.id;
            if (envolveUsuario) {
                const golsTime = mandante.id === timeUsuario.id ? golsMandante : golsVisitante;
                const venceu = (mandante.id === timeUsuario.id && golsMandante > golsVisitante) ||
                    (visitante.id === timeUsuario.id && golsVisitante > golsMandante);
                const empatou = golsMandante === golsVisitante;

                let golsPartida = 0;
                let assistPartida = 0;
                for (let g = 0; g < golsTime; g++) {
                    if (Math.random() < FRACAO_GOLO[jogador.posicao] * (jogador.attrs.finalizacao / 70)) golsPartida++;
                    else if (Math.random() < FRACAO_ASSIST[jogador.posicao] * (jogador.attrs.passe / 70)) assistPartida++;
                }
                golsJogador += golsPartida;
                assistJogador += assistPartida;

                let nota = 6.0 + (jogador.ovr - 70) / 30 + numAleatorio(-0.4, 0.4) + golsPartida * 0.5 + assistPartida * 0.3;
                nota += venceu ? 0.3 : (empatou ? 0 : -0.3);
                nota = Math.min(10, Math.max(4, nota));
                somaNotas += nota;

                jogosDoUsuario.push({
                    adversario: mandante.id === timeUsuario.id ? visitante.nome : mandante.nome,
                    mandante: mandante.id === timeUsuario.id,
                    placar: `${golsMandante} - ${golsVisitante}`,
                    gols: golsPartida,
                    assistencias: assistPartida,
                    nota: nota.toFixed(1)
                });
            }
        }
    }

    const tabelaOrdenada = Object.values(tabela).sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        const gdA = a.gp - a.gc, gdB = b.gp - b.gc;
        if (gdB !== gdA) return gdB - gdA;
        return b.gp - a.gp;
    });
    const posicaoFinal = tabelaOrdenada.findIndex((t) => t.id === timeUsuario.id) + 1;

    return {
        tabela: tabelaOrdenada,
        posicaoFinal,
        jogos: jogosDoUsuario,
        jogadorStats: {
            jogos: jogosDoUsuario.length,
            gols: golsJogador,
            assistencias: assistJogador,
            mediaNota: (somaNotas / jogosDoUsuario.length).toFixed(1)
        },
        simuladoEm: new Date().toISOString()
    };
}
