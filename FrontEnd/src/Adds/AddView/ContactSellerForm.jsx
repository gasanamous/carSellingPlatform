import { TextField, Select, MenuItem, FormControl, InputLabel, Alert, Divider } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import './../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import MyFormInput from '../../static components/MyFormInput';
import MyTextareaInput from '../../static components/MyTextareaInput';
import validators from '../../User/Register/validators';
import React from 'react';
import serverIP from '../../config';
import capitalizeFirstLetter from '../../capitalization';
import { Mail } from '@mui/icons-material';
import swal from '@sweetalert/with-react';

export default function ContactSellerForm({ addId }) {

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        message: ''
    })
    const [MyErrors, setMyErrors] = useState()
    const [loading, setLoading] = useState(false)

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setFormData({ ...formData, [name]: value.trim() })
    }

    const handleBlur = (evt, title) => {
        const { value, placeholder = null } = evt.target

        const isValidInput = validators[placeholder](value.trim())
        if (isValidInput == null || value.trim() == '') {
            const updatedErrors = { ...MyErrors };
            delete updatedErrors[placeholder];
            setMyErrors(updatedErrors);
        }
        else
            setMyErrors({ ...MyErrors, [placeholder]: isValidInput })
    }

    const handleSendMessage = async (evt) => {
        evt.preventDefault()

        const validationResult = validation(formData)
        if (Object.keys(validationResult).length != 0) {
            setMyErrors(validationResult)
            const firstInputError = getFirstId(validationResult)
            document.getElementById(firstInputError).scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }
        axios.defaults.withCredentials = true
        setLoading(true)

        try {
            const response = await axios.post(`${serverIP.ip}/adds/send_inquire`, { inquire: {...formData, phoneNumber : `05${formData.phoneNumber}`}, addId: addId })
            swal({
                text: response.data.successMessage,
                icon: 'success'
            })
            setLoading(false)
        } catch (error) {
            swal({
                text: response.data.errors,
                icon: 'success'
            })
            setLoading(false)
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
        <>
            <form id='contact-form' style={{ padding: '0px 0px 0px 0px' }} >
                <h3 className='font'>Contact Seller</h3>
                <div className='contact-seller-form'>
                    <MyFormInput required={true} title='Firstname' value={formData.firstname} handleChange={handleChange} name='firstname' type='text' handleBlur={handleBlur} MyErrors={MyErrors} />
                    <MyFormInput required={true} title='Lastname' value={formData.lastname} handleChange={handleChange} name='lastname' type='text' handleBlur={handleBlur} MyErrors={MyErrors} />
                    <MyFormInput required={true} title='Email' value={formData.email} handleChange={handleChange} name='email' type='email' handleBlur={handleBlur} MyErrors={MyErrors} />
                    <MyFormInput required={false} title='Phone number' value={formData.phoneNumber} handleChange={handleChange} name='phoneNumber' type='text' handleBlur={handleBlur} MyErrors={MyErrors} startAdornment='05' />
                    <MyTextareaInput name='message' title='Message' value={formData.message} handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} />
                </div>
                <div style={{ marginTop: '15px' }} className='submit-box'>
                    <LoadingButton fullWidth type="submit" endIcon={<Mail />} loadingPosition="end" loading={loading}
                        {...loadingButtonProps}
                        variant="contained"
                        onClick={handleSendMessage}
                    >
                        <span className='font'>Send Message</span>
                    </LoadingButton>
                </div>
            </form>
        </>
    )
}

const validation = (formData) => {

    const errors = {}
    Object.entries(formData).forEach(([field, value]) => {

        const inCapital = capitalizeFirstLetter(field)
        if (field == 'phoneNumber' && value != '') {
            console.log(field, value)
            const isValid = validators['Phone number'](value)
            isValid ? errors['Phone number'] = isValid : ''
        }
        else if (field != 'phoneNumber') {
            if (value == '')
                errors[inCapital] = `${inCapital} is required`
            else {
                const isValid = validators[inCapital](value)
                isValid ? errors[inCapital] = isValid : ''
            }

        }
    })
    return errors
}

const getFirstId = (errors) => {

    const initalData = {
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        message: ''
    }

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
