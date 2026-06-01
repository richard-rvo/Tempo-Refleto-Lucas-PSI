document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Alternância de Seções Principais (Tabs)
  // ==========================================
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.content-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      // Atualiza aba ativa
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Exibe seção correspondente
      sections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === `section-${targetTab}`) {
          sec.classList.add('active');
        }
      });
    });
  });

  // ==========================================
  // 2. Alternância de Telas do Mockup Mobile
  // ==========================================
  const phoneNavBtns = document.querySelectorAll('.phone-nav-btn');
  const controlBtns = document.querySelectorAll('.control-btn');
  const phoneScreens = document.querySelectorAll('.phone-screen');

  function switchPhoneScreen(screenId) {
    // Sincroniza navegação do celular
    phoneNavBtns.forEach(btn => {
      if (btn.getAttribute('data-screen') === screenId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Sincroniza botões de controle externos
    controlBtns.forEach(btn => {
      if (btn.getAttribute('data-screen') === screenId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Mostra a tela correspondente no celular
    phoneScreens.forEach(screen => {
      screen.classList.remove('active');
      if (screen.id === `phone-screen-${screenId}`) {
        screen.classList.add('active');
      }
    });
  }

  phoneNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const screenId = btn.getAttribute('data-screen');
      if (screenId) switchPhoneScreen(screenId);
    });
  });

  controlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const screenId = btn.getAttribute('data-screen');
      if (screenId) switchPhoneScreen(screenId);
    });
  });

  // ==========================================
  // 3. Seleção de Humor & Intensidade no Check-in
  // ==========================================
  const moodItems = document.querySelectorAll('.mood-item');
  const intensityDots = document.querySelectorAll('.intensity-dot');
  let selectedMood = 'joy'; // alegria por padrão
  let selectedIntensity = 3; // intensidade 3 por padrão

  const moodColorClasses = {
    joy: 'active',
    sadness: 'active-sadness',
    anger: 'active-anger',
    anxiety: 'active-anxiety'
  };

  const moodLabelsMap = {
    joy: { label: 'Alegria', emoji: '😊' },
    sadness: { label: 'Tristeza', emoji: '😢' },
    anger: { label: 'Raiva', emoji: '😤' },
    anxiety: { label: 'Ansiedade', emoji: '😰' }
  };

  // Clique no humor
  moodItems.forEach(item => {
    item.addEventListener('click', () => {
      const mood = item.getAttribute('data-mood');
      selectedMood = mood;

      // Atualiza active do Grid de Humor
      moodItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      // Atualiza a cor dos dots de intensidade já selecionados
      updateIntensityScale();
    });
  });

  // Clique nos dots de intensidade
  intensityDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const value = parseInt(dot.getAttribute('data-value'), 10);
      selectedIntensity = value;
      updateIntensityScale();
    });
  });

  function updateIntensityScale() {
    const activeClass = moodColorClasses[selectedMood];

    intensityDots.forEach(dot => {
      const value = parseInt(dot.getAttribute('data-value'), 10);

      // Remove todas as classes de cores possíveis
      Object.values(moodColorClasses).forEach(cls => {
        dot.classList.remove(cls);
      });

      // Aplica a classe correspondente ao humor até o valor selecionado
      if (value <= selectedIntensity) {
        dot.classList.add(activeClass);
      }
    });
  }

  // Inicializa a escala com o humor padrão (Joy)
  updateIntensityScale();

  // ==========================================
  // 4. Fluxo de Simulação do "Salvar Registro"
  // ==========================================
  const saveBtn = document.getElementById('btn-save-record');
  const textarea = document.querySelector('.thought-textarea');
  const entriesList = document.querySelector('.phone-entries-list');

  saveBtn.addEventListener('click', () => {
    const textContent = textarea.textContent.trim();
    const entryTitle = textContent !== '' ? textContent : 'Registro Rápido';
    const moodDetails = moodLabelsMap[selectedMood];

    // Desativa botão e mostra loading
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';
    saveBtn.style.backgroundColor = 'var(--secondary)';

    setTimeout(() => {
      // Simula sucesso
      saveBtn.textContent = 'Salvo! ✓';
      saveBtn.style.backgroundColor = 'var(--joy)';

      // Cria um novo item na lista de histórico
      const newEntry = document.createElement('div');
      newEntry.className = 'entry-item';
      newEntry.style.animation = 'fadeIn 0.5s ease';
      newEntry.innerHTML = `
        <span class="entry-emoji">${moodDetails.emoji}</span>
        <div class="entry-text">
          <p class="entry-title">${entryTitle}</p>
          <p class="entry-sub">Hoje · ${moodDetails.label}</p>
        </div>
        <span class="arrow">›</span>
      `;

      // Insere no topo da lista
      if (entriesList.firstChild) {
        entriesList.insertBefore(newEntry, entriesList.firstChild);
      } else {
        entriesList.appendChild(newEntry);
      }

      // Limpa formulário
      textarea.textContent = '';

      setTimeout(() => {
        // Reseta o botão
        saveBtn.disabled = false;
        saveBtn.textContent = 'Salvar registro';
        saveBtn.style.backgroundColor = 'var(--primary)';

        // Transiciona para a tela de Histórico para ver o resultado
        switchPhoneScreen('historico');
      }, 1200);

    }, 1000);
  });

});
