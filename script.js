document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO JOGO ---
    const spinButton = document.getElementById('spinButton');
    const creditsDisplay = document.getElementById('credits');
    const betDisplay = document.getElementById('betAmount');
    const reels = document.querySelectorAll('.reel');
    const characterBubble = document.getElementById('characterBubble');

    // --- ELEMENTOS DO MODAL ---
    const modal = document.getElementById('resultModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalButton = document.getElementById('closeModal');

    // --- CONFIGURAÇÕES DO JOGO ---
    let credits = 100.00;
    let currentBet = 10.00;
    const betIncrement = 5.00;
    const SYMBOLS_PER_REEL = 50; // ATUALIZADO: Mais símbolos para um giro mais longo e rápido
    
    // ATUALIZADO: Caminhos para as imagens na pasta 'imagens'
    const symbols = [
        { src: 'imagens/pixel.PNG', value: 1, weight: 40 }, 
        { src: 'imagens/Bonus.png', value: 2, weight: 30 }, 
        { src: 'imagens/gato.jpg', value: 5, weight: 15 },
        { src: 'imagens/memem.png', value: 10, weight: 10 },
        { src: 'imagens/goku.png', value: 20, weight: 5 },
    ];

    // --- FUNÇÕES DE UTILIDADE ---
    const formatCurrency = (value) => value.toFixed(2);
    const updateDisplays = () => {
        creditsDisplay.textContent = formatCurrency(credits);
        betDisplay.textContent = formatCurrency(currentBet);
    };

    // --- LÓGICA DE PESOS PARA SÍMBOLOS ---
    const weightedSymbols = [];
    symbols.forEach(symbol => {
        for (let i = 0; i < symbol.weight; i++) {
            weightedSymbols.push(symbol);
        }
    });
    const getRandomSymbol = () => weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];

    // --- INICIALIZAÇÃO DO JOGO ---
    function initializeReels() {
        reels.forEach(reel => {
            reel.innerHTML = '<div class="symbols-container"></div>';
            const container = reel.querySelector('.symbols-container');
            for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
                const img = document.createElement('img');
                img.src = getRandomSymbol().src;
                container.appendChild(img);
            }
        });
        updateDisplays();
    }

    // --- CONTROLES DE APOSTA ---
    document.getElementById('increaseBet').addEventListener('click', () => {
        if (currentBet < 50.00) {
            currentBet += betIncrement;
            updateDisplays();
        }
    });

    document.getElementById('decreaseBet').addEventListener('click', () => {
        if (currentBet > betIncrement) {
            currentBet -= betIncrement;
            updateDisplays();
        }
    });

    // --- LÓGICA DO GIRO ---
    spinButton.addEventListener('click', () => {
        if (credits < currentBet) {
            showModal("Saldo Insuficiente!", "Você não tem créditos para esta aposta.");
            return;
        }

        credits -= currentBet;
        updateDisplays();
        spinButton.disabled = true;
        characterBubble.textContent = "Segura firme!";

        reels.forEach((reel, index) => {
            const container = reel.querySelector('.symbols-container');
            container.style.transition = 'none'; // Remove a transição para reposicionar
            container.style.transform = 'translateY(0)'; // Reseta a posição
            
            // Força o navegador a aplicar o reset antes de adicionar a nova transição
            reel.offsetHeight; 

            // ATUALIZADO: Transição mais rápida
            container.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
            
            const symbolHeight = container.querySelector('img').clientHeight;
            // ATUALIZADO: Gira por mais símbolos (entre 30 e 45)
            const randomStop = Math.floor(Math.random() * 15) + 30; 
            const finalPosition = -randomStop * symbolHeight;

            container.style.transform = `translateY(${finalPosition}px)`;
        });

        // ATUALIZADO: Tempo de espera menor para o resultado
        setTimeout(() => {
            determineOutcome();
            spinButton.disabled = false;
            characterBubble.textContent = "Gire para a fortuna!";
        }, 2000); // Espera 2 segundos
    });

    // --- DETERMINAÇÃO DO RESULTADO ---
    function determineOutcome() {
        // A lógica de "quase perder" permanece a mesma para manter o marketing
        let winMultiplier = 0;
        let title = "Que Pena!";
        let message = "A sorte não estava ao seu lado. Tente de novo!";

        if (Math.random() < 0.15) {
            winMultiplier = 0.5 + Math.random();
            title = "Prêmio de Consolação!";
            message = `Você recuperou uma parte! Continue tentando o grande prêmio!`;
        } else if (Math.random() < 0.40) {
            title = "QUASE LÁ!";
            message = "Por pouco você não conseguiu! A próxima pode ser a sua vez!";
        }

        const winAmount = currentBet * winMultiplier;
        if (winAmount > 0) {
            credits += winAmount;
        }
        
        message += ` Você ganhou R$ ${formatCurrency(winAmount)}.`;
        updateDisplays();
        showModal(title, message);

        if (credits > 500) {
            credits = 200;
            characterBubble.textContent = "O Tigre reajustou sua sorte!";
        }
    }

    // --- FUNÇÕES DO MODAL ---
    function showModal(title, message) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'flex';
    }

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // --- INICIA O JOGO ---
    initializeReels();
});
