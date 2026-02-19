# Portal da Incubadora de Empresas (Protótipo Parte 2)

Protótipo frontend em **HTML/CSS/JS puro** com polimento de produto, mantendo compatibilidade com GitHub Pages.

## Como correr localmente

- Opção simples: abrir `index.html` no navegador.
- Opção recomendada:

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080/`.

## Estrutura do projecto

- `index.html`
- `public/`
  - `procedimentos.html`, `legislacao.html`, `faq.html`, `noticias.html`, `contactos.html`, `pesquisa.html`
- `app/`
  - `login.html`, `inscricao.html`, `dashboard.html`, `submissao.html`, `acompanhamento.html`, `ficheiros.html`, `tutoriais.html`, `pesquisa.html`, `validacao.html`
- `assets/css/styles.css`
- `assets/js/app.js`
- `assets/js/auth-mock.js`
- `assets/js/search-index.js`

## Modo demoAdmin

Para activar o menu/página de validação mock, aceda com query string:

- `app/dashboard.html?admin=1` (também funciona em qualquer página de `app/`)

Isso grava `demoAdmin=true` em `localStorage` e mostra o link **Validação (demo)** no dashboard.

## O que é mock nesta fase

- Autenticação e registo em `localStorage`.
- Estado de conta (`PENDENTE`, `APROVADO`, `RECUSADO`) simulado.
- Aprovação/recusa em `app/validacao.html` apenas para demonstração.
- Pesquisa baseada em índice estático JS.

## O que será ligado ao backend na Parte 3

- API de autenticação real (login/refresh/logout).
- API de registo e workflow de validação com perfis e permissões.
- API de pesquisa com indexação dinâmica.
- Integração de ficheiros e notificações reais.


## Estados da conta

- **PENDENTE**: inscrição submetida e aguarda validação da Incubadora.
- **APROVADO**: login permitido e acesso ao dashboard.
- **RECUSADO**: login bloqueado com instruções para contacto.
