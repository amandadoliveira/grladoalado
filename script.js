const form = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');

// Máscara de telefone
document.getElementById('telefone').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) {
        value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
    }
    if (value.length > 10) {
        value = value.slice(0, 10) + '-' + value.slice(10);
    }
    e.target.value = value;
});

// Máscara de aniversário (DD/MM)
document.getElementById('aniversario').addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
  
  if (value.length > 4) value = value.slice(0, 4); // Máximo 4 dígitos
  
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2);
  }
  
  e.target.value = value;
});

//Validação para data
function validarData(data) {
  const regex = /^(\d{2})\/(\d{2})$/;
  const match = data.match(regex);
  if (!match) {
    console.error("Formato inválido. Use DD/MM.");
    alert("Formato inválido. Use DD/MM.");
    return false;
  }
  const mes = parseInt(match[2]);
  if (mes < 1 || mes > 12) {
    console.error("Mês inválido. Deve ser de 01 até 12.");
    alert("Mês inválido. Deve ser de 01 até 12.");
    return false;
  }
  const dia = parseInt(match[1]);
  if (dia < 1) {
    console.error("Dia inválido.");
    alert("Dia inválido.");
    return false;
  }  
  if (mes == 2 && dia > 29) {
    console.error("Dia inválido. Deve ser de 01 até 29");
    alert("Dia inválido. Deve ser de 01 até 29");
    return false;   
  }
  if ((mes == 1 || mes == 3 || mes == 5 || mes == 7 || mes == 8 || mes == 10 || mes == 12) && dia > 31) {
    console.error("Dia inválido. Deve ser de 01 até 31");
    alert("Dia inválido. Deve ser de 01 até 31");
    return false;   
  }
  if (dia > 30) {
      console.error("Dia inválido. Deve ser de 01 até 30");
      alert("Dia inválido. Deve ser de 01 até 30");
      return false;   
  }  
  return true;
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Limpar erros
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    const nome = document.getElementById('nome').value.trim();
    const aniversario = document.getElementById('aniversario').value;
    const aniversario = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value.replace(/\D/g, '');

    if (!nome) {
        document.getElementById('nomeError').textContent = 'Nome é obrigatório.';
        valid = false;
    }

    if (!aniversario) {
      document.getElementById('aniversarioError').textContent = 'Aniversário é obrigatório.';
      valid = false;
    } else if (!validarData(aniversario)) {
      document.getElementById('aniversarioError').textContent = 'Data inválida. Use DD/MM.';
      valid = false;
    }

    if (telefone.length !== 11) {
        document.getElementById('telefoneError').textContent = 'Telefone deve ter 11 dígitos (DDD + número).';
        valid = false;
    }

    if (!email) {
        document.getElementById('emailError').textContent = 'E-mail é obrigatório.';
        valid = false;
    }

    if (!valid) return;

    // Enviar para webhook
    const payload = {
        nome: nome,
        aniversario: aniversario,
        telefone: document.getElementById('telefone').value
    };
    
    fetch('https://script.google.com/macros/s/AKfycbxRuCMvMjXgJD-61yNFxNDwFw9ed20cCoHrQweI6nfk9a089fYceDZBXaLmtF-tbMwI/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        successMessage.style.display = 'block';
        form.reset();
    })
    .catch((error) => {
        alert('Erro ao enviar: ' + error.message);
    });
});
