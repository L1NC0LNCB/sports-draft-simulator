# SportsBar — Sports Draft Simulator

Simulador esportivo (Basquete + Futebol) feito em HTML, CSS e JavaScript puro, usando
**Bootstrap 5** para o layout/responsividade e **Firebase** (Authentication + Firestore) como backend.

## Como funciona

1. `pages/login.html` / `pages/cadastro.html` — autenticação por email e palavra-passe (Firebase Auth).
2. `pages/index.html` — página inicial protegida: exige login e deixa escolher entre Basquete ou Futebol.
3. `pages/basquete-draft.html` — cria o jogador (nome, posição, time da NBA, atributos por pontos).
4. `pages/basquete-resultado.html` — simula uma temporada de 82 jogos e mostra médias, recorde e log de jogos.
5. `pages/futebol-draft.html` — cria o jogador (nome, posição, time da Premier League, atributos por pontos).
6. `pages/futebol-resultado.html` — simula os 38 jogos da temporada, tabela completa da liga e estatísticas do jogador.

Cada conta (login) tem o seu próprio jogador de basquete e/ou de futebol, guardado no Firestore
em `users/{uid}` (campos `basketball` e `football`). Não é necessário nenhum build/npm — é só
abrir `index.html` (na raiz do projeto) diretamente no browser: ele só redireciona para
`pages/index.html`, que trata do login.

## Configuração necessária no Firebase (uma vez só)

No [console do Firebase](https://console.firebase.google.com/) do projeto `sportsbar-b313e`:

1. **Authentication → Sign-in method** → ativar o provedor **Email/Password**.
2. **Firestore Database** → criar a base de dados (modo produção) e definir estas regras:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Isto garante que cada utilizador só consegue ler/escrever os seus próprios dados.

## Hosting (Firebase)

O site está publicado no Firebase Hosting: **https://sportsbar-b313e.web.app**

Para publicar uma atualização (depois de teres o [Firebase CLI](https://firebase.google.com/docs/cli)
instalado e ter feito `firebase login` uma vez):

```
firebase deploy --only hosting
```

O `firebase.json` e o `.firebaserc` já estão configurados (pasta pública = raiz do projeto, projeto
= `sportsbar-b313e`) — não é preciso correr `firebase init` de novo. Como o domínio `.web.app` é do
próprio projeto Firebase, o login/cadastro já funciona nele sem nenhuma configuração extra de
"domínios autorizados" (isso só seria necessário num domínio externo, como Netlify ou um domínio
próprio).

## Estrutura

```
sports-draft-simulator/
├── index.html              # redireciona para pages/index.html (entrada do projeto)
├── pages/                  # todas as páginas da aplicação
│   ├── login.html
│   ├── cadastro.html
│   ├── index.html          # dashboard protegido (escolher Basquete/Futebol)
│   ├── basquete-draft.html
│   ├── basquete-resultado.html
│   ├── futebol-draft.html
│   └── futebol-resultado.html
├── css/
│   └── style.css           # sistema de design (dark + laranja) em cima do Bootstrap 5
└── js/
    ├── database.js         # inicialização do Firebase
    ├── auth.js              # login, cadastro, logout e guarda de rotas
    ├── layout.js             # navbar e rodapé partilhados por todas as páginas
    ├── nba-teams.js / pl-teams.js  # dados das equipas e força (OVR)
    ├── draft.js              # distribuição de pontos nos atributos e gravação do jogador
    └── simulation.js         # motor de simulação das temporadas
```

As páginas ficam todas juntas em `pages/`, e cada uma refere `css/` e `js/` como `../css/...` e
`../js/...` (uma pasta acima). Os links entre páginas (ex: `href="login.html"`) continuam simples
porque todas são vizinhas dentro de `pages/`.

### Sobre a navbar/rodapé partilhados

Cada página tem apenas `<div id="app-navbar"></div>` e `<div id="app-footer"></div>` no HTML.
No script da página chama-se `montarLayoutApp({ mostrarEmail, acoes: [...] })`, que gera o HTML da
navbar (com os botões certos para aquela página) e do rodapé. Isto evita repetir o mesmo bloco de
navbar em 7 ficheiros — para mudar o layout basta editar `js/layout.js`.

## Responsividade

Todas as páginas usam o grid do Bootstrap e foram testadas em larguras mobile (< 576px).
