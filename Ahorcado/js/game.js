const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
    MAX_ATTEMPTS = 6,
    MASK_CHAR = "_";
new Vue({
    el: "#app",
    data: () => ({
        letters: {},
        hiddenWord: [],
        remainingAttempts: 0,
    }),
    async mounted() {
        await Swal.fire(
            'juego del ahorcado'
        );
        this.resetGame();
    },
    methods: {
        resetGame() {
            this.resetAttempts();
            this.setupKeys();
            this.chooseWord();
        },
        checkGameStatus() {
            if (this.playerWins()) {
                Swal.fire("Ganaste la Palabra era " + this.getUnhiddenWord());
                this.resetGame();
            }
            if (this.playerLoses()) {
                Swal.fire("Perdiste la Palabra era " + this.getUnhiddenWord());
                this.resetGame();
            }
        },
        getUnhiddenWord() {
            let word = "";
            for (const letter of this.hiddenWord) {
                word += letter.letter;
            }
            return word;
        },
        playerWins() {
            // Si hay al menos una letra oculta, el jugador no ha ganado hasta que sea todo descubierto
            for (const letter of this.hiddenWord) {
                if (letter.hidden) {
                    return false;
                }
            }
            return true;
        },
        playerLoses() {
            return this.remainingAttempts <= 0;
        },
        imagePath() {
            return `img/Ahorcado-${MAX_ATTEMPTS - this.remainingAttempts}.png`;
        },
        resetAttempts() {
            this.remainingAttempts = MAX_ATTEMPTS;
        },
        async chooseWord() {
            // Aqui podemos obtener las palabras almacenadas que se ingresaron 
            const words = getWords();
            if (!words.length) {
                await Swal.fire("Agregue algunas palabras para poder jugar (Entraras al apartado de Agregar Palabras)");
                window.location = "./words.html";
            }
            // Aqui hacemos una funcion que hace quye las palabras se elijan de manera al azar
            let word = words[Math.floor(Math.random() * words.length)];
            this.prepareWord(word);
        },
        prepareWord(word) {
            word = word.toUpperCase();
            const hiddenWord = [];
            for (const letter of word) {
                hiddenWord.push({
                    letter,
                    hidden: true,
                });
            }
            this.hiddenWord = hiddenWord;
        },
        displayWord() {
            let displayedWord = "";
            for (const letter of this.hiddenWord) {
                if (letter.hidden) {
                    displayedWord += MASK_CHAR;
                } else {
                    displayedWord += letter.letter;
                }
                displayedWord += " ";
            }
            return displayedWord;
        },
        setupKeys() {
            // Aqui se genera un diccionario a partir de las letras que se guardan.
            for (const letter of ALPHABET) {
                Vue.set(this.letters, letter, {
                    letter,
                    disabled: false, // en esta linea se deshabilita cuando el usuario hace clic 
                });
            }
        },
        letterExistsInWord(searchedLetter) {
            for (const letter of this.hiddenWord) {
                if (letter.letter === searchedLetter) {
                    return true;
                }
            }
            return false;
        },
        discoverLetter(letter) {
            for (const index in this.hiddenWord) {
                if (this.hiddenWord[index].letter === letter) {
                    this.hiddenWord[index].hidden = false;
                }
            }
        },
        attemptWithLetter(letter) {
            Vue.set(this.letters[letter], "Desactivada", true);
            if (!this.letterExistsInWord(letter)) {
                this.remainingAttempts -= 1;
            } else {
                this.discoverLetter(letter);
            }
            this.checkGameStatus();
        }
    }
});