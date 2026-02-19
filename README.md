# Portal da Incubadora de Empresas (Protótipo)

Protótipo frontend (HTML/CSS/JS puro) para a **Incubadora de Negócios e Inovação – FACEE/UniRovuma**, com área pública e área reservada (autenticação simulada).

## Estrutura

- `index.html`
- `public/`
  - `procedimentos.html`
  - `legislacao.html`
  - `faq.html`
  - `noticias.html`
  - `contactos.html`
- `app/`
  - `login.html`
  - `dashboard.html`
  - `ficheiros.html`
  - `tutoriais.html`
  - `submissao.html`
  - `acompanhamento.html`
- `assets/`
  - `css/styles.css`
  - `js/app.js`
  - `js/auth-mock.js`
  - `img/`

## Execução local

Como é um site estático, pode abrir o `index.html` directamente no navegador. Para melhor compatibilidade, recomenda-se usar um servidor local:

```bash
python3 -m http.server 8080
```

Depois abra:

- `http://localhost:8080/`

## Lógica de autenticação (mock)

- Estado de sessão gravado em `localStorage`.
- Perfis suportados:
  - **Estudante**: Número de Estudante (6-12 dígitos) + PIN (4-6 dígitos)
  - **Empresa assistida**: NUIT (9 dígitos) + PIN (4-6 dígitos)
- Páginas da pasta `app/` redireccionam para `app/login.html` caso não haja sessão válida.
- Após login bem-sucedido, redirecciona para `app/dashboard.html`.

## Deploy no GitHub Pages

1. Faça push para o GitHub.
2. Em **Settings > Pages**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (ou a branch desejada) e pasta `/ (root)`
3. Guarde e aguarde a publicação.
4. Aceda ao URL fornecido pelo GitHub Pages.

> O projecto utiliza apenas caminhos relativos, compatíveis com GitHub Pages.
