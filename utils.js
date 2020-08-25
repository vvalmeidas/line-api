const EMAIL_REGEX = /\S+@\S+\.\S+/


/**
 * Verifica se há algum campo ausente para o cadastro de usuário
 * @param {*} name nome
 * @param {*} email email
 * @param {*} gender gender
 * @throws Descrição do(s) campo(s) ausente(s), caso exista(m)
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
 * @throws Descrição do erro, podendo indicar que o e-mail não foi informado ou que é inválido
 */
const validateEmail = (email) => {
    if(!email) throw 'E-mail não foi informado'
    else if(!email.match(EMAIL_REGEX)) throw 'O campo e-mail possui formato inválido'
}

/**
 * Realiza validação do gênero, verificando se o campo possui valor F (Feminino), M (Masculino), 
 * NB (Não-binário) ou O (Outros)
 * @param {*} gender sigla para o campo gênero
 * @throws Descrição do erro, indicando que o campo gênero possui formato inválido
 */
const validateGender = (gender) => {
    gender = gender.toUpperCase()
    if(!gender) throw 'Gênero não foi informado'
    else if(gender != 'F' && gender != 'M' && gender != 'NB' && gender != 'O') 
        throw 'O campo gênero possui formato inválido. Informe F (Feminino), M (Masculino), NB (Não-binário) ou O (Outros).'

}

/**
 * Obtém a nomenclatura completa para o campo gênero, que é informado por sigla no cadastro
 * @param {*} gender sigla do gênero
 * @returns nomenclatura adequada para o campo gênero
 */
const getFullGenderName = (gender) => {
    gender = gender.toUpperCase()

    if(gender === 'F') return 'Feminino'
    else if(gender === 'M') return 'Masculino'
    else if (gender === 'NB') return 'Não-binário'
    else return 'Outros'
}


module.exports = { verifyRegisterFields, validateEmail, validateGender, getFullGenderName }