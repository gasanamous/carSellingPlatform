import { useState } from "react";
import MyFormInput from "../static components/MyFormInput";
import MyFormSelect from "../static components/MyFormSelect";
import { Container } from "@mui/material";
import styled from 'styled-components';
import validators from "./Register/validators";
import MyTextareaInput from "../static components/MyTextareaInput";
import { LoadingButton } from "@mui/lab";
import SendIcon from '@mui/icons-material/Send';
import capitalizeFirstLetter from "../capitalization";
import axios from "axios";
import serverIP from "../config";
import swal from "@sweetalert/with-react";

const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
    font-size: 14px; 
`;
const mainContainerProps = {
    sx: {
        paddingTop: 2,
        position: 'absolute',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    maxWidth: 'sm'
}
const loadingButtonProps = {
    sx: {
        backgroundColor: 'green',
        textTransform: 'none',
        padding: 1,
        ':hover': { backgroundColor: '#006400' },
        borderRadius: '25px',
        marginTop: 3
    }

}
const formProps = {
    style: {
        padding: 30,
        backgroundColor: 'white',
        boxShadow: '0px 10px 50px 0px rgba(0,0,0,0.1)'
    }
}

export default function Help() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        problemSubject: '',
        additionalDetails: ''
    })
    const [MyErrors, setMyErrors] = useState({})
    const [loading, setLoading] = useState(false)


    const handleChange = (evt) => {
        const { name, value, placeholder = null } = evt.target
        setFormData({ ...formData, [name]: value })
    }

    const handleBlur = (evt, title) => {
        const { value, placeholder = null } = evt.target

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

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        const validationResult = validateForm(formData)

        /*  if (Object.keys(validationResult).length != 0) {
              setMyErrors(validationResult)
              const firstInputError = getFirstId(validationResult)
              console.log(validationResult)
              document.getElementById(firstInputError).scrollIntoView({ behavior: 'smooth', block: 'center' })
              return
          }*/
        setLoading(true)
        try {
            const response = await axios.post(`${serverIP.ip}/user/submitReport`, { formData: formData })
            swal({
                icon: 'success',
                text: response.data.successMessage
            })
            setLoading(false)
        } catch (responseError) {
            setLoading(false)
            if (responseError.response.status == 422) {
                setMyErrors(responseError.response.data.errors)
                const firstError = getFirstId(responseError.response.data.errors)
                document.getElementById(firstError).scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            else {
                swal({
                    icon: 'error',
                    responseError: responseError.response.data.errors
                })
                console.log(responseError)

            }


        }

        setLoading(false)

    }
    return (
        <Container {...mainContainerProps}>
            <form {...formProps}>
                <h2 style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    Help
                </h2>
                <StyledB style={{ color: 'gray', display: 'block', textAlign: 'center' }}>We'are here to help. Choose a problem and please be as detailed as possible to help you</StyledB>
                <MyFormInput required={true} name='firstname' title='Firstname' handleChange={handleChange} MyErrors={MyErrors} handleBlur={handleBlur} value={formData.firstname} />
                <MyFormInput required={true} name='lastname' title='Lastname' handleChange={handleChange} MyErrors={MyErrors} handleBlur={handleBlur} value={formData.lastname} />
                <MyFormInput required={true} type='email' name='email' title='Email' handleChange={handleChange} MyErrors={MyErrors} handleBlur={handleBlur} value={formData.email} />
                <MyFormSelect required={true} name='problemSubject' title='Problem subject' handleChange={handleChange} handleBlur={handleBlur} value={formData.problemSubject} list={problemSubjectList} MyErrors={MyErrors} />
                <MyTextareaInput name='additionalDetails' title='Additional details' value={formData.additionalDetails} handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} />
                <LoadingButton fullWidth type="submit" endIcon={<SendIcon htmlColor="white" />} loadingPosition="end"
                    loading={loading}
                    variant="contained"
                    {...loadingButtonProps}
                    onClick={handleSubmit}
                >
                    Submit
                </LoadingButton>

            </form>
        </Container>
    )
}

const problemSubjectList = [
    'Have a problem with sign up?',
    'Have a problem with sign in?',
    'Have a problem with selling your car?',
    'Have a problem with contacting with a car seller',
]

const validateForm = (formData) => {

    const errors = {}

    Object.entries(formData).forEach(
        ([field, value]) => {

            const inCapital = capitalizeFirstLetter(field)
            if (value == '') {
                errors[inCapital] = `${inCapital} is requried`
            }
            else {
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


const getFirstId = (errors) => {
    const initialDataKeys = [
        'firstname',
        'lastname',
        'email',
        'problemSubject',
        'additionalDetails'
    ]
    const errorsKeys = Object.keys(errors)

    let first = ''

    for (let i = 0; i < initialDataKeys.length; i++) {
        if (errorsKeys.includes(capitalizeFirstLetter(initialDataKeys[i]))) {
            first = capitalizeFirstLetter(initialDataKeys[i])
            break
        }
    }
    return first
}
