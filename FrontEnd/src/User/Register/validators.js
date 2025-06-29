
const validators = {
    'Firstname': firstname => /^[a-zA-Z]{3,}$/.test(firstname.trim()) ? null : `Firstname must has at least 3 characters. Digits,special characters are not allowed`,
    'Lastname': lastname => /^[a-zA-Z]{3,}$/.test(lastname.trim()) ? null : `Lastname must has at least 3 characters. Digits,special characters are not allowed`,
    'Email': email => /^[a-zA-Z][a-zA-Z0-9._%-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()) ? null : 'Please provide a valid email address',
    'Phone number': phone => /^\d{8}$/.test(phone.trim()) ? null : 'Please provide a valid phone number (ex: 05XXXXXXXX)',
    'Passwords': (password, rePassword) => validatePasswords(password, rePassword),
    'Message' : message => message.trim() == ''? 'Message is required' : null
}

const validatePasswords = (password, rePassword) => {
    if (password.length < 8){
        return 'Password length must be at least 8 characters'
    }
    if (password.toLowerCase() !=  rePassword.toLowerCase()){
        return 'Passwords does not matched'
    }
    return null
}


export default validators