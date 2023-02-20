new Vue({
    el: "#app",
    data: () => ({
        words: [],
        newWord: "",
    }),
    mounted() {
        this.refreshWords();
    },
    methods: {
        refreshWords() {
            this.words = getWords();
        },
        saveWord() {
            // Aqui se usa para limpiar de nuevo la pantalla._.
            this.deleteWhiteSpaces();
            const word = this.newWord.toUpperCase();
            // Aqui se hace la funcion guardar solo si no existe la palabra
            if (this.words.indexOf(word) === -1) {
                this.words.push(word);
                saveWords(this.words);
                this.newWord = "";
            } else {
                Swal.fire("La palabra ya existe");
            }
        },
        async deleteWord(index) {
            const result = await Swal.fire({
                title: 'Borrando palabra',
                text: "Estas segur@?",
                icon: 'Pregunta',
                showCancelButton: true,
                cancelButtonText: 'No, regresar',
                confirmButtonText: 'si, eliminarlo'
            });
            if (!result.value) return;
            this.words.splice(index, 1);
            saveWords(this.words);
        },
        deleteWhiteSpaces() {
            this.newWord = this.newWord.replace(/ /g, "")
        }
    }
});