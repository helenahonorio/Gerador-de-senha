// 1. Seleção de elementos HTML
const campoSenha = document.getElementById('campo-senha');
const textoCaracteres = document.querySelector('.parametro-senha__texto');
const botaoDiminuir = document.querySelector('.parametro-senha-botoes button:nth-child(1)');
const botaoAumentar = document.querySelector('.parametro-senha-botoes button:nth-child(3)');

const checkboxMaiusculas = document.getElementById('maiusculo');
const checkboxMinusculas = document.getElementById('minusculo');
const checkboxNumeros = document.getElementById('numero');
const checkboxSimbolos = document.getElementById('simbolo');

const forcaSenha = document.querySelector('.forca');
const valorEntropia = document.getElementById('valor-entropia'); // Elemento para exibir o texto dos dias

// 2. Variáveis de controle
let tamanhoSenha = 12;
textoCaracteres.textContent = tamanhoSenha;

// Conjuntos de caracteres
const caracteres = {
    maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    numeros: '0123456789',
    simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>/?'
};

// 3. Funções para gerar a senha e calcular a entropia
function gerarSenha() {
    let caracteresDisponiveis = '';
    let senhaGerada = '';

    // Constrói a string de caracteres disponíveis com base nos checkboxes
    if (checkboxMaiusculas.checked) {
        caracteresDisponiveis += caracteres.maiusculas;
    }
    if (checkboxMinusculas.checked) {
        caracteresDisponiveis += caracteres.minusculas;
    }
    if (checkboxNumeros.checked) {
        caracteresDisponiveis += caracteres.numeros;
    }
    if (checkboxSimbolos.checked) {
        caracteresDisponiveis += caracteres.simbolos;
    }

    // Se nenhum checkbox estiver marcado, garante que a senha não seja vazia
    // ou você pode definir um comportamento padrão, como usar apenas minúsculas
    if (caracteresDisponiveis === '') {
        caracteresDisponiveis = caracteres.minusculas; // Padrão se nada for selecionado
        checkboxMinusculas.checked = true; // Marca o checkbox para indicar o padrão
    }

    // Gera a senha aleatória
    for (let i = 0; i < tamanhoSenha; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteresDisponiveis.length);
        senhaGerada += caracteresDisponiveis[indiceAleatorio];
    }

    campoSenha.value = senhaGerada; // Atualiza o campo da senha no HTML
    calcularEntropia(senhaGerada, caracteresDisponiveis.length); // Chama o cálculo da entropia
}

function calcularEntropia(senha, numCaracteresPossiveis) {
    // Entropia = log2(numCaracteresPossiveis ^ tamanhoSenha)
    // Usamos Math.log2 para logaritmo na base 2
    const entropia = Math.log2(Math.pow(numCaracteresPossiveis, senha.length));

    // Atualiza a barra de força da senha
    if (entropia < 32) {
        forcaSenha.classList.remove('media', 'forte');
        forcaSenha.classList.add('fraca');
    } else if (entropia >= 32 && entropia < 64) {
        forcaSenha.classList.remove('fraca', 'forte');
        forcaSenha.classList.add('media');
    } else {
        forcaSenha.classList.remove('fraca', 'media');
        forcaSenha.classList.add('forte');
    }

    // Atualiza o texto com o tempo estimado para quebrar a senha
    // Esta é a parte que foi corrigida e melhorada na aula atual
    // 100e6 = 100 milhões de tentativas por segundo
    // 60*60*24 = segundos em um dia
    const diasParaQuebrar = Math.floor(2**entropia / (100e6 * 60 * 60 * 24));
    valorEntropia.textContent = "Um computador pode levar até " + diasParaQuebrar + " dias para descobrir essa senha.";
}

// 4. Adicionar ouvintes de evento (Event Listeners)
botaoDiminuir.addEventListener('click', () => {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
        textoCaracteres.textContent = tamanhoSenha;
        gerarSenha();
    }
});

botaoAumentar.addEventListener('click', () => {
    if (tamanhoSenha < 20) { // Você pode ajustar o limite máximo
        tamanhoSenha++;
        textoCaracteres.textContent = tamanhoSenha;
        gerarSenha();
    }
});

checkboxMaiusculas.addEventListener('change', gerarSenha);
checkboxMinusculas.addEventListener('change', gerarSenha);
checkboxNumeros.addEventListener('change', gerarSenha);
checkboxSimbolos.addEventListener('change', gerarSenha);

// 5. Chamada inicial
// Gera a senha e calcula a entropia assim que a página carrega
gerarSenha();