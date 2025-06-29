import { useEffect, useState } from "react"
import MyFormSelect from "../../static components/MyFormSelect"
import { Container, Button, InputAdornment, Divider, FormControlLabel, Checkbox, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MyFormInput from "../../static components/MyFormInput"
import axios from 'axios';
import swal from '@sweetalert/with-react';
import { useNavigate } from "react-router-dom";
import serverIP from "../../config";
import MyUploadInput from "../../static components/MyUploadInput";
import CarImagesViewer from "./CarImagesViewer";
import selectionLists from "./selectionLists";
import validators from "./validators";
import capitalizeFirstLetter from "../../capitalization";
import styled from 'styled-components';

const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
    font-size: 14px; 
`;
const boxProps = {
    style: {
        borderBottom: 'solid 1px lightgray',
        padding: 30,

    }
}

const formProps = {
    style: {
        padding: '20px',
        boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
    }
}
const loadingButtonProps = {
    sx: {
        backgroundColor: 'green',
        textTransform: 'none',
        padding: 1,
        ':hover': { backgroundColor: '#006400' },
        borderRadius: '0',
        marginTop: 3
    }
}

export default function CreateAddForm({ initialData, url }) {
    const [formData, setFormData] = useState(initialData)
    const [MyErrors, setMyErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [enable, setEnable] = useState(false)

    useEffect(
        () => {
            const isLoggedIn = async () => {
                await axios.post(`${serverIP.ip}/user/userData`)
                    .then(res => setEnable(true))
                    .catch(e => setEnable(false))
            }
            isLoggedIn()
        }, []
    )

    const navigate = useNavigate()

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleImages = (evt) => {
        const files = evt.target.files;
        if (files.length !== 0) {
            setMyErrors({ ...MyErrors, ['Car images']: null });
        }
        const promises = [];
        const loadedImages = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const promise = new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function handleOnLoad(evt) {
                    loadedImages.push(evt.target.result);
                    resolve();
                };

                reader.onerror = function handleError(evt) {
                    reject(evt.target.error);
                };

                reader.readAsDataURL(file);
            });

            promises.push(promise);
        }

        Promise.all(promises)
            .then(() => {
                setFormData({ ...formData, carImages: [...formData.carImages, ...loadedImages] });
            })
            .catch((error) => {
                setMyErrors({ ...MyErrors, ['Car images']: 'Error while uploading' });
            });
    }

    const handleAddAddon = (addon, value) => {
        let addons = formData.addons
        value ? addons = [...addons, addon] : addons = addons.filter(element => element !== addon)
        setFormData({ ...formData, addons: addons })

    };

    const deleteImage = (img) => {
        let images = formData.carImages

        images = images.filter(element => element != img)

        setFormData({ ...formData, carImages: images })

    }

    const handleBlur = (evt, title) => {
        const { name, value, placeholder = null } = evt.target

        if (validators[placeholder]) {
            const isValidInput = validators[placeholder](value.trim())
            if (isValidInput == null || value.trim() == '') {
                const updatedErrors = { ...MyErrors };
                delete updatedErrors[placeholder];
                setMyErrors(updatedErrors);
            }
            else
                setMyErrors({ ...MyErrors, [placeholder]: isValidInput })
            setFormData({ ...formData, [name]: value.trim() })
        }
        else {
            const updatedErrors = { ...MyErrors };
            delete updatedErrors[title];
            setMyErrors(updatedErrors);
        }
    }

    const handleSubmit = (evt) => {
        evt.preventDefault()

        const validationResult = validateForm(formData)
        setMyErrors(validationResult)

        const firstInputError = getFirstId(initialData, validationResult)

        if (Object.keys(validationResult).length != 0) {
            document.getElementById(firstInputError).scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }

        axios.defaults.withCredentials = true

        axios.post(url, { formData })
            .then(res => {
                swal({
                    icon: 'success',
                    text: res.data.successMessage,
                }).then(() => window.location.href = `${serverIP.clientIP}/user/my/adds`)
            })
            .catch(e => {
                if (e.response && e.response.status == 401) {
                    swal({
                        icon: 'error',
                        text: 'You must be logged in to be able to post advertisement',
                        show: true
                    })
                }
                else if (e.response && e.response.status == 422) {
                    setMyErrors(e.response.data.errors)
                    const firstInputError = getFirstId(initialData, e.response.data.errors)
                    document.getElementById(firstInputError).scrollIntoView({ behavior: 'smooth', block: 'center' })
                }

                else {
                    swal({
                        icon: 'error',
                        text: e.response.data,
                        show: true

                    })
                }
            })

    }




    return (
        <form id="carSellForm" {...formProps}>
            <h2 style={{ paddingTop: 5, textAlign: 'center' }}>Sell Your Car</h2>
            <StyledB style={{ display: 'block', color: 'gray', textAlign: 'center' }}>Use the form below to create your own advertisement to sell your car, provide your car sepecifications snd submit. Note that starred fields * are required</StyledB>
            <Divider sx={{ width: '70%', margin: 'auto', p: 1 }} ></Divider>
            {!enable && (
                <StyledB style={{marginTop : 5, display : 'block', textAlign : 'center', color :'red'}}>
                    You must be logged in to be able to post an advert
                    <a href={`${serverIP.clientIP}/user/signin`}> Sign in.</a>
                </StyledB>
            )}
            <div {...boxProps} key='basics-box'>
                <h3>Basic</h3>
                <MyFormSelect value={formData.carManufacturer} required={true} name='carManufacturer' title='Car manufacturer' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Car manufacturer' list={selectionLists.companies} />
                <MyFormInput value={formData.carModel} required={true} name='carModel' title='Car model' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} />
                <MyFormSelect value={formData.productionYear} required={true} name='productionYear' title='Production year' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Production year' list={selectionLists.years} />
                <MyFormSelect value={formData.transmission} required={true} name='transmission' title='Transmission' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Transmission' list={['Automatic', 'Manual']} />
                <MyFormInput value={formData.mileage} required={true} name='mileage' title='Mileage' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Mileage' startAdornment={<InputAdornment position="start">Km</InputAdornment>} />
                <MyFormSelect value={formData.previousUse} required={true} name='previousUse' title='Previous use' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Previous use' list={selectionLists.previousUse} />
                <MyFormSelect value={formData.carHealth} required={true} name='carHealth' title='Car health' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Health' list={selectionLists.health} />
                <MyFormSelect value={formData.outerColor} required={true} name='outerColor' title='Outer color' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Outer color' list={selectionLists.colors} />
                <MyFormSelect value={formData.upholstery} name='upholstery' title='Upholstery' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Upholstery' list={['Leather', 'Fabric']} />
            </div>

            <div {...boxProps} key='engine-box'>
                <h3>Engine</h3>
                <MyFormInput value={formData.engineCapacity} required={true} name='engineCapacity' title='Engine capacity' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Capacity' startAdornment={<InputAdornment position="start">CC</InputAdornment>} />
                <MyFormInput value={formData.engineCylinders} required={true} name='engineCylinders' title='Engine cylinders' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Cylinders' />
                <MyFormSelect value={formData.drivetrainPower} required={true} name='drivetrainPower' title='Drivetrain power' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Drivetrain power' list={selectionLists.drivetrain} />
            </div>

            <div {...boxProps} key='fuel-box'>
                <h3>Fuel</h3>
                <MyFormSelect value={formData.fuelType} required={true} name='fuelType' title='Fuel type' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Fuel type' list={selectionLists.fuelType} />
                <MyFormInput value={formData.fuelTankCapacity} required={true} name='fuelTankCapacity' title='Fuel tank capacity' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Tank capacity' startAdornment={<InputAdornment position="start">L</InputAdornment>} />
            </div>


            <div {...boxProps} key='License and price-box'>
                <h3>License and price</h3>
                <MyFormInput required={true} value={formData.price} name='price' title='Price' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Price' startAdornment={<AttachMoneyIcon />} />
                <MyFormInput required={false} value={formData.licenseExpiry} type="date" name='licenseExpiry' title='Licnese expiry' handleChange={handleChange} MyErrors={null} placeholder='Licnese expiry' />
            </div>

            <div {...boxProps}>
                <h3>Car addons</h3>
                <Grid container>
                    {selectionLists.addonsList.map((addon) => (
                        <Grid key={addon} item xs={6} sm={6} md={6} lg={4} xl={4} >
                            <FormControlLabel
                                control={<Checkbox color='success' onChange={(e) => handleAddAddon(addon, e.target.checked)} name={addon} />}
                                label={<StyledB>{addon}</StyledB>}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>

            <div {...boxProps}>
                <h3>Extra details or notes</h3>
                <textarea
                    className="form-control extraNotes"
                    style={{ borderRadius: '0' }}
                    rows={5}
                    onChange={handleChange}
                    name="notes"
                    id="exampleFormControlTextarea1"
                    placeholder="Feel free to share any additional information about your car here."
                    value={formData.notes}
                />
            </div>

            <div {...boxProps}>
                <h3>Car images</h3>
                <MyUploadInput multiple={true} name='carImages' title='Car images' required={true} handleChange={handleImages} MyErrors={MyErrors} />
                {formData.carImages.length > 0 &&
                    (
                        <>
                            <h5 style={{ textAlign: 'center' }}>Images uploded</h5>
                            <CarImagesViewer deleteImage={deleteImage} images={formData.carImages} />
                        </>
                    )
                }

            </div>

            <LoadingButton disabled={!enable} fullWidth type="submit" onClick={handleSubmit} endIcon={<SaveIcon />} loadingPosition="end"
                loading={loading}
                variant="contained"
                {...loadingButtonProps}
            >
                Save And Post
            </LoadingButton>
        </form>
    )
}

const validateForm = (formData) => {
    const nonRequiredFields = ["addons", "notes", "upholstery", "outerColor", "licenseExpiry", "carImages", "inquiries", "__v"]
    const errors = {}
    if (formData['carImages'].length == 0) errors['Car images'] = 'Please upload at least one of your car images'


    Object.keys(formData).forEach(
        field => {
            const inCapital = capitalizeFirstLetter(field)
            if (!nonRequiredFields.includes(field)) {
                if (formData[field] == '')
                    errors[inCapital] = `${inCapital} is required`
                else if (validators[inCapital]) {
                    const isValid = validators[inCapital](formData[field])
                    if (isValid) errors[inCapital] = isValid
                }
            }
        }
    )
    return errors
}

const getFirstId = (intialData, errors) => {
    const errorsKeys = Object.keys(errors)
    const initialDataKeys = Object.keys(intialData)

    let first = ''

    for (let i = 0; i < initialDataKeys.length; i++) {
        if (errorsKeys.includes(capitalizeFirstLetter(initialDataKeys[i]))) {
            first = initialDataKeys[i]
            break
        }
    }
    return first
}
