class GoGame {
    constructor() {
        this.boardSize = 19;
        this.komi = 6.5;
        this.currentPlayer = 'black'; // 'black' ou 'white'
        this.board = [];
        this.moveHistory = [];
        this.prisoners = { black: 0, white: 0 };
        this.consecutivePasses = 0;
        this.gameEnded = false;
        this.koPosition = null;
        this.scoringMode = false;
        this.deadStones = new Set();
        this.territoryMarks = [];

        this.initializeDOM();
        this.setupEventListeners();
        this.initializeBoard();
        this.createBoard();
        this.updateDisplay();
    }

    initializeDOM() {
        // Éléments du plateau
        this.boardElement = document.getElementById('goBoard');
        this.coordinatesTop = document.getElementById('coordinates-top');
        this.coordinatesLeft = document.getElementById('coordinates-left');
        
        // Éléments d'état
        this.currentPlayerEl = document.getElementById('currentPlayer');
        this.moveCountEl = document.getElementById('moveCount');
        this.prisonersEl = document.getElementById('prisoners');
        this.komiEl = document.getElementById('komi');
        this.currentPlayerStone = document.getElementById('currentPlayerStone');
        this.lastMoveText = document.getElementById('lastMoveText');
        
        // Score
        this.blackTerritoryEl = document.getElementById('blackTerritory');
        this.blackPrisonersEl = document.getElementById('blackPrisoners');
        this.blackTotalEl = document.getElementById('blackTotal');
        this.whiteTerritoryEl = document.getElementById('whiteTerritory');
        this.whitePrisonersEl = document.getElementById('whitePrisoners');
        this.whiteKomiEl = document.getElementById('whiteKomi');
        this.whiteTotalEl = document.getElementById('whiteTotal');
        
        // Boutons
        this.passBtn = document.getElementById('passBtn');
        this.resignBtn = document.getElementById('resignBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.scoreBtn = document.getElementById('scoreBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.loadBtn = document.getElementById('loadBtn');
        this.exportBtn = document.getElementById('exportBtn');
        
        // Paramètres
        this.boardSizeSelect = document.getElementById('boardSize');
        this.komiInput = document.getElementById('komiValue');
        this.showCoordsCheckbox = document.getElementById('showCoords');
        this.showLastMoveCheckbox = document.getElementById('showLastMove');
        
        // Historique
        this.historyList = document.getElementById('historyList');
        this.historyFirst = document.getElementById('historyFirst');
        this.historyPrev = document.getElementById('historyPrev');
        this.historyNext = document.getElementById('historyNext');
        this.historyLast = document.getElementById('historyLast');
        
        // Modals
        this.gameOverModal = document.getElementById('gameOverModal');
        this.gameOverTitle = document.getElementById('gameOverTitle');
        this.finalScore = document.getElementById('finalScore');
        this.reviewBtn = document.getElementById('reviewBtn');
        this.newGameFromModalBtn = document.getElementById('newGameFromModalBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        
        this.scoringModal = document.getElementById('scoringModal');
        this.territoryScore = document.getElementById('territoryScore');
        this.finishScoringBtn = document.getElementById('finishScoringBtn');
        this.cancelScoringBtn = document.getElementById('cancelScoringBtn');
        
        this.messageEl = document.getElementById('message');
    }

    setupEventListeners() {
        // Boutons de jeu
        this.passBtn.addEventListener('click', () => this.pass());
        this.resignBtn.addEventListener('click', () => this.resign());
        this.undoBtn.addEventListener('click', () => this.undo());
        this.scoreBtn.addEventListener('click', () => this.startScoring());
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.saveBtn.addEventListener('click', () => this.saveGame());
        this.loadBtn.addEventListener('click', () => this.loadGame());
        this.exportBtn.addEventListener('click', () => this.exportSGF());
        
        // Paramètres
        this.boardSizeSelect.addEventListener('change', (e) => this.changeBoardSize(parseInt(e.target.value)));
        this.komiInput.addEventListener('change', (e) => this.changeKomi(parseFloat(e.target.value)));
        this.showCoordsCheckbox.addEventListener('change', (e) => this.toggleCoordinates(e.target.checked));
        this.showLastMoveCheckbox.addEventListener('change', (e) => this.toggleLastMoveMarker(e.target.checked));
        
        // Historique
        this.historyFirst.addEventListener('click', () => this.goToMove(0));
        this.historyPrev.addEventListener('click', () => this.goToMove(Math.max(0, this.moveHistory.length - 1)));
        this.historyNext.addEventListener('click', () => this.goToMove(this.moveHistory.length));
        this.historyLast.addEventListener('click', () => this.goToMove(this.moveHistory.length));
        
        // Modals
        this.reviewBtn.addEventListener('click', () => this.reviewGame());
        this.newGameFromModalBtn.addEventListener('click', () => this.newGame());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.finishScoringBtn.addEventListener('click', () => this.finishScoring());
        this.cancelScoringBtn.addEventListener('click', () => this.cancelScoring());
    }

    initializeBoard() {
        this.board = Array(this.boardSize).fill().map(() => 
            Array(this.boardSize).fill(null)
        );
    }

    createBoard() {
        this.createCoordinates();
        this.createBoardGrid();
    }

    createCoordinates() {
        // Coordonnées du haut (A-T sans I)
        this.coordinatesTop.innerHTML = '';
        this.coordinatesTop.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        
        const letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'; // Sans I
        for (let i = 0; i < this.boardSize; i++) {
            const coord = document.createElement('div');
            coord.className = 'coord';
            coord.textContent = letters[i];
            this.coordinatesTop.appendChild(coord);
        }
        
        // Coordonnées de gauche (1-19)
        this.coordinatesLeft.innerHTML = '';
        this.coordinatesLeft.style.gridTemplateRows = `repeat(${this.boardSize}, 1fr)`;
        
        for (let i = this.boardSize; i >= 1; i--) {
            const coord = document.createElement('div');
            coord.className = 'coord';
            coord.textContent = i.toString();
            this.coordinatesLeft.appendChild(coord);
        }
    }

    createBoardGrid() {
        this.boardElement.innerHTML = '';
        
        // Calculer la taille du plateau
        const boardSize = Math.min(600, window.innerWidth - 100);
        this.boardElement.style.width = `${boardSize}px`;
        this.boardElement.style.height = `${boardSize}px`;
        this.boardElement.style.position = 'relative';
        
        // Créer les lignes du plateau
        this.createBoardLines();
        
        // Créer la grille d'intersections
        const gridContainer = document.createElement('div');
        gridContainer.className = 'board-grid';
        gridContainer.style.position = 'absolute';
        gridContainer.style.top = '0';
        gridContainer.style.left = '0';
        gridContainer.style.width = '100%';
        gridContainer.style.height = '100%';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${this.boardSize}, 1fr)`;
        gridContainer.style.gap = '0';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const intersection = document.createElement('div');
                intersection.className = 'intersection';
                intersection.dataset.row = row;
                intersection.dataset.col = col;
                intersection.style.position = 'relative';
                intersection.style.display = 'flex';
                intersection.style.alignItems = 'center';
                intersection.style.justifyContent = 'center';
                intersection.style.cursor = 'pointer';
                
                // Marquer les points d'étoile (hoshi)
                if (this.isStarPoint(row, col)) {
                    intersection.classList.add('star-point');
                    const starDot = document.createElement('div');
                    starDot.style.width = '6px';
                    starDot.style.height = '6px';
                    starDot.style.backgroundColor = '#8B4513';
                    starDot.style.borderRadius = '50%';
                    starDot.style.position = 'absolute';
                    starDot.style.zIndex = '1';
                    intersection.appendChild(starDot);
                }
                
                intersection.addEventListener('click', (e) => this.handleIntersectionClick(e));
                gridContainer.appendChild(intersection);
            }
        }
        
        this.boardElement.appendChild(gridContainer);
    }

    createBoardLines() {
        const linesContainer = document.createElement('div');
        linesContainer.className = 'board-lines';
        linesContainer.style.position = 'absolute';
        linesContainer.style.top = '0';
        linesContainer.style.left = '0';
        linesContainer.style.width = '100%';
        linesContainer.style.height = '100%';
        linesContainer.style.pointerEvents = 'none';
        linesContainer.style.zIndex = '0';
        
        const cellSize = 100 / this.boardSize;
        
        // Lignes horizontales
        for (let i = 0; i < this.boardSize; i++) {
            const line = document.createElement('div');
            line.className = 'board-line horizontal';
            line.style.position = 'absolute';
            line.style.height = '1px';
            line.style.backgroundColor = '#8B4513';
            line.style.left = `${cellSize / 2}%`;
            line.style.right = `${cellSize / 2}%`;
            line.style.top = `${i * cellSize + cellSize / 2}%`;
            linesContainer.appendChild(line);
        }
        
        // Lignes verticales
        for (let i = 0; i < this.boardSize; i++) {
            const line = document.createElement('div');
            line.className = 'board-line vertical';
            line.style.position = 'absolute';
            line.style.width = '1px';
            line.style.backgroundColor = '#8B4513';
            line.style.top = `${cellSize / 2}%`;
            line.style.bottom = `${cellSize / 2}%`;
            line.style.left = `${i * cellSize + cellSize / 2}%`;
            linesContainer.appendChild(line);
        }
        
        this.boardElement.appendChild(linesContainer);
    }

    isStarPoint(row, col) {
        const starPoints = {
            9: [[2,2], [2,6], [6,2], [6,6], [4,4]],
            13: [[3,3], [3,9], [9,3], [9,9], [6,6]],
            19: [[3,3], [3,9], [3,15], [9,3], [9,9], [9,15], [15,3], [15,9], [15,15]]
        };
        
        const points = starPoints[this.boardSize] || [];
        return points.some(point => point[0] === row && point[1] === col);
    }

    handleIntersectionClick(event) {
        if (this.gameEnded) return;
        
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        
        if (this.scoringMode) {
            this.handleScoringClick(row, col);
        } else {
            this.playMove(row, col);
        }
    }

    playMove(row, col) {
        // Vérifier si l'intersection est libre
        if (this.board[row][col] !== null) {
            this.showMessage('Cette intersection est déjà occupée', 'error');
            return;
        }
        
        // Créer une copie du plateau pour tester le coup
        const testBoard = this.deepCopyBoard();
        testBoard[row][col] = this.currentPlayer;
        
        // Capturer les groupes adverses
        const capturedStones = this.captureGroups(testBoard, row, col);
        
        // Vérifier le suicide (si le groupe n'a pas de libertés après placement)
        if (!capturedStones.length && this.getLibertiesCount(testBoard, row, col) === 0) {
            this.showMessage('Coup suicide interdit', 'error');
            return;
        }
        
        // Vérifier la règle du Ko
        const boardString = this.boardToString(testBoard);
        if (this.koPosition === boardString) {
            this.showMessage('Règle du Ko : coup interdit', 'error');
            return;
        }
        
        // Coup valide - l'exécuter
        this.executeMove(row, col, capturedStones);
    }

    executeMove(row, col, capturedStones = null) {
        // Sauvegarder l'état pour le Ko
        const previousBoardString = this.boardToString(this.board);
        
        // Placer la pierre
        this.board[row][col] = this.currentPlayer;
        
        // Calculer les captures si pas déjà fait
        if (capturedStones === null) {
            capturedStones = this.captureGroups(this.board, row, col);
        }
        
        // Supprimer les pierres capturées
        capturedStones.forEach(pos => {
            this.board[pos.row][pos.col] = null;
            this.prisoners[this.currentPlayer]++;
        });
        
        // Enregistrer le coup dans l'historique
        const move = {
            player: this.currentPlayer,
            row: row,
            col: col,
            captured: capturedStones.length,
            boardState: this.deepCopyBoard()
        };
        this.moveHistory.push(move);
        
        // Mettre à jour le Ko
        this.koPosition = capturedStones.length === 1 ? previousBoardString : null;
        
        // Réinitialiser les passes consécutives
        this.consecutivePasses = 0;
        
        // Changer de joueur
        this.switchPlayer();
        
        // Mettre à jour l'affichage
        this.updateBoardDisplay();
        this.updateDisplay();
        
        this.showMessage(`${this.getPlayerName(move.player)} joue ${this.coordsToString(row, col)}`, 'info');
    }

    captureGroups(board, row, col) {
        const currentPlayer = board[row][col];
        const opponent = currentPlayer === 'black' ? 'white' : 'black';
        const captured = [];
        
        // Vérifier les groupes adverses adjacents
        const directions = [[0,1], [1,0], [0,-1], [-1,0]];
        
        directions.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol) && 
                board[newRow][newCol] === opponent) {
                
                const group = this.getGroup(board, newRow, newCol);
                if (this.getGroupLibertiesCount(board, group) === 0) {
                    captured.push(...group);
                }
            }
        });
        
        return captured;
    }

    getGroup(board, startRow, startCol) {
        const color = board[startRow][startCol];
        if (color === null) return [];
        
        const group = [];
        const visited = new Set();
        const stack = [{row: startRow, col: startCol}];
        
        while (stack.length > 0) {
            const {row, col} = stack.pop();
            const key = `${row},${col}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (board[row][col] === color) {
                group.push({row, col});
                
                // Ajouter les voisins
                const directions = [[0,1], [1,0], [0,-1], [-1,0]];
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (this.isValidPosition(newRow, newCol)) {
                        stack.push({row: newRow, col: newCol});
                    }
                });
            }
        }
        
        return group;
    }

    getLibertiesCount(board, row, col) {
        const group = this.getGroup(board, row, col);
        return this.getGroupLibertiesCount(board, group);
    }

    getGroupLibertiesCount(board, group) {
        const liberties = new Set();
        
        group.forEach(({row, col}) => {
            const directions = [[0,1], [1,0], [0,-1], [-1,0]];
            directions.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isValidPosition(newRow, newCol) && 
                    board[newRow][newCol] === null) {
                    liberties.add(`${newRow},${newCol}`);
                }
            });
        });
        
        return liberties.size;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
    }

    pass() {
        if (this.gameEnded) return;
        
        this.consecutivePasses++;
        
        const move = {
            player: this.currentPlayer,
            row: -1,
            col: -1,
            captured: 0,
            pass: true,
            boardState: this.deepCopyBoard()
        };
        this.moveHistory.push(move);
        
        this.showMessage(`${this.getPlayerName(this.currentPlayer)} passe`, 'info');
        
        if (this.consecutivePasses >= 2) {
            this.endGame();
        } else {
            this.switchPlayer();
            this.updateDisplay();
        }
    }

    resign() {
        if (this.gameEnded) return;
        
        const winner = this.currentPlayer === 'black' ? 'white' : 'black';
        this.endGame(winner, 'resign');
    }

    undo() {
        if (this.moveHistory.length === 0 || this.gameEnded) return;
        
        // Supprimer le dernier coup
        this.moveHistory.pop();
        
        // Restaurer l'état précédent
        if (this.moveHistory.length > 0) {
            const lastMove = this.moveHistory[this.moveHistory.length - 1];
            this.board = this.deepCopyBoard(lastMove.boardState);
            this.currentPlayer = lastMove.player === 'black' ? 'white' : 'black';
        } else {
            this.initializeBoard();
            this.currentPlayer = 'black';
        }
        
        // Recalculer les prisonniers
        this.recalculatePrisoners();
        
        this.updateBoardDisplay();
        this.updateDisplay();
        this.showMessage('Coup annulé', 'info');
    }

    recalculatePrisoners() {
        this.prisoners = { black: 0, white: 0 };
        
        this.moveHistory.forEach(move => {
            if (move.captured > 0) {
                this.prisoners[move.player] += move.captured;
            }
        });
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
    }

    startScoring() {
        this.scoringMode = true;
        this.deadStones.clear();
        this.showMessage('Mode comptage : cliquez sur les pierres mortes', 'info');
        this.scoringModal.classList.add('show');
        this.calculateTerritoryScore();
    }

    handleScoringClick(row, col) {
        const stone = this.board[row][col];
        if (stone === null) return;
        
        const key = `${row},${col}`;
        if (this.deadStones.has(key)) {
            this.deadStones.delete(key);
        } else {
            this.deadStones.add(key);
        }
        
        this.updateBoardDisplay();
        this.calculateTerritoryScore();
    }

    calculateTerritoryScore() {
        const territory = { black: 0, white: 0 };
        const visited = new Set();
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const key = `${row},${col}`;
                if (this.board[row][col] === null && !visited.has(key)) {
                    const emptyGroup = this.getEmptyTerritory(row, col, visited);
                    const owner = this.getTerritoryOwner(emptyGroup);
                    if (owner) {
                        territory[owner] += emptyGroup.length;
                    }
                }
            }
        }
        
        // Ajouter les pierres mortes
        this.deadStones.forEach(key => {
            const [row, col] = key.split(',').map(Number);
            const deadColor = this.board[row][col];
            const captureColor = deadColor === 'black' ? 'white' : 'black';
            territory[captureColor]++;
        });
        
        const blackTotal = territory.black + this.prisoners.black;
        const whiteTotal = territory.white + this.prisoners.white + this.komi;
        
        this.territoryScore.innerHTML = `
            <div class="score-comparison">
                <div class="player-final-score black">
                    <h3>Noir</h3>
                    <p>Territoire: ${territory.black}</p>
                    <p>Prisonniers: ${this.prisoners.black}</p>
                    <p><strong>Total: ${blackTotal}</strong></p>
                </div>
                <div class="player-final-score white">
                    <h3>Blanc</h3>
                    <p>Territoire: ${territory.white}</p>
                    <p>Prisonniers: ${this.prisoners.white}</p>
                    <p>Komi: ${this.komi}</p>
                    <p><strong>Total: ${whiteTotal}</strong></p>
                </div>
            </div>
        `;
    }

    getEmptyTerritory(startRow, startCol, visited) {
        const territory = [];
        const stack = [{row: startRow, col: startCol}];
        
        while (stack.length > 0) {
            const {row, col} = stack.pop();
            const key = `${row},${col}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (this.board[row][col] === null) {
                territory.push({row, col});
                
                const directions = [[0,1], [1,0], [0,-1], [-1,0]];
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (this.isValidPosition(newRow, newCol)) {
                        stack.push({row: newRow, col: newCol});
                    }
                });
            }
        }
        
        return territory;
    }

    getTerritoryOwner(territory) {
        const surroundingColors = new Set();
        
        territory.forEach(({row, col}) => {
            const directions = [[0,1], [1,0], [0,-1], [-1,0]];
            directions.forEach(([dr, dc]) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (this.isValidPosition(newRow, newCol)) {
                    const stone = this.board[newRow][newCol];
                    if (stone !== null) {
                        surroundingColors.add(stone);
                    }
                }
            });
        });
        
        // Le territoire appartient à un joueur si seules ses pierres l'entourent
        if (surroundingColors.size === 1) {
            return Array.from(surroundingColors)[0];
        }
        
        return null; // Territoire neutre
    }

    finishScoring() {
        this.scoringMode = false;
        this.scoringModal.classList.remove('show');
        
        // Calculer le score final
        const territory = { black: 0, white: 0 };
        const visited = new Set();
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const key = `${row},${col}`;
                if (this.board[row][col] === null && !visited.has(key)) {
                    const emptyGroup = this.getEmptyTerritory(row, col, visited);
                    const owner = this.getTerritoryOwner(emptyGroup);
                    if (owner) {
                        territory[owner] += emptyGroup.length;
                    }
                }
            }
        }
        
        // Ajouter les pierres mortes aux prisonniers
        const deadPrisoners = { black: 0, white: 0 };
        this.deadStones.forEach(key => {
            const [row, col] = key.split(',').map(Number);
            const deadColor = this.board[row][col];
            const captureColor = deadColor === 'black' ? 'white' : 'black';
            deadPrisoners[captureColor]++;
        });
        
        const blackTotal = territory.black + this.prisoners.black + deadPrisoners.black;
        const whiteTotal = territory.white + this.prisoners.white + deadPrisoners.white + this.komi;
        
        const winner = blackTotal > whiteTotal ? 'black' : 'white';
        const margin = Math.abs(blackTotal - whiteTotal);
        
        this.endGame(winner, 'scoring', { blackTotal, whiteTotal, margin, territory, deadPrisoners });
    }

    cancelScoring() {
        this.scoringMode = false;
        this.scoringModal.classList.remove('show');
        this.deadStones.clear();
        this.updateBoardDisplay();
    }

    endGame(winner = null, reason = 'scoring', scoreData = null) {
        this.gameEnded = true;
        
        if (reason === 'resign') {
            this.gameOverTitle.textContent = `${this.getPlayerName(winner)} gagne par abandon`;
            this.finalScore.innerHTML = `<p>${this.getPlayerName(this.currentPlayer)} a abandonné.</p>`;
        } else if (reason === 'scoring' && scoreData) {
            this.gameOverTitle.textContent = `${this.getPlayerName(winner)} gagne !`;
            this.finalScore.innerHTML = `
                <div class="score-comparison">
                    <div class="player-final-score black ${winner === 'black' ? 'winner' : ''}">
                        <h3>Noir</h3>
                        <p>Territoire: ${scoreData.territory.black}</p>
                        <p>Prisonniers: ${this.prisoners.black + scoreData.deadPrisoners.black}</p>
                        <p><strong>Total: ${scoreData.blackTotal}</strong></p>
                    </div>
                    <div class="player-final-score white ${winner === 'white' ? 'winner' : ''}">
                        <h3>Blanc</h3>
                        <p>Territoire: ${scoreData.territory.white}</p>
                        <p>Prisonniers: ${this.prisoners.white + scoreData.deadPrisoners.white}</p>
                        <p>Komi: ${this.komi}</p>
                        <p><strong>Total: ${scoreData.whiteTotal}</strong></p>
                    </div>
                </div>
                <p><strong>Marge de victoire: ${scoreData.margin} points</strong></p>
            `;
        } else {
            // Fin par deux passes
            this.startScoring();
            return;
        }
        
        this.gameOverModal.classList.add('show');
        this.updateDisplay();
    }

    newGame() {
        this.currentPlayer = 'black';
        this.moveHistory = [];
        this.prisoners = { black: 0, white: 0 };
        this.consecutivePasses = 0;
        this.gameEnded = false;
        this.koPosition = null;
        this.scoringMode = false;
        this.deadStones.clear();
        
        this.initializeBoard();
        this.updateBoardDisplay();
        this.updateDisplay();
        this.closeModal();
        
        this.showMessage('Nouvelle partie commencée', 'success');
    }

    changeBoardSize(size) {
        this.boardSize = size;
        this.newGame();
        this.createBoard();
    }

    changeKomi(komi) {
        this.komi = komi;
        this.komiEl.textContent = komi;
        this.whiteKomiEl.textContent = komi;
        this.updateDisplay();
    }

    toggleCoordinates(show) {
        this.coordinatesTop.style.display = show ? 'grid' : 'none';
        this.coordinatesLeft.style.display = show ? 'grid' : 'none';
    }

    toggleLastMoveMarker(show) {
        this.updateBoardDisplay();
    }

    updateBoardDisplay() {
        const gridContainer = this.boardElement.querySelector('.board-grid');
        if (!gridContainer) return;
        
        const intersections = gridContainer.querySelectorAll('.intersection');
        
        intersections.forEach((intersection, index) => {
            const row = Math.floor(index / this.boardSize);
            const col = index % this.boardSize;
            const stone = this.board[row][col];
            
            // Nettoyer l'intersection (garder seulement les points d'étoile)
            const existingStone = intersection.querySelector('.stone');
            if (existingStone) {
                existingStone.remove();
            }
            
            // Réinitialiser les classes
            intersection.className = 'intersection';
            if (this.isStarPoint(row, col)) {
                intersection.classList.add('star-point');
            }
            
            if (stone !== null) {
                intersection.classList.add('has-stone');
                const stoneElement = document.createElement('div');
                stoneElement.className = `stone ${stone}-stone`;
                stoneElement.style.width = '80%';
                stoneElement.style.height = '80%';
                stoneElement.style.borderRadius = '50%';
                stoneElement.style.position = 'relative';
                stoneElement.style.zIndex = '3';
                stoneElement.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.3)';
                
                if (stone === 'black') {
                    stoneElement.style.background = 'radial-gradient(circle at 30% 30%, #555, #000)';
                    stoneElement.style.border = '2px solid #333';
                } else {
                    stoneElement.style.background = 'radial-gradient(circle at 30% 30%, #fff, #ddd)';
                    stoneElement.style.border = '2px solid #999';
                }
                
                // Marquer la dernière pierre jouée
                if (this.showLastMoveCheckbox.checked && this.moveHistory.length > 0) {
                    const lastMove = this.moveHistory[this.moveHistory.length - 1];
                    if (lastMove.row === row && lastMove.col === col && !lastMove.pass) {
                        stoneElement.classList.add('last-move');
                        const marker = document.createElement('div');
                        marker.style.position = 'absolute';
                        marker.style.top = '50%';
                        marker.style.left = '50%';
                        marker.style.transform = 'translate(-50%, -50%)';
                        marker.style.width = '8px';
                        marker.style.height = '8px';
                        marker.style.backgroundColor = '#ff4444';
                        marker.style.borderRadius = '50%';
                        marker.style.zIndex = '4';
                        stoneElement.appendChild(marker);
                    }
                }
                
                // Marquer les pierres mortes en mode comptage
                if (this.scoringMode && this.deadStones.has(`${row},${col}`)) {
                    intersection.classList.add('dead-stone');
                    stoneElement.style.opacity = '0.5';
                    stoneElement.style.filter = 'grayscale(50%)';
                }
                
                // Animation de placement
                stoneElement.style.animation = 'placeStone 0.3s ease';
                
                intersection.appendChild(stoneElement);
            }
        });
    }

    updateDisplay() {
        // État du jeu
        this.currentPlayerEl.textContent = this.getPlayerName(this.currentPlayer);
        this.moveCountEl.textContent = this.moveHistory.length;
        this.prisonersEl.textContent = `N:${this.prisoners.black} B:${this.prisoners.white}`;
        this.komiEl.textContent = this.komi;
        
        // Pierre du joueur actuel
        this.currentPlayerStone.className = `stone ${this.currentPlayer}-stone`;
        
        // Dernier coup
        if (this.moveHistory.length > 0) {
            const lastMove = this.moveHistory[this.moveHistory.length - 1];
            if (lastMove.pass) {
                this.lastMoveText.textContent = `${this.getPlayerName(lastMove.player)} a passé`;
            } else {
                this.lastMoveText.textContent = `Dernier coup: ${this.getPlayerName(lastMove.player)} ${this.coordsToString(lastMove.row, lastMove.col)}`;
            }
        } else {
            this.lastMoveText.textContent = 'Noir commence';
        }
        
        // Score
        this.blackPrisonersEl.textContent = this.prisoners.black;
        this.blackTotalEl.textContent = this.prisoners.black;
        this.whitePrisonersEl.textContent = this.prisoners.white;
        this.whiteKomiEl.textContent = this.komi;
        this.whiteTotalEl.textContent = this.prisoners.white + this.komi;
        
        // Boutons
        this.undoBtn.disabled = this.moveHistory.length === 0 || this.gameEnded;
        this.passBtn.disabled = this.gameEnded;
        this.resignBtn.disabled = this.gameEnded;
        this.scoreBtn.disabled = this.gameEnded;
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyList.innerHTML = '';
        
        this.moveHistory.forEach((move, index) => {
            const item = document.createElement('div');
            item.className = `history-item ${move.player}`;
            
            let moveText = `${index + 1}. ${this.getPlayerName(move.player)} `;
            if (move.pass) {
                moveText += 'passe';
            } else {
                moveText += this.coordsToString(move.row, move.col);
                if (move.captured > 0) {
                    moveText += ` (${move.captured} capturé${move.captured > 1 ? 's' : ''})`;
                }
            }
            
            item.textContent = moveText;
            item.addEventListener('click', () => this.goToMove(index + 1));
            this.historyList.appendChild(item);
        });
        
        // Scroller vers le bas
        this.historyList.scrollTop = this.historyList.scrollHeight;
    }

    goToMove(moveIndex) {
        // Pour la navigation dans l'historique (fonctionnalité avancée)
        // Actuellement non implémentée
        this.showMessage('Navigation dans l\'historique bientôt disponible', 'info');
    }

    reviewGame() {
        this.closeModal();
        this.showMessage('Mode revue : utilisez l\'historique pour naviguer', 'info');
    }

    saveGame() {
        try {
            const gameData = {
                boardSize: this.boardSize,
                komi: this.komi,
                currentPlayer: this.currentPlayer,
                board: this.board,
                moveHistory: this.moveHistory,
                prisoners: this.prisoners,
                gameEnded: this.gameEnded,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('goGame', JSON.stringify(gameData));
            this.showMessage('Partie sauvegardée !', 'success');
        } catch (error) {
            this.showMessage('Erreur lors de la sauvegarde', 'error');
        }
    }

    loadGame() {
        try {
            const gameData = localStorage.getItem('goGame');
            if (!gameData) {
                this.showMessage('Aucune partie sauvegardée trouvée', 'error');
                return;
            }
            
            const data = JSON.parse(gameData);
            
            this.boardSize = data.boardSize;
            this.komi = data.komi;
            this.currentPlayer = data.currentPlayer;
            this.board = data.board;
            this.moveHistory = data.moveHistory;
            this.prisoners = data.prisoners;
            this.gameEnded = data.gameEnded;
            
            // Mettre à jour les paramètres
            this.boardSizeSelect.value = this.boardSize;
            this.komiInput.value = this.komi;
            
            this.createBoard();
            this.updateBoardDisplay();
            this.updateDisplay();
            
            this.showMessage('Partie chargée !', 'success');
        } catch (error) {
            this.showMessage('Erreur lors du chargement', 'error');
        }
    }

    exportSGF() {
        try {
            let sgf = '(;FF[4]CA[UTF-8]AP[WebGo:1.0]';
            sgf += `SZ[${this.boardSize}]`;
            sgf += `KM[${this.komi}]`;
            sgf += `RU[Chinese]`;
            sgf += `DT[${new Date().toISOString().split('T')[0]}]`;
            
            this.moveHistory.forEach((move, index) => {
                if (move.pass) {
                    sgf += `;${move.player === 'black' ? 'B' : 'W'}[]`;
                } else {
                    const col = String.fromCharCode(97 + move.col); // a-s
                    const row = String.fromCharCode(97 + move.row);
                    sgf += `;${move.player === 'black' ? 'B' : 'W'}[${col}${row}]`;
                }
            });
            
            sgf += ')';
            
            // Télécharger le fichier SGF
            const blob = new Blob([sgf], { type: 'application/x-go-sgf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `go-game-${new Date().toISOString().split('T')[0]}.sgf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showMessage('Partie exportée en SGF !', 'success');
        } catch (error) {
            this.showMessage('Erreur lors de l\'export', 'error');
        }
    }

    deepCopyBoard(board = null) {
        const sourceBoard = board || this.board;
        return sourceBoard.map(row => [...row]);
    }

    boardToString(board) {
        return board.map(row => row.map(cell => cell || '·').join('')).join('');
    }

    coordsToString(row, col) {
        const letters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ'; // Sans I
        return letters[col] + (this.boardSize - row);
    }

    getPlayerName(player) {
        return player === 'black' ? 'Noir' : 'Blanc';
    }

    showMessage(text, type = 'info') {
        this.messageEl.textContent = text;
        this.messageEl.className = `message ${type} show`;
        
        setTimeout(() => {
            this.messageEl.classList.remove('show');
        }, 3000);
    }

    closeModal() {
        this.gameOverModal.classList.remove('show');
        this.scoringModal.classList.remove('show');
    }
}

// Initialiser le jeu
document.addEventListener('DOMContentLoaded', () => {
    new GoGame();
});class GoGame {
    constructor() {
        this.boardSize = 19;
        this.komi = 6.5;
        this.currentPlayer = 'black'; // 'black' ou 'white'
        this.board = [];
        this.moveHistory = [];
        this.prisoners = { black: 0, white: 0 };
        this.consecutivePasses = 0;
        this.gameEnded = false;
        this.koPosition = null;
        this.scoringMode = false;
        this.deadStones = new Set();
        this.territoryMarks = [];

        this.initializeDOM();
        this.setupEventListeners();
        this.initializeBoard();
        this.createBoard();
        this.updateDisplay();
