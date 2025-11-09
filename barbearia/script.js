// ===================================
// LÓGICA DO CARRINHO E MENU MOBILE
// ===================================

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const contador = document.getElementById('contador-carrinho');

// Elementos do menu responsivo (Se você tiver um menu responsivo no HTML)
const menuToggle = document.getElementById('menu-toggle');
const menuLinks = document.getElementById('menu-links');

if (menuToggle && menuLinks) {
    menuToggle.addEventListener('click', () => {
        menuLinks.classList.toggle('open');
    });
}

function atualizarContador() {
    if (contador) {
        contador.textContent = carrinho.length;
        contador.style.display = carrinho.length ? 'inline-block' : 'none';
    }
}

document.querySelectorAll('.servico').forEach(servico => {
    servico.addEventListener('click', () => {
        const nome = servico.querySelector('h3').textContent;
        const precoTexto = servico.querySelector('p').textContent.replace('R$', '').trim();
        const preco = parseFloat(precoTexto.replace(',', '.'));

        carrinho.push({ nome, preco });
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContador();

        // Feedback visual
        servico.style.transform = 'scale(1.05)';
        servico.style.transition = 'transform 0.2s';
        setTimeout(() => servico.style.transform = 'scale(1)', 200);
    });
});

atualizarContador();


// ===================================
// LÓGICA DE AGENDAMENTO (COMPLETA E CORRIGIDA)
// ===================================

const selectData = document.getElementById('data');
const selectHorario = document.getElementById('horario');
const formAgendamento = document.getElementById('form-agendamento');
const mensagemFeedback = document.getElementById('mensagem');
const btnAgendar = document.getElementById('btn-agendar'); // Agora ele encontra o botão!

// --- Funções de Persistência ---
function carregarAgendamentos() {
    return JSON.parse(localStorage.getItem('agendamentos')) || [];
}

function salvarAgendamentos(agendamentos) {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}
// ------------------------------

// Função principal para gerar os horários com todas as regras
function preencherHorarios(dataSelecionada = null) {
    if (!selectHorario) return;

    // Limpa as opções de horário existentes
    selectHorario.innerHTML = '<option value="">Escolha o horário</option>';
    mensagemFeedback.textContent = ''; // Limpa feedback anterior

    if (!dataSelecionada) {
        return; 
    }

    const dataObj = new Date(dataSelecionada + 'T00:00:00');
    
    if (dataObj.toString() === 'Invalid Date') {
        mensagemFeedback.textContent = 'Data inválida. Por favor, selecione uma data válida.';
        mensagemFeedback.style.color = 'red';
        return;
    }

    const diaSemana = dataObj.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

    let horaInicio = 9;
    let horaFim = 17; // Fechamento padrão: 17:00 (último slot é 16:00)
    const intervaloMinutos = 60; // Slots de 1 em 1 hora

    // Regras Especiais
    if (diaSemana === 0) { // DOMINGO (Fechado)
        mensagemFeedback.textContent = '❌ A barbearia está fechada aos Domingos.';
        mensagemFeedback.style.color = 'red';
        if (btnAgendar) btnAgendar.style.display = 'none'; 
        return; 
    } else if (diaSemana === 6) { // SÁBADO
        horaInicio = 8; // Abre às 8h
        horaFim = 12; // Fecha ao meio-dia (último slot é 11:00)
    } 
    
    // Garante que o botão esteja visível para dias abertos
    if (btnAgendar) btnAgendar.style.display = 'block';

    // 2. Carrega agendamentos salvos
    const agendamentosExistentes = carregarAgendamentos();
    const reservadosNoDia = agendamentosExistentes
        .filter(agendamento => agendamento.data === dataSelecionada)
        .map(agendamento => agendamento.horario);

    // 3. Loop para gerar e bloquear horários
    for (let h = horaInicio; h < horaFim; h++) {
        for (let m = 0; m < 60; m += intervaloMinutos) {
            
            const horarioCompleto = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            
            // Pausa de Almoço (somente de Segunda a Sexta)
            if (diaSemana >= 1 && diaSemana <= 5) {
                // Pula o slot de 12:00 e 13:00 (almoço: das 12h até 14h)
                if (h >= 12 && h < 14) { 
                    continue; 
                }
            }

            const option = document.createElement('option');
            option.value = horarioCompleto;
            option.textContent = horarioCompleto;
            
            // Bloqueia se estiver reservado
            if (reservadosNoDia.includes(horarioCompleto)) {
                option.disabled = true; 
                option.textContent += ' (Reservado)'; 
            }

            selectHorario.appendChild(option);
        }
    }
}

// Listener: Salva o agendamento e mostra feedback
if (formAgendamento && btnAgendar) {
    formAgendamento.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!selectHorario.value) {
            mensagemFeedback.textContent = 'Por favor, selecione um horário válido.';
            mensagemFeedback.style.color = 'red';
            return;
        }

        const agendamento = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            servico: document.getElementById('servico').value,
            data: selectData.value,
            horario: selectHorario.value
        };

        const agendamentos = carregarAgendamentos();
        agendamentos.push(agendamento);
        salvarAgendamentos(agendamentos);

        // --- Feedback Visual: Oculta botão e mostra mensagem (AGORA FUNCIONA) ---
        btnAgendar.style.display = 'none';
        
        mensagemFeedback.textContent = `✅ Agendamento de ${agendamento.servico} para ${agendamento.data} às ${agendamento.horario} feito com sucesso!`;
        mensagemFeedback.style.color = 'green';
        
        formAgendamento.reset(); 

        preencherHorarios(selectData.value);
        
        // Adiciona um timer para o botão reaparecer
        setTimeout(() => {
            btnAgendar.style.display = 'block';
            mensagemFeedback.textContent = ''; 
        }, 5000); 
    });
}


// Listener: Repopula os horários quando a data muda
if (selectData && selectHorario) {
    selectData.addEventListener('change', (e) => {
        if (btnAgendar) btnAgendar.style.display = 'block';
        mensagemFeedback.textContent = ''; 
        
        preencherHorarios(e.target.value); 
    });

    preencherHorarios(selectData.value);
}