class LottoGenerator {
    constructor() {
        this.balls = document.querySelectorAll('.ball');
        this.generateBtn = document.getElementById('generateBtn');
        this.smartGenerateBtn = document.getElementById('smartGenerateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.historyList = document.getElementById('historyList');
        this.generatorMode = document.getElementById('generatorMode');
        this.isGenerating = false;
        this.currentNumbers = null;

        this.initEventListeners();
        this.loadHistory();
    }

    initEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateNumbers('random'));
        this.smartGenerateBtn.addEventListener('click', () => this.generateNumbers('smart'));
        this.resetBtn.addEventListener('click', () => this.resetBalls());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Gewinnzahlen-Überprüfung
        const checkBtn = document.getElementById('checkBtn');
        checkBtn.addEventListener('click', () => this.checkWinnings());
        
        // Enter-Taste zum Überprüfen
        const winningInputs = document.querySelectorAll('.winning-input');
        winningInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkWinnings();
                }
            });
        });
    }

    generateNumbers(mode = 'random') {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.smartGenerateBtn.disabled = true;
        this.generatorMode.textContent = mode === 'smart' 
            ? '⚡ Intelligente Zahlenanalyse läuft...' 
            : '🎲 Zufallszahlen werden generiert...';

        // Zahlen animieren
        this.animateBalls();

        // Generierung simulieren (3-4 Sekunden)
        setTimeout(() => {
            const result = mode === 'smart' 
                ? this.drawSmartLottoNumbers() 
                : this.drawRandomLottoNumbers();
            
            this.currentNumbers = result;
            this.displayNumbers(result);
            this.addToHistory(result, mode);
            this.isGenerating = false;
            this.generateBtn.disabled = false;
            this.smartGenerateBtn.disabled = false;
            this.generatorMode.textContent = '';
        }, 3500);
    }

    drawRandomLottoNumbers() {
        // 6 Zahlen von 1-49
        const numbers = this.getRandomNumbers(1, 49, 6);
        // 1 Zusatzzahl von 0-9
        const bonus = this.getRandomNumber(0, 9);
        return { numbers, bonus, mode: 'random' };
    }

    drawSmartLottoNumbers() {
        // Intelligenter Generator der Muster vermeidet
        let numbers = [];
        let attempts = 0;
        const maxAttempts = 100;

        while (numbers.length < 6 && attempts < maxAttempts) {
            attempts++;
            const candidate = this.getRandomNumbers(1, 49, 6);
            
            // Prüfe auf verschiedene Muster
            if (this.isValidSmartSet(candidate)) {
                numbers = candidate;
            }
        }

        // Fallback: Wenn intelligente Generierung fehlschlägt
        if (numbers.length === 0) {
            numbers = this.getRandomNumbers(1, 49, 6);
        }

        const bonus = this.getRandomNumber(0, 9);
        return { numbers, bonus, mode: 'smart' };
    }

    isValidSmartSet(numbers) {
        // Prüfe auf zu viele Nummern im selben Bereich (z.B. Geburtstag-ähnliche Muster)
        if (this.hasBirthdayPattern(numbers)) {
            return false;
        }

        // Prüfe auf arithmetische Sequenzen (1,2,3,4,5,6)
        if (this.hasArithmeticSequence(numbers)) {
            return false;
        }

        // Prüfe auf zu ähnliche Zahlen
        if (this.hasTooCloseNumbers(numbers)) {
            return false;
        }

        // Prüfe auf gute Verteilung
        if (!this.hasGoodDistribution(numbers)) {
            return false;
        }

        return true;
    }

    hasBirthdayPattern(numbers) {
        // Erkenne Geburtstagsmuster (z.B. Tag, Monat, Jahr oder ähnliches)
        // Tag: 1-31, Monat: 1-12, Jahr-Teile: typisch 1950-2050
        
        const dayMonthCombos = [];
        for (let i = 1; i <= 31; i++) {
            for (let j = 1; j <= 12; j++) {
                dayMonthCombos.push([i, j]);
            }
        }

        // Prüfe ob mehrere Zahlen wie Geburtsdaten aussehen
        let birthdayIndicators = 0;
        for (let i = 0; i < numbers.length; i++) {
            // Tag 1-31
            if (numbers[i] >= 1 && numbers[i] <= 31) birthdayIndicators++;
        }

        // Wenn zu viele kleine Zahlen (typisch für Geburtstag)
        if (birthdayIndicators >= 4) {
            return true;
        }

        return false;
    }

    hasArithmeticSequence(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        
        // Prüfe auf Differenzen zwischen aufeinanderfolgenden Zahlen
        const differences = [];
        for (let i = 1; i < sorted.length; i++) {
            differences.push(sorted[i] - sorted[i - 1]);
        }

        // Wenn es eine konsistente Differenz gibt (z.B. alle +1 oder +2)
        const constantDiff = differences.every(d => d === differences[0]);
        if (constantDiff && differences[0] > 0) {
            return true;
        }

        // Prüfe auf bekannte Sequenzen
        if (JSON.stringify(sorted) === JSON.stringify([1, 2, 3, 4, 5, 6])) {
            return true;
        }

        return false;
    }

    hasTooCloseNumbers(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        
        // Prüfe ob es 3 oder mehr konsekutive oder sehr nahe Zahlen gibt
        let consecutiveCount = 1;
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] - sorted[i - 1] <= 2) {
                consecutiveCount++;
                if (consecutiveCount >= 3) {
                    return true;
                }
            } else {
                consecutiveCount = 1;
            }
        }

        return false;
    }

    hasGoodDistribution(numbers) {
        const sorted = [...numbers].sort((a, b) => a - b);
        
        // Die Zahlen sollten gut über den Bereich 1-49 verteilt sein
        // Mindestens eine Zahl sollte in niedrigem, mittlerem und höherem Bereich sein
        
        const low = sorted.filter(n => n <= 16).length;
        const mid = sorted.filter(n => n > 16 && n <= 33).length;
        const high = sorted.filter(n => n > 33).length;

        // Wir wollen keine zu einseitige Verteilung
        if (low === 0 || mid === 0 || high === 0) {
            return false;
        }

        return true;
    }

    getRandomNumbers(min, max, count) {
        const numbers = [];
        while (numbers.length < count) {
            const num = this.getRandomNumber(min, max);
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers.sort((a, b) => a - b);
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    animateBalls() {
        this.balls.forEach(ball => {
            ball.classList.add('animating');
            ball.textContent = '';
        });
    }

    displayNumbers(result) {
        const { numbers, bonus } = result;

        // Normale Zahlen anzeigen
        numbers.forEach((num, index) => {
            setTimeout(() => {
                this.balls[index].classList.remove('animating');
                this.balls[index].textContent = num;
                this.balls[index].classList.add('drawn');
            }, (index + 1) * 300);
        });

        // Zusatzzahl anzeigen
        setTimeout(() => {
            this.balls[6].classList.remove('animating');
            this.balls[6].textContent = bonus;
            this.balls[6].classList.add('drawn');
        }, 2100);
    }

    resetBalls() {
        this.balls.forEach(ball => {
            ball.textContent = '—';
            ball.classList.remove('animating', 'drawn');
        });
        this.currentNumbers = null;
        this.generatorMode.textContent = '';
    }

    addToHistory(result, mode) {
        const history = this.getHistory();
        const entry = {
            id: Date.now(),
            numbers: result.numbers,
            bonus: result.bonus,
            mode: mode,
            timestamp: new Date().toLocaleString('de-DE')
        };
        history.unshift(entry);
        // Maximal 20 Einträge speichern
        if (history.length > 20) {
            history.pop();
        }
        localStorage.setItem('lottoHistory', JSON.stringify(history));
        this.renderHistory();
    }

    getHistory() {
        const history = localStorage.getItem('lottoHistory');
        return history ? JSON.parse(history) : [];
    }

    renderHistory() {
        const history = this.getHistory();

        if (history.length === 0) {
            this.historyList.innerHTML = '<p class="empty-message">Noch keine Kombinationen generiert</p>';
            return;
        }

        this.historyList.innerHTML = history.map(entry => {
            const modeIcon = entry.mode === 'smart' ? '✨' : '🎲';
            const modeLabel = entry.mode === 'smart' ? 'Intelligent' : 'Zufällig';
            
            return `
            <div class="history-item">
                <div class="history-numbers">
                    ${entry.numbers.map(num => `<div class="history-ball">${num}</div>`).join('')}
                    <div class="history-separator">+</div>
                    <div class="history-ball bonus">${entry.bonus}</div>
                </div>
                <div class="history-meta">
                    <span class="history-mode">${modeIcon} ${modeLabel}</span>
                    <span class="history-time">${entry.timestamp}</span>
                </div>
                <button class="history-delete" data-id="${entry.id}" title="Löschen">✕</button>
            </div>
        `;
        }).join('');

        // Event Listener für Delete Buttons
        document.querySelectorAll('.history-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.deleteHistoryItem(id);
            });
        });
    }

    deleteHistoryItem(id) {
        const history = this.getHistory();
        const filtered = history.filter(item => item.id != id);
        localStorage.setItem('lottoHistory', JSON.stringify(filtered));
        this.renderHistory();
    }

    clearHistory() {
        if (confirm('Möchtest du wirklich den gesamten Verlauf löschen?')) {
            localStorage.removeItem('lottoHistory');
            this.renderHistory();
        }
    }

    loadHistory() {
        this.renderHistory();
    }

    checkWinnings() {
        // Überprüfe ob die aktuellen Zahlen gesetzt sind
        if (!this.currentNumbers) {
            this.showResult('error', 'Bitte generiere erst Zahlen, bevor du die Gewinnzahlen überprüfst!');
            return;
        }

        // Hole die eingegebenen Gewinnzahlen
        const winningNumbers = this.getWinningInput();

        if (!winningNumbers) {
            return; // Fehler werden bereits in getWinningInput angezeigt
        }

        // Vergleiche die Zahlen
        const comparison = this.compareNumbers(this.currentNumbers, winningNumbers);

        // Zeige die Ergebnisse
        this.displayResults(comparison);
    }

    getWinningInput() {
        const inputs = [];
        const inputIds = ['winBall1', 'winBall2', 'winBall3', 'winBall4', 'winBall5', 'winBall6', 'winBonus'];
        
        for (let i = 0; i < 6; i++) {
            const value = parseInt(document.getElementById(inputIds[i]).value);
            if (isNaN(value) || value < 1 || value > 49) {
                this.showResult('error', `Eingabe ${i + 1}: Bitte gib eine Zahl zwischen 1 und 49 ein!`);
                return null;
            }
            inputs.push(value);
        }

        const bonus = parseInt(document.getElementById('winBonus').value);
        if (isNaN(bonus) || bonus < 0 || bonus > 9) {
            this.showResult('error', 'Zusatzzahl: Bitte gib eine Zahl zwischen 0 und 9 ein!');
            return null;
        }
        inputs.push(bonus);

        // Überprüfe auf Duplikate bei den 6 normalen Zahlen
        const normalNumbers = inputs.slice(0, 6);
        if (new Set(normalNumbers).size !== 6) {
            this.showResult('error', 'Fehler: Du hast doppelte Zahlen eingegeben!');
            return null;
        }

        return { numbers: normalNumbers.sort((a, b) => a - b), bonus };
    }

    compareNumbers(generated, winning) {
        const genNumbers = generated.numbers;
        const genBonus = generated.bonus;
        const winNumbers = winning.numbers;
        const winBonus = winning.bonus;

        // Zähle die korrekten Zahlen
        let correctCount = 0;
        const correctNumbers = [];
        
        for (let num of genNumbers) {
            if (winNumbers.includes(num)) {
                correctCount++;
                correctNumbers.push(num);
            }
        }

        const correctBonus = genBonus === winBonus;

        return {
            correctCount,
            correctNumbers,
            correctBonus,
            generated: generated,
            winning: winning
        };
    }

    displayResults(comparison) {
        const container = document.getElementById('resultContainer');
        const { correctCount, correctNumbers, correctBonus, winning } = comparison;

        if (correctCount === 6) {
            // JACKPOT!
            const html = `
                <div class="result-box result-jackpot">
                    <div class="result-title">🎉 JACKPOT! 🎉</div>
                    <div class="result-matches">6 Richtige!</div>
                    <div class="jackpot-message">
                        <strong>Herzlichen Glückwunsch!</strong><br>
                        Du hast 6 richtige Zahlen getroffen!<br><br>
                        <strong>Bitte wende dich unverzüglich an die Lotto-Zentrale:</strong><br>
                        📞 <strong>Deutsches Lotto (DLV)</strong><br>
                        Tel: +49 (69) 1 34 5 66<br>
                        www.lotto.de<br><br>
                        Vergesse nicht, dein Ticket zu sichern! 🎫
                    </div>
                </div>
            `;
            container.innerHTML = html;
        } else {
            // Normale Ergebnisse
            let resultClass = 'result-good';
            let message = '';

            if (correctCount === 0 && !correctBonus) {
                resultClass = 'result-warning';
                message = '😔 Leider keine Treffer.';
            } else if (correctCount <= 3) {
                resultClass = 'result-warning';
                message = '😊 Kleine Treffer!';
            } else {
                message = '🎉 Gute Treffer!';
            }

            const bonusText = correctBonus ? ' + Zusatzzahl' : '';
            const html = `
                <div class="result-box ${resultClass}">
                    <div class="result-title">${message}</div>
                    <div class="result-matches">${correctCount} richtige Zahlen${bonusText}</div>
                    <div class="result-details">
                        <strong>Deine Zahlen:</strong> ${this.formatNumberDisplay(comparison.generated.numbers, comparison.generated.bonus)}<br>
                        <strong>Gewinnzahlen:</strong> ${this.formatNumberDisplay(winning.numbers, winning.bonus)}<br>
                        ${correctCount > 0 ? `<strong>Treffer:</strong> ${correctNumbers.join(', ')}` : ''}
                    </div>
                </div>
            `;
            container.innerHTML = html;
        }
    }

    formatNumberDisplay(numbers, bonus) {
        return numbers.join(', ') + ' + ' + bonus;
    }

    showResult(type, message) {
        const container = document.getElementById('resultContainer');
        
        if (type === 'error') {
            container.innerHTML = `<div class="error-message">${message}</div>`;
        }
    }
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    new LottoGenerator();
});
