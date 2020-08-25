/**
 * Classe que represeta a estrutura de dados fila (FIFO).
 */
module.exports = class Queue {
    constructor() {
        this.elements = []
    }

    /**
     * Informa a fila atual
     * @returns fila atual
     */
    get() {
        return this.elements
    }

    /**
     * Informa a posição atual de um elemento na fila
     * @param {*} element elemento do qual se deseja saber a posição
     * @returns posição do elemento na fila, caso o elemento esteja na fila; -1, caso contrário
     */
    getPosition(element) {
        var index = this.elements.indexOf(element)
        return index === -1 ? index : index + 1
    }

    /**
     * Insere um elemento na última posição da fila
     * @param {*} element elemento a ser inserido
     */
    push(element) {
        this.elements.push(element);
    }

    /**
     * Remove o primeiro elemento da fila
     * @returns primeiro elemento da fila, caso exista
     * @throws Erro indicando que a fila está vazia
     */
    pop() {
        if(this.isEmpty()) throw 'A fila está vazia'
        return this.elements.shift()
    }

    /**
     * Informa o primeiro elemento da fila, sem removê-lo
     * @returns primeiro elemento da fila, caso exista
     * @throws Erro indicando que a fila está vazia
     */
    peek() {
        if(this.isEmpty()) throw 'A fila está vazia'
        return this.elements[0]
    }

    /**
     * Verifica se a fila está vazia
     * @return true, caso a fila esteja vazia; false, caso contrário
     */
    isEmpty() {
        return this.elements.length === 0
    }

    /**
     * Informa o tamanho da fila
     * @returns tamanho da fila
     */
    size() {
        return this.elements.length 
    }

}