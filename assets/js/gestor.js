const candidaturas = [
  {
    id: 1,
    nome: "Ana Silva",
    email: "ana.silva@estudante.univ.edu",
    contacto: "+258 84 111 2233",
    curso: "Gestão",
    faculdade: "FACEE",
    negocio: "EcoPack Campus",
    estado: "pendente",
    data: "2026-03-20",
    experiencia: "Coordenou projecto de empreendedorismo académico durante 1 ano.",
    ideia: "Produção de embalagens sustentáveis para cantinas universitárias.",
    problema: "Alto consumo de descartáveis convencionais no campus.",
    descricao: "Modelo B2B com entregas para estabelecimentos locais e eventos institucionais.",
    concorrencia: "Pequenos fornecedores sem foco sustentável.",
    suporte: "Inquérito com 180 estudantes e 14 gestores de cantina.",
    motivacao: "Criar impacto ambiental positivo e negócio escalável."
  },
  {
    id: 2,
    nome: "Carlos Mussa",
    email: "c.mussa@aluno.univ.edu",
    contacto: "+258 86 442 1133",
    curso: "Economia",
    faculdade: "FACEE",
    negocio: "FinEdu Jovem",
    estado: "em análise",
    data: "2026-03-18",
    experiencia: "Monitor em literacia financeira e organização de workshops.",
    ideia: "Plataforma de educação financeira para estudantes universitários.",
    problema: "Baixo domínio de gestão financeira pessoal entre jovens.",
    descricao: "Conteúdos curtos, mentorias e simulador de orçamento.",
    concorrencia: "Aplicações generalistas sem foco local.",
    suporte: "Pesquisa com 250 respostas e taxa de interesse de 79%.",
    motivacao: "Contribuir para autonomia financeira dos estudantes."
  },
  {
    id: 3,
    nome: "Helena Joaquim",
    email: "helena.joaquim@estudante.univ.edu",
    contacto: "+258 87 334 2299",
    curso: "Contabilidade",
    faculdade: "FACEE",
    negocio: "ContaFácil PME",
    estado: "aprovada",
    data: "2026-03-15",
    experiencia: "Estágio em consultoria e contabilidade para microempresas.",
    ideia: "Serviço de organização financeira para PMEs com dashboard simples.",
    problema: "Empresas sem registo financeiro consistente.",
    descricao: "Pacotes mensais com apoio remoto e relatórios automáticos.",
    concorrencia: "Gabinetes tradicionais com custos mais altos.",
    suporte: "Validação com 11 PMEs e 3 associações locais.",
    motivacao: "Formalizar o ecossistema de micro negócios locais."
  },
  {
    id: 4,
    nome: "João Macamo",
    email: "joao.macamo@estudante.univ.edu",
    contacto: "+258 85 999 0112",
    curso: "Marketing",
    faculdade: "Faculdade de Letras",
    negocio: "Campus Brand Lab",
    estado: "rejeitada",
    data: "2026-03-10",
    experiencia: "Trabalhos freelancer de branding e gestão de redes sociais.",
    ideia: "Laboratório criativo para marcas estudantis.",
    problema: "Projectos sem posicionamento e comunicação profissional.",
    descricao: "Mentoria criativa + produção de kits de comunicação.",
    concorrencia: "Agências digitais generalistas.",
    suporte: "Portfólio com 8 clientes piloto.",
    motivacao: "Transformar talentos criativos em negócios sustentáveis."
  },
  {
    id: 5,
    nome: "Marta Luís",
    email: "marta.luis@estudante.univ.edu",
    contacto: "+258 82 903 4455",
    curso: "Gestão",
    faculdade: "Faculdade de Engenharia",
    negocio: "Smart Agro Hub",
    estado: "em análise",
    data: "2026-03-25",
    experiencia: "Participação em programa de inovação agrícola.",
    ideia: "Soluções de gestão para pequenas cadeias de distribuição agrícola.",
    problema: "Perdas operacionais e falta de planeamento logístico.",
    descricao: "Painel operacional com previsão de procura e stock.",
    concorrencia: "Ferramentas complexas e caras para pequenos produtores.",
    suporte: "Teste de conceito com duas cooperativas.",
    motivacao: "Aumentar eficiência e rendimento no sector agrícola."
  }
];

const navButtons = document.querySelectorAll(".nav-item");
const panelSections = document.querySelectorAll(".panel-section");
const sectionTitle = document.getElementById("sectionTitle");
const cardsGrid = document.getElementById("cardsGrid");
const tbody = document.getElementById("candidaturasTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const emptyState = document.getElementById("emptyState");
const modal = document.getElementById("detailsModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const detailsPanel = document.getElementById("detalhesPanel");

function normalizeStatus(status) {
  return status.toLowerCase().replace(" ", "-");
}

function countByStatus() {
  return candidaturas.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.estado] = (acc[item.estado] || 0) + 1;
      return acc;
    },
    { total: 0, pendente: 0, "em análise": 0, aprovada: 0, rejeitada: 0 }
  );
}

function renderCards() {
  const counts = countByStatus();
  const cards = [
    ["Total de candidaturas", counts.total],
    ["Total pendentes", counts.pendente],
    ["Total em análise", counts["em análise"]],
    ["Total aprovadas", counts.aprovada],
    ["Total rejeitadas", counts.rejeitada]
  ];

  cardsGrid.innerHTML = cards
    .map(
      ([label, value]) => `
      <article class="metric-card">
        <h3>${value}</h3>
        <p>${label}</p>
      </article>`
    )
    .join("");
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;

  const filtered = candidaturas.filter((item) => {
    const matchesTerm =
      item.nome.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.negocio.toLowerCase().includes(term);
    const matchesStatus = status === "todos" || item.estado === status;
    return matchesTerm && matchesStatus;
  });

  renderTable(filtered);
}

function statusBadge(estado) {
  return `<span class="badge status-${normalizeStatus(estado)}">${estado}</span>`;
}

function renderTable(rows) {
  tbody.innerHTML = rows
    .map(
      (item) => `
      <tr>
        <td>${item.nome}</td>
        <td>${item.email}</td>
        <td>${item.contacto}</td>
        <td>${item.curso}</td>
        <td>${item.negocio}</td>
        <td>${statusBadge(item.estado)}</td>
        <td>${new Date(item.data).toLocaleDateString("pt-PT")}</td>
        <td>
          <div class="action-group">
            <button class="btn btn-subtle" data-action="details" data-id="${item.id}" type="button">Ver detalhes</button>
            <button class="btn btn-subtle" data-action="set-status" data-id="${item.id}" data-value="aprovada" type="button">Aprovar</button>
            <button class="btn btn-subtle" data-action="set-status" data-id="${item.id}" data-value="rejeitada" type="button">Rejeitar</button>
            <button class="btn btn-subtle" data-action="set-status" data-id="${item.id}" data-value="em análise" type="button">Em análise</button>
          </div>
        </td>
      </tr>`
    )
    .join("");

  emptyState.classList.toggle("hidden", rows.length > 0);
}

function renderDetails(target) {
  detailsPanel.classList.remove("empty");
  detailsPanel.innerHTML = `
    <article class="detail-block">
      <h4>Dados pessoais</h4>
      <p><strong>Nome:</strong> ${target.nome}</p>
      <p><strong>Email:</strong> ${target.email}</p>
      <p><strong>Contacto:</strong> ${target.contacto}</p>
      <p><strong>Curso/Faculdade:</strong> ${target.curso} - ${target.faculdade}</p>
    </article>
    <article class="detail-block">
      <h4>Negócio e proposta</h4>
      <p><strong>Nome social / negócio:</strong> ${target.negocio}</p>
      <p><strong>Ideia central:</strong> ${target.ideia}</p>
      <p><strong>Problema:</strong> ${target.problema}</p>
      <p><strong>Descrição:</strong> ${target.descricao}</p>
      <p><strong>Concorrência:</strong> ${target.concorrencia}</p>
      <p><strong>Suporte de mercado:</strong> ${target.suporte}</p>
      <p><strong>Motivação:</strong> ${target.motivacao}</p>
    </article>
    <article class="detail-block">
      <h4>Avaliação do gestor</h4>
      <p><strong>Estado atual:</strong> ${statusBadge(target.estado)}</p>
      <label for="statusSelect-${target.id}"><strong>Atualizar estado:</strong></label>
      <select id="statusSelect-${target.id}" data-id="${target.id}" class="status-select">
        <option value="pendente" ${target.estado === "pendente" ? "selected" : ""}>Pendente</option>
        <option value="em análise" ${target.estado === "em análise" ? "selected" : ""}>Em análise</option>
        <option value="aprovada" ${target.estado === "aprovada" ? "selected" : ""}>Aprovada</option>
        <option value="rejeitada" ${target.estado === "rejeitada" ? "selected" : ""}>Rejeitada</option>
      </select>
      <p><strong>Observações do gestor:</strong></p>
      <textarea rows="4" placeholder="Adicionar comentário interno..."></textarea>
    </article>
  `;
}

function openModal(target) {
  modalBody.innerHTML = detailsPanel.innerHTML;
  modal.showModal();
}

function updateStatus(id, newStatus) {
  const target = candidaturas.find((item) => item.id === Number(id));
  if (!target) return;

  target.estado = newStatus;
  renderCards();
  applyFilters();
  renderReports();

  if (!detailsPanel.classList.contains("empty") && detailsPanel.textContent.includes(target.nome)) {
    renderDetails(target);
  }
}

function renderListByKey(listElementId, key) {
  const element = document.getElementById(listElementId);
  const map = candidaturas.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});

  element.innerHTML = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`)
    .join("");
}

function renderReports() {
  const counts = countByStatus();
  const total = counts.total || 1;
  const rows = [
    ["Pendente", counts.pendente],
    ["Em análise", counts["em análise"]],
    ["Aprovada", counts.aprovada],
    ["Rejeitada", counts.rejeitada]
  ];

  document.getElementById("statusBars").innerHTML = `
    <div class="status-bars">
      ${rows
        .map(
          ([label, value]) => `
            <div class="bar-row">
              <div><strong>${label}</strong> — ${value}</div>
              <div class="bar-track"><div class="bar-fill" style="width:${(value / total) * 100}%"></div></div>
            </div>`
        )
        .join("")}
    </div>`;

  renderListByKey("cursoStats", "curso");
  renderListByKey("faculdadeStats", "faculdade");
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSection = button.dataset.section;
    navButtons.forEach((item) => item.classList.toggle("active", item === button));
    panelSections.forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.panel !== targetSection);
    });

    sectionTitle.textContent = `Painel do Gestor — ${button.textContent.trim()}`;
  });
});

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);

tbody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;
  const candidatura = candidaturas.find((item) => item.id === Number(id));
  if (!candidatura) return;

  if (action === "details") {
    renderDetails(candidatura);
    openModal(candidatura);
    return;
  }

  if (action === "set-status") {
    updateStatus(id, button.dataset.value);
  }
});

modal.addEventListener("change", (event) => {
  if (event.target.classList.contains("status-select")) {
    updateStatus(event.target.dataset.id, event.target.value);
    const updated = candidaturas.find((item) => item.id === Number(event.target.dataset.id));
    if (updated) {
      renderDetails(updated);
      modalBody.innerHTML = detailsPanel.innerHTML;
    }
  }
});

closeModal.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  const box = modal.querySelector(".modal-card").getBoundingClientRect();
  const outside =
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom;
  if (outside) modal.close();
});

renderCards();
renderTable(candidaturas);
renderReports();
