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

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Limpar erros
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    const nome = document.getElementById('nome').value.trim();
    const aniversario = document.getElementById('aniversario').value;
    const telefone = document.getElementById('telefone').value.replace(/\D/g, '');

    if (!nome) {
        document.getElementById('nomeError').textContent = 'Nome é obrigatório.';
        valid = false;
    }

    if (!aniversario) {
        document.getElementById('aniversarioError').textContent = 'Aniversário é obrigatório.';
        valid = false;
    }

    if (telefone.length !== 11) {
        document.getElementById('telefoneError').textContent = 'Telefone deve ter 11 dígitos (DDD + número).';
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
