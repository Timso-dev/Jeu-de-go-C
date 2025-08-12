# 🖤⚪ Jeu de Go (围棋)

Une implémentation complète du jeu de Go (Weiqi/Baduk) en JavaScript, respectant les règles traditionnelles avec interface moderne et fonctionnalités avancées.

## 🎮 Aperçu du jeu

![Jeu de Go](https://img.shields.io/badge/Game-Go%20(围棋)-brown?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**🚀 [Jouer maintenant](https://Timso-dev.github.io/jeu-de-go/)**

## 📋 Règles du Go

### 🎯 **Objectif**
Contrôler le plus de territoire possible en plaçant des pierres et en capturant celles de l'adversaire.

### 🎮 **Règles fondamentales**

#### **🪨 Placement des pierres**
- **Noir** commence toujours
- Une pierre par tour sur une intersection libre
- Les pierres ne bougent jamais une fois posées

#### **⚡ Liberté et capture**
- **Liberté** : intersections vides adjacentes à une pierre/groupe
- **Capture** : un groupe sans liberté est retiré du plateau
- Les pierres capturées deviennent des prisonniers

#### **🚫 Règles spéciales**
- **Ko** : Interdit de recréer immédiatement la position précédente
- **Suicide** : Généralement interdit (placer sans liberté)
- **Passer** : Possible à tout moment

#### **🏁 Fin de partie**
- **Deux passes consécutives** → Comptage du territoire
- **Abandon** possible à tout moment

#### **🧮 Comptage**
- **Territoire** : intersections vides contrôlées
- **Prisonniers** : pierres capturées
- **Komi** : bonus de 6.5 points pour Blanc (compense l'avantage du premier coup)
- **Score = Territoire + Prisonniers + Komi (Blanc uniquement)**

## ✨ Fonctionnalités

### 🎲 **Tailles de plateau**
- **9×9** : Parfait pour débuter (parties rapides)
- **13×13** : Niveau intermédiaire
- **19×19** : Standard professionnel

### 🎨 **Interface moderne**
- **Design authentique** avec plateau en bois et pierres réalistes
- **Points d'étoile (Hoshi)** traditionnels
- **Coordonnées** A-T / 1-19 (sans I)
- **Marquage du dernier coup** avec point rouge
- **Animations fluides** pour placement et captures

### 🧠 **Règles authentiques**
- **Détection automatique** des captures
- **Règle du Ko** implémentée
- **Prévention du suicide**
- **Comptage de territoire** intelligent
- **Gestion des groupes** et libertés

### 💾 **Fonctionnalités avancées**
- **Sauvegarde/Chargement** local
- **Export SGF** (format standard du Go)
- **Historique complet** des coups
- **Mode comptage** interactif
- **Paramètres personnalisables** (Komi, affichage)

## 🏗️ Structure du projet

```
jeu-de-go/
├── index.html          # Interface utilisateur complète
├── style.css           # Design authentique et responsive
├── script.js           # Logique de jeu et règles
└── README.md           # Documentation
```

## 🛠️ Technologies utilisées

- **HTML5** : Structure sémantique et accessibilité
- **CSS3** : Grid layout, animations, design authentique
- **JavaScript ES6+** : Algorithmes de Go, gestion d'état
- **LocalStorage** : Sauvegarde des parties
- **Format SGF** : Export professionnel des parties
- **GitHub Pages** : Hébergement gratuit

## 🚀 Installation et déploiement

### **Déploiement GitHub Pages**

1. **Créer un dépôt**
   ```bash
   # Sur GitHub, créez un dépôt nommé "jeu-de-go"
   ```

2. **Ajouter les fichiers**
   ```bash
   git clone https://github.com/Timso-dev/jeu-de-go.git
   cd jeu-de-go
   
   # Ajoutez les 3 fichiers : index.html, style.css, script.js
   git add .
   git commit -m "Ajout du jeu de Go"
   git push origin main
   ```

3. **Activer GitHub Pages**
   - Settings → Pages
   - Source : "Deploy from a branch"
   - Branch : `main` → `/ (root)`

4. **Jouer**
   - `https://Timso-dev.github.io/jeu-de-go/`

### **Test local**
```bash
git clone https://github.com/Timso-dev/jeu-de-go.git
cd jeu-de-go

# Serveur local optionnel
python -m http.server 8000
# Ou ouvrir index.html directement
```

## 🎯 Architecture technique

### **Classe principale : GoGame**

```javascript
class GoGame {
    constructor() {
        this.boardSize = 19;           // Taille du plateau
        this.board = [];               // État du plateau
        this.currentPlayer = 'black';  // Joueur actuel
        this.moveHistory = [];         // Historique complet
        this.prisoners = {};           // Pierres capturées
        this.koPosition = null;        // Position Ko interdite
    }
}
```

### **Algorithmes clés**

#### **Détection des groupes**
```javascript
getGroup(board, startRow, startCol) {
    // Parcours en profondeur pour identifier un groupe connexe
    const group = [];
    const visited = new Set();
    const stack = [{row: startRow, col: startCol}];
    
    while (stack.length > 0) {
        // Explorer les pierres de même couleur adjacentes
        const {row, col} = stack.pop();
        // ... logique de groupe
    }
    
    return group;
}
```

#### **Calcul des libertés**
```javascript
getGroupLibertiesCount(board, group) {
    const liberties = new Set();
    
    group.forEach(({row, col}) => {
        // Compter les intersections vides adjacentes
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
```

#### **Système de capture**
```javascript
captureGroups(board, row, col) {
    const captured = [];
    const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
    
    // Vérifier chaque groupe adverse adjacent
    const directions = [[0,1], [1,0], [0,-1], [-1,0]];
    directions.forEach(([dr, dc]) => {
        const adjacentGroup = this.getGroup(board, row + dr, col + dc);
        if (adjacentGroup.length > 0 && 
            this.getGroupLibertiesCount(board, adjacentGroup) === 0) {
            captured.push(...adjacentGroup);
        }
    });
    
    return captured;
}
```

#### **Règle du Ko**
```javascript
// Empêche la répétition immédiate de position
const boardString = this.boardToString(testBoard);
if (this.koPosition === boardString) {
    this.showMessage('Règle du Ko : coup interdit', 'error');
    return;
}
```

### **Comptage de territoire**

```javascript
calculateTerritoryScore() {
    const territory = { black: 0, white: 0 };
    const visited = new Set();
    
    // Identifier chaque région vide
    for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
            if (this.board[row][col] === null && !visited.has(`${row},${col}`)) {
                const emptyRegion = this.getEmptyTerritory(row, col, visited);
                const owner = this.getTerritoryOwner(emptyRegion);
                if (owner) {
                    territory[owner] += emptyRegion.length;
                }
            }
        }
    }
    
    return territory;
}
```

## 🎨 Design et expérience utilisateur

### **Esthétique traditionnelle**
- **Plateau en bois** : Dégradé brun authentique
- **Pierres réalistes** : Effet 3D avec ombres radiales
- **Points Hoshi** : Marqueurs traditionnels selon la taille
- **Coordonnées** : Système standard A-T / 1-19

### **Feedback visuel**
- **Dernier coup** : Point rouge sur la dernière pierre
- **Survol** : Prévisualisation de placement
- **Captures** : Animation de disparition
- **Territoire** : Zones colorées en mode comptage
- **Pierres mortes** : Affichage semi-transparent

### **Interface responsive**
- **Desktop** : Panneau latéral avec plateau principal
- **Tablet** : Réorganisation en colonne
- **Mobile** : Interface optimisée tactile

## 📊 Fonctionnalités avancées

### **Format SGF (Smart Game Format)**
```javascript
exportSGF() {
    let sgf = '(;FF[4]CA[UTF-8]AP[WebGo:1.0]';
    sgf += `SZ[${this.boardSize}]KM[${this.komi}]`;
    
    this.moveHistory.forEach(move => {
        if (move.pass) {
            sgf += `;${move.player === 'black' ? 'B' : 'W'}[]`;
        } else {
            const coords = this.moveToSGF(move.row, move.col);
            sgf += `;${move.player === 'black' ? 'B' : 'W'}[${coords}]`;
        }
    });
    
    sgf += ')';
    return sgf;
}
```

### **Sauvegarde intelligente**
```javascript
saveGame() {
    const gameData = {
        boardSize: this.boardSize,
        board: this.board,
        moveHistory: this.moveHistory,
        currentPlayer: this.currentPlayer,
        prisoners: this.prisoners,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('goGame', JSON.stringify(gameData));
}
```

### **Mode comptage interactif**
- Clic sur pierres mortes pour les marquer
- Calcul automatique du territoire
- Affichage des scores partiels
- Validation finale avec totaux

## 🎓 Valeur pédagogique

### **Concepts algorithmiques**
- **Parcours de graphe** (DFS pour groupes)
- **Détection de cycles** (règle du Ko)
- **Analyse de connectivité** (libertés)
- **Optimisation mémoire** (représentation plateau)

### **Programmation orientée objet**
- **Encapsulation** des règles du jeu
- **Modularité** des fonctions
- **Gestion d'état** complexe
- **Patterns de conception**

### **Interface utilisateur**
- **Manipulation DOM** avancée
- **Gestion d'événements** complexes
- **Animations CSS** fluides
- **Design responsive** multi-device

## 🔧 Personnalisation

### **Modifier les règles**
```javascript
// Autoriser le suicide
isValidMove(row, col) {
    // Supprimer la vérification du suicide
    return this.board[row][col] === null;
}

// Changer le Komi par défaut
constructor() {
    this.komi = 7.5; // Komi alternatif
}
```

### **Ajouter de nouvelles tailles**
```javascript
// Dans le HTML
<option value="15">15×15 (Personnalisé)</option>

// Points d'étoile personnalisés
const starPoints = {
    15: [[3,3], [3,11], [11,3], [11,11], [7,7]]
};
```

### **Thèmes visuels**
```css
/* Thème moderne */
.go-board {
    background: linear-gradient(45deg, #2c3e50, #34495e);
    border: 3px solid #1abc9c;
}

.stone.black-stone {
    background: radial-gradient(circle at 30% 30%, #444, #000);
}
```

## 🚀 Améliorations futures

### **Version 2.0 - IA et analyse**
- [ ] **Intelligence artificielle** basique (algorithme Monte Carlo)
- [ ] **Niveaux de difficulté** progressifs
- [ ] **Suggestions de coups** pour débutants
- [ ] **Analyse de position** (influence, territoire)

### **Version 2.1 - Multijoueur**
- [ ] **Parties en ligne** (WebSockets)
- [ ] **Salles de jeu** privées/publiques
- [ ] **Chat intégré** pendant les parties
- [ ] **Système de classement** ELO

### **Version 2.2 - Fonctionnalités pro**
- [ ] **Base de données** de parties célèbres
- [ ] **Mode analyse** avec variations
- [ ] **Problèmes de Go** (tsumego)
- [ ] **Statistiques avancées** de jeu

### **Version 2.3 - Enseignement**
- [ ] **Tutoriel interactif** pour débutants
- [ ] **Mode entraînement** avec feedback
- [ ] **Bibliothèque d'ouvertures** (joseki)
- [ ] **Vidéos explicatives** intégrées

## 📱 Compatibilité

### **Navigateurs supportés**
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile Safari iOS 12+
- ✅ Chrome Android 70+

### **Fonctionnalités requises**
- JavaScript ES6+ (classes, destructuring)
- CSS Grid et Flexbox
- LocalStorage API
- File API (export SGF)

## 🤝 Contributions

### **Comment contribuer**
1. **Fork** le projet
2. **Créer** une branche (`git checkout -b feature/amelioration`)
3. **Commiter** (`git commit -m 'Ajout fonctionnalité X'`)
4. **Pousser** (`git push origin feature/amelioration`)
5. **Pull Request**

### **Types de contributions bienvenues**
- 🐛 **Corrections de bugs** dans les règles
- ✨ **Nouvelles fonctionnalités** (IA, multijoueur)
- 📚 **Amélioration documentation**
- 🎨 **Design et UX** améliorés
- ⚡ **Optimisations** performance
- 🌍 **Traductions** autres langues

### **Standards de développement**
- Code ES6+ moderne et commenté
- Tests unitaires pour règles critiques
- Documentation JSDoc des fonctions
- Respect des conventions de nommage
- Pull requests avec description détaillée

## 📜 Licence

Ce projet est sous licence **MIT**. Utilisation libre y compris commerciale.

### **Utilisation libre pour :**
- ✅ Projets personnels et éducatifs
- ✅ Applications commerciales
- ✅ Modifications et redistributions
- ✅ Intégration dans autres projets

## 🏆 Remerciements

- **Inspiration** : Traditions millénaires du Go en Asie
- **Design** : Esthétique des vrais plateaux de Go
- **Algorithmes** : Communauté open-source du Go
- **Format SGF** : Smart Game Format standards

## 📞 Support et communauté

- **Documentation** : Ce README complet
- **Issues** : [Signaler un problème](https://github.com/Timso-dev/jeu-de-go/issues)
- **Discussions** : [Forum communautaire](https://github.com/Timso-dev/jeu-de-go/discussions)
- **Email** : support@votredomaine.com

---

**⭐ Mettez une étoile si vous appréciez ce projet !**

*"Le Go est un miroir de l'esprit humain"* - Proverbe asiatique 🎋
