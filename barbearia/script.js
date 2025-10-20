// Lista para armazenar agendamentos (simples - só no navegador)
const agendamentos = [];

// Elementos
const dataInput = document.getElementById('data');
const horarioSelect = document.getElementById('horario');
const form = document.getElementById('form-agendamento');
const mensagem = document.getElementById('mensagem');

// Função para gerar horários disponíveis com base no dia escolhido
function gerarHorarios(dataSelecionada) {
  horarioSelect.innerHTML = '<option value="">Escolha o horário</option>';

  const data = new Date(dataSelecionada);
  const diaSemana = data.getDay(); // 0 = Domingo, 6 = Sábado

  // Domingo fechado
  if (diaSemana === 0) {
    horarioSelect.innerHTML = '<option value="">Domingo - Fechado</option>';
    return;
  }

  // Turnos
  const horarios = [];

  // Manhã
  for (let hora = 8; hora <= 11; hora++) {
    horarios.push(`${hora}:00`);
  }

  // Sábado só de manhã
  if (diaSemana !== 6) {
    // Tarde
    for (let hora = 14; hora <= 18; hora++) {
      horarios.push(`${hora}:00`);
    }
  }

  // Preenche o select com horários disponíveis
  horarios.forEach(h => {
    const option = document.createElement('option');
    option.value = h;
    option.textContent = h;
    horarioSelect.appendChild(option);
  });
}

// Quando a data muda → gerar horários
dataInput.addEventListener('change', (e) => {
  gerarHorarios(e.target.value);
});

// Quando o formulário for enviado
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const servico = document.getElementById('servico').value;
  const data = dataInput.value;
  const horario = horarioSelect.value;

  // Verifica se já existe agendamento para o mesmo dia e hora
  const jaAgendado = agendamentos.find(a => a.data === data && a.horario === horario);

  if (jaAgendado) {
    mensagem.textContent = `⚠️ O horário das ${horario} já está indisponível.`;
    mensagem.style.color = 'red';
    return;
  }

  // Salva agendamento
  agendamentos.push({ nome, telefone, servico, data, horario });

  mensagem.textContent = `✅ Agendamento confirmado para ${data} às ${horario}.`;
  mensagem.style.color = 'green';

  form.reset();
  horarioSelect.innerHTML = '<option value="">Escolha o horário</option>';
});
