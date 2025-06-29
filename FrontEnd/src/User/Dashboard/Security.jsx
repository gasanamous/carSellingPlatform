import { useState } from "react";
import MyFormInput from "../../static components/MyFormInput";
import swal from "@sweetalert/with-react";
import { LoadingButton } from "@mui/lab";
import KeyIcon from '@mui/icons-material/Key';
import EmailIcon from '@mui/icons-material/Email';
import axios from "axios";
import SweetAlert2 from "react-sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";
import serverIP from "../../config";

const loadingButtonProps = {
    sx: {
        backgroundColor: 'green',
        textTransform: 'none',
        padding: 1,
        ':hover': { backgroundColor: '#006400' },
        borderRadius: '0',
    }
}


export default function Security({ user }) {
    const [loading, setLoading] = useState(false)
    const [changePasswordLoading, setChangePasswordLoading] = useState(false)
    const [changeEmailLoading, setChangeEmailLoading] = useState(false)
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    })
    const [email, setEmail] = useState('')
    const [PasswordErrors, setPasswordErrors] = useState({})
    const [emailErrors, setEmailErrors] = useState({})
    const navigate = useNavigate()

    const handleBlur = (evt) => {
        const { name, value, placeholder } = evt.target

        if (value.trim() == '')  { setPasswordErrors({ ...PasswordErrors, [placeholder]: null }) }

        else if (name == 'currentPassword') { setPasswordErrors({ ...PasswordErrors, [placeholder]: null }) }

        else if (name == 'newPassword') {
            if (value.trim().length < 8)
                setPasswordErrors({ ...PasswordErrors, [placeholder]: 'Password length must be at least 8 characters' })
            else
                setPasswordErrors({ ...PasswordErrors, [placeholder]: null })
            }

        else if (name == 'confirmNewPassword') {
            if (value.trim() !== passwordFormData.newPassword)
                setPasswordErrors({ ...PasswordErrors, [placeholder]: 'Passwords does not matched' })
            else
                setPasswordErrors({ ...PasswordErrors, [placeholder]: null })
        }

        else if (name == 'email') {
            const reg = /^[a-zA-Z][a-zA-Z0-9._%-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (value.trim() == '')
                setEmailErrors({ [placeholder]: null })
            else if (!reg.test(value.trim()))
                setEmailErrors({ [placeholder]: 'Please provide a valid email address' })
            else if (value == user.email)
                setEmailErrors({ [placeholder]: 'This is your current email' })
            else
                setEmailErrors({ [placeholder]: null })
        }
    }

    const handlePasswordChange = (evt) => {
        const { name, value, placeholder } = evt.target
        setPasswordFormData({ ...passwordFormData, [name]: value.trim() })
    }

    const handleEmailChange = (evt) => {
        setEmail(evt.target.value.trim())
    }

    const changePassword = async (evt) => {
        evt.preventDefault()
        const emptyFields = getEmptyFields(passwordFormData)

        if (emptyFields.length != 0) {
            const errors = getEmptyError(emptyFields)
            setPasswordErrors(errors)
            document.getElementById('passwordBox').scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }

        setChangePasswordLoading(true)
        try {
            axios.defaults.withCredentials = true
            const response = await axios.post(`${serverIP.ip}/user/editPassword`, { currentPassword: passwordFormData.currentPassword, newPassword: passwordFormData.newPassword })
            swal({
                icon: 'success',
                text: response.data.successMessage
            }).then(r => window.location.reload())
        } catch (response) {
            console.log(response)
            if (response.response && response.response.status == 412) {
                setPasswordErrors(response.response.data.errors)
            }
            else if (response.response && response.response.status == 401) {
                navigate('../user/signin')
            }
            else {
                swal({
                    icon: 'error',
                    text: 'Sorry, an error ocurred while changing password, please try again'
                })
            }

        }
        setChangePasswordLoading(false)

    }

    const changeEmail = async (evt) => {
        evt.preventDefault()
        if (emailErrors['Email Address'] != null) return



        if (email.trim() == '') {
            setEmailErrors({ ['Email Address']: 'Please type your new email address' })
            document.getElementById('emailBox').scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }

        axios.defaults.withCredentials = true
        setChangeEmailLoading(true)
        try {
            const response = await axios.post(`${serverIP.ip}/user/changeEmail`, { newEmail: email })
            swal({
                icon: 'success',
                text: `A message has been sent to your email address ${email}. Please check the message to complete the process of changing your email address`
            })

        } catch (response) {
            console.log(response)
            if (response.response && response.response.status == 422) {
                setEmailErrors({ ['Email Address']: response.response.data.Email })
            }
            else if (response.response && response.response.status == 401) {
                navigate('../user/signin')
            }
            else {
                swal({
                    icon: 'error',
                    text: 'Sorry, an error ocurred while changing password, please try again'
                })
            }
        }

    }

    const deleteMyAccount = async () => {
        swal({
            title: 'Are you sure you want to delete your account?',
            text : 'if you delete this account, all related advertisements also will be deleted',
            icon: 'warning',
            dangerMode: true,
            buttons: {
                cancel: true,
                confirm: {
                    text: 'Delete',
                    value: 'delete',
                    className: 'error-button',
                },
            },
        })
            .then(async (value) => {
                axios.defaults.withCredentials = true
                if (value != 'delete') return
                try {
                    const response = await axios.post(`${serverIP.ip}/user/deleteMyAccount`)
                    window.location.href = serverIP.clientIP
                } catch (error) {
                    swal({
                        icon: 'error',
                        text: 'Sorry, an error occured while deleting your account, Please try again',
                    })
                }
            })

    }
    return (
        <>
            <div style={{ borderBottom: 'solid 1px lightgray', paddingBottom: '20px' }}>
                <h3 id="passwordBox">  {<KeyIcon fontSize="large" />}  Change your password</h3>
                <MyFormInput type="password" name='currentPassword' title='Current password' handleBlur={handleBlur} MyErrors={PasswordErrors} handleChange={handlePasswordChange} />
                <MyFormInput type="password" name='newPassword' title='New password' handleBlur={handleBlur} handleChange={handlePasswordChange} MyErrors={PasswordErrors} />
                <MyFormInput type="password" name='confirmNewPassword' title='Confirm new password' handleChange={handlePasswordChange} handleBlur={handleBlur} MyErrors={PasswordErrors} />
                <LoadingButton fullWidth onClick={changePassword} loading={changePasswordLoading} sx={{ textTransform: 'none' }} {...loadingButtonProps} variant="contained"> Change Password </LoadingButton>
            </div>
            <div style={{borderBottom: 'solid 1px lightgray', marginTop: '20px' , paddingBottom: '20px' }}>
                <h3 id="emailBox">{<EmailIcon fontSize="large" />} Change your email address</h3>
                <h6>{user.email}</h6>
                <MyFormInput type="email" name='email' title='Email Address' handleChange={handleEmailChange} handleBlur={handleBlur} MyErrors={emailErrors} />
                <LoadingButton fullWidth onClick={changeEmail}  loading={loading} sx={{ textTransform: 'none'}} {...loadingButtonProps} variant="contained"> Change Email </LoadingButton>
            </div>
            <div style={{ marginTop: '20px' }}>
                <LoadingButton onClick={deleteMyAccount} color="error" loading={loading} sx={{ textTransform: 'none', borderRadius : '0' }}  variant="contained">Delete My Account</LoadingButton>
            </div>

        </>
    )

}

function splitByCapitalLetter(attributeName) {
    let words = attributeName.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    if (words == 'Price') return words.join(' ') + ' ($)';
    return words.join(' ');
}

function capitalizeFirstLetter(str) {
    str = splitByCapitalLetter(str).toLowerCase()
    if (str.length === 0) {
        return str;
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}


const getEmptyError = (emptyFields) => {
    const errors = {}
    emptyFields.map(field => errors[field] = `${capitalizeFirstLetter(field)} is required`)

    return errors
}

const getEmptyFields = (formData) => {
    const fields = ['currentPassword', 'newPassword', 'confirmNewPassword']
    const emptyField = []
    fields.map(el => {
        if (!formData[el]) emptyField.push(capitalizeFirstLetter(el))
    })
    return emptyField
}