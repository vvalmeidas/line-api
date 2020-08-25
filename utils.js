const EMAIL_REGEX = /\S+@\S+\.\S+/


/**
 * Verifica se há algum campo ausente para o cadastro de usuário
 * @param {*} name nome
 * @param {*} email email
 * @param {*} gender gender
 * @throws Erro informando o(s) campo(s) ausente(s), caso exista(m)
 */
const verifyRegisterFields = (name, email, gender) => {
    var errors = []

    if(!name || name.trim() === '') errors.push('nome')
    if(!email) errors.push('e-mail')
    if(!gender) errors.push('gênero')
    
    if(errors.length > 0) {
        throw `Campo(s) ausente(s): ${errors}` 
    }
}

/**
 * Realiza validação do e-mail, verificando se ele existe e se possui formato válido
 * @param {*} email email a ser validado
 * @throws Erro indicando que o e-mail não foi informado ou que é inválido
 */
const validateEmail = (email) => {
    if(!email) throw 'E-mail não foi informado'
    else if(!email.match(EMAIL_REGEX)) throw 'O campo e-mail possui formato inválido'
}

/**
 * Obtém a nomenclatura completa para o campo gênero, que é informado por sigla no cadastro. A conversão ocorre
 * de modo que F = Feminino, M = Masculino, NB = Não-binário ou O = Outros.
 * @param {*} gender sigla do gênero
 * @returns nomenclatura adequada para o campo gênero
 * @throws Erro indicando que o campo gênero é indefinido ou possui formato inválido
 */
const getFullGenderName = (gender) => {
    if(!gender) throw 'Gênero não foi informado'
    gender = gender.toUpperCase()
    if(gender === 'F') return 'Feminino'
    else if(gender === 'M') return 'Masculino'
    else if (gender === 'NB') return 'Não-binário'
    else if (gender === 'O') return 'Outros'
    else throw 'O campo gênero possui formato inválido. Informe F (Feminino), M (Masculino), NB (Não-binário) ou O (Outros).'
}

module.exports = { verifyRegisterFields, validateEmail, getFullGenderName }