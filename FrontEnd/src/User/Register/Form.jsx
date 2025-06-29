import { useState, useEffect } from 'react';
import { Alert, Icon } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import MyFormInput from '../../static components/MyFormInput';
import swal from '@sweetalert/with-react';
import serverIP from '../../config';
import MyFormSelect from '../../static components/MyFormSelect';
import validators from './validators';
import selectionLists from './selectionLists';
import capitalizeFirstLetter from '../../capitalization';
import styled from 'styled-components';
const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
  font-size : 14px;
  cursor : pointer;
`;
export default function Form({ initialData, url, nextUrl, submitButtonLabel, submitButtonEndIcon, headerDescription }) {
    const [formData, setFormData] = useState(initialData)

    const [MyErrors, setMyErrors] = useState({})
    const [loading, setLoading] = useState(false)
    axios.defaults.withCredentials = true;


    const handleBlur = (evt, title) => {
        const { name, value, placeholder = null } = evt.target
        if (placeholder == 'Password' || placeholder == 'Confirm password') {
            handlePasswordsBlur()
            return
        }
        if (validators[placeholder]) {
            const isValidInput = validators[placeholder](value.trim())
            if (isValidInput == null || value.trim() == '') {
                const updatedErrors = { ...MyErrors };
                delete updatedErrors[placeholder];
                setMyErrors(updatedErrors);
            }
            else
                setMyErrors({ ...MyErrors, [placeholder]: isValidInput })
        }
        else {
            const updatedErrors = { ...MyErrors };
            delete updatedErrors[title];
            setMyErrors(updatedErrors);
        }


    }

    const handlePasswordsBlur = () => {
        const isValidPassword = validators['Passwords'](formData.password, formData.confirmPassword)
        if (isValidPassword == null) {
            const updatedErrors = { ...MyErrors };
            delete updatedErrors['Password']
            delete updatedErrors['Confirm password']
            setMyErrors(updatedErrors);
        }
        else {
            const updated = { 'Password': isValidPassword, 'Confirm password': isValidPassword }
            setMyErrors({ ...MyErrors, ...updated })
        }
    }

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setFormData({ ...formData, [name]: value.trim() })
    }

    const submit = async (e) => {
        e.preventDefault()

        const validationResult = validateForm(formData)

        if (Object.keys(validationResult).length != 0) {
            setMyErrors(validationResult)
            const firstInputError = getFirstId(initialData, validationResult)
            console.log(validationResult)
            document.getElementById(firstInputError).scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }

        axios.defaults.withCredentials = true
        setLoading(true)
        try {
            const response = await axios.post(url, { formData: { ...formData, phoneNumber: `05${formData.phoneNumber}` } })
            swal({
                icon: 'success',
                text: response.data.successMessage
            }).then(r => window.location.href = nextUrl)
            setLoading(false)

        } catch (responseError) {
            if (responseError.response.status == 422) {
                console.log(responseError.response.data.errors)
                setMyErrors(responseError.response.data.errors)
                const errors = responseError.response.data.errors
                document.getElementById(Object.entries(errors)[0][0]).scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            else {
                swal({
                    icon: 'error',
                    text: responseError.response.data.errors
                })
            }
            setLoading(false)
        }


    }

    const formProps = {
        style: {
            padding: 30,
            backgroundColor: 'white',
            boxShadow: '0px 10px 50px 0px rgba(0,0,0,0.1)'
        }
    }

    const loadingButtonProps = {
        sx: {
            backgroundColor: 'green',
            textTransform: 'none',
            padding: 1,
            ':hover': { backgroundColor: '#006400' },
            borderRadius: '25px',
            marginTop: 1
        }

    }

    return (

        <form id='register-form' {...formProps}>
            <h2 style={{ textAlign: 'center' }}>Sign up</h2>
            <StyledB style={{ color: 'gray', textAlign: 'center', display: 'block', cursor: 'initial' }}>{headerDescription}</StyledB>
            <MyFormInput required={true} name='firstname' value={formData.firstname} title='Firstname' handleBlur={handleBlur} handleChange={handleChange} MyErrors={MyErrors} />
            <MyFormInput required={true} name='lastname' value={formData.lastname} title='Lastname' handleBlur={handleBlur} handleChange={handleChange} MyErrors={MyErrors} />
            <MyFormInput required={true} name='email' value={formData.email} title='Email' handleBlur={handleBlur} handleChange={handleChange} MyErrors={MyErrors} />
            <MyFormInput required={true} type='password' name='password' value={formData.password} title='Password' handleBlur={handleBlur} handleChange={handleChange} MyErrors={MyErrors} />
            <MyFormInput required={true} type='password' name='confirmPassword' value={formData.confirmPassword} title='Confirm password' handleBlur={handleBlur} handleChange={handleChange} MyErrors={MyErrors} />
            <MyFormInput required={true} type='text' name='phoneNumber' value={formData.phoneNumber} title='Phone number' handleBlur={handleBlur} handleChange={handleChange} MyErrors={MyErrors} startAdornment='05' />
            <MyFormSelect required={true} name='city' value={formData.city} title='City' placeholder='City' handleBlur={handleBlur} handleChange={handleChange} list={selectionLists} MyErrors={MyErrors} />
            <LoadingButton loading={loading} className='btn' fullWidth type='submit' onClick={submit} endIcon={submitButtonEndIcon} variant="contained"
                loadingPosition="end"
                {...loadingButtonProps}
            >
                {submitButtonLabel}
            </LoadingButton>
        </form>


    );
}

const validateForm = (formData) => {

    const errors = {}

    Object.entries(formData).forEach(
        ([field, value]) => {

            const inCapital = capitalizeFirstLetter(field)

            if (value == '') {
                errors[inCapital] = `${inCapital} is requried`
            }
            else if (field == 'password' || field == 'confirmPassword') {
                const isValid = validators['Passwords'](formData.password, formData.confirmPassword)
                if (isValid != null) {
                    errors[inCapital] = isValid
                }
            }
            else if (value != '') {
                if (validators[inCapital]) {
                    const isValid = validators[inCapital](value)
                    if (isValid != null)
                        errors[inCapital] = isValid
                }
            }


        }
    )
    return errors
}


const getFirstId = (initalData, errors) => {
    const errorsKeys = Object.keys(errors)
    const initialDataKeys = Object.keys(initalData)

    let first = ''

    for (let i = 0; i < initialDataKeys.length; i++) {
        if (errorsKeys.includes(capitalizeFirstLetter(initialDataKeys[i]))) {
            first = capitalizeFirstLetter(initialDataKeys[i])
            break
        }
    }
    return first
}
