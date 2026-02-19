(function () {
  const publicIndex = [
    { title: 'Procedimentos de Incubação', url: 'public/procedimentos.html', section: 'Procedimentos', keywords: 'candidatura triagem incubação mentoria acompanhamento fases', excerpt: 'Conheça as fases da candidatura, triagem, incubação, mentoria e acompanhamento.' },
    { title: '1. Candidatura', url: 'public/procedimentos.html#candidatura', section: 'Procedimentos', keywords: 'submissão registo projecto equipa', excerpt: 'Registo no portal e submissão do projecto com documentação inicial.' },
    { title: '2. Triagem', url: 'public/procedimentos.html#triagem', section: 'Procedimentos', keywords: 'validação documental elegibilidade', excerpt: 'A equipa técnica verifica elegibilidade e alinhamento com os critérios.' },
    { title: 'Regulamento Interno da Incubadora', url: 'public/legislacao.html#regulamento', section: 'Legislação', keywords: 'normas regulamento interno governança', excerpt: 'Documento base com regras de funcionamento e participação no programa.' },
    { title: 'Política de Privacidade e Dados', url: 'public/legislacao.html#privacidade', section: 'Legislação', keywords: 'privacidade dados consentimento segurança', excerpt: 'Regras sobre tratamento de dados pessoais e consentimento informado.' },
    { title: 'Termos de Participação', url: 'public/legislacao.html#termos', section: 'Legislação', keywords: 'termos participação direitos deveres', excerpt: 'Condições de adesão e responsabilidades dos participantes.' },
    { title: 'Quem pode candidatar-se?', url: 'public/faq.html#faq-1', section: 'FAQ', keywords: 'elegibilidade estudantes graduados microempresas', excerpt: 'Estudantes, recém-graduados e microempresas com projectos inovadores.' },
    { title: 'Qual a duração da incubação?', url: 'public/faq.html#faq-3', section: 'FAQ', keywords: 'duração meses incubação', excerpt: 'A incubação pode durar entre 6 e 12 meses conforme metas.' },
    { title: 'Como acompanho o estado da candidatura?', url: 'public/faq.html#faq-5', section: 'FAQ', keywords: 'estado candidatura acompanhamento área reservada', excerpt: 'O estado é consultado na área reservada, em Acompanhamento.' },
    { title: 'Demo Day 2026 abre inscrições', url: 'public/noticias.html#noticia-demo-day', section: 'Notícias', keywords: 'evento demo day inscrições pitch', excerpt: 'Incubadora abre chamada para projectos no Demo Day 2026.' },
    { title: 'Mentoria em finanças para startups', url: 'public/noticias.html#noticia-mentoria', section: 'Notícias', keywords: 'mentoria finanças planeamento', excerpt: 'Sessão com especialistas para reforço da sustentabilidade financeira.' },
    { title: 'Parceria com ecossistema local', url: 'public/noticias.html#noticia-parceria', section: 'Notícias', keywords: 'parceiros ecossistema emprego inovação', excerpt: 'Nova parceria para ampliar oportunidades de mercado e emprego.' }
  ];

  const appIndex = [
    { title: 'Ficheiro: Formulário de Candidatura Inicial (PDF)', url: 'app/ficheiros.html', section: 'Ficheiros', keywords: 'formulário candidatura pdf', excerpt: 'Documento oficial para submissão inicial de candidatura.' },
    { title: 'Ficheiro: Modelo de Plano de Negócios (DOCX)', url: 'app/ficheiros.html', section: 'Ficheiros', keywords: 'plano negócios docx', excerpt: 'Modelo editável para estruturação do plano de negócios.' },
    { title: 'Ficheiro: Checklist de Propriedade Intelectual (PDF)', url: 'app/ficheiros.html', section: 'Ficheiros', keywords: 'checklist propriedade intelectual', excerpt: 'Lista de verificação para protecção de activos intelectuais.' },
    { title: 'Tutorial: Como preparar o Pitch', url: 'app/tutoriais.html', section: 'Tutoriais', keywords: 'pitch apresentação vídeo', excerpt: 'Passo a passo para construir um pitch de alto impacto.' },
    { title: 'Tutorial: Modelo de negócio simplificado', url: 'app/tutoriais.html', section: 'Tutoriais', keywords: 'canvas modelo negócio', excerpt: 'Introdução prática ao Business Model Canvas.' },
    { title: 'Tutorial: Finanças para startups', url: 'app/tutoriais.html', section: 'Tutoriais', keywords: 'finanças custos receitas', excerpt: 'Noções essenciais para gestão financeira inicial.' },
    { title: 'Ajuda reservada: Como actualizar perfil?', url: 'app/dashboard.html', section: 'Ajuda reservada', keywords: 'ajuda perfil conta', excerpt: 'Edite contactos e dados de identificação no painel do utilizador.' },
    { title: 'Ajuda reservada: Como submeter candidatura?', url: 'app/submissao.html', section: 'Ajuda reservada', keywords: 'ajuda submissão candidatura', excerpt: 'Preencha todos os campos obrigatórios e valide antes de submeter.' },
    { title: 'Ajuda reservada: Como descarregar ficheiros?', url: 'app/ficheiros.html', section: 'Ajuda reservada', keywords: 'ajuda descarregar documentos', excerpt: 'Use o botão Descarregar na biblioteca de documentos.' },
    { title: 'Ajuda reservada: Como interpretar o acompanhamento?', url: 'app/acompanhamento.html', section: 'Ajuda reservada', keywords: 'ajuda acompanhamento estado', excerpt: 'A timeline mostra a fase actual da sua candidatura.' },
    { title: 'Ajuda reservada: Como aceder a tutoriais?', url: 'app/tutoriais.html', section: 'Ajuda reservada', keywords: 'ajuda vídeos formação', excerpt: 'Navegue pela biblioteca de tutoriais e abra em nova aba.' },
    { title: 'Ajuda reservada: Conta pendente de validação', url: 'app/login.html', section: 'Ajuda reservada', keywords: 'pendente validação aprovação', excerpt: 'A validação é feita pela equipa da Incubadora antes do acesso completo.' }
  ];

  window.SearchIndex = { publicIndex, appIndex };
})();
