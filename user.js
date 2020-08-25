/**
 * Classe que representa um usuário que será inserido na fila
 */
module.exports = class User {
    /**
     * Cria uma nova instância da classe usuário
     * @param {*} id id do usuário
     * @param {*} name nome do usuário
     * @param {*} email email do usuário
     * @param {*} gender genêro do usuário
     */
    constructor(id, name, email, gender) {
        this.id = id
        this.name = name
        this.email = email
        this.gender = gender
    }
}