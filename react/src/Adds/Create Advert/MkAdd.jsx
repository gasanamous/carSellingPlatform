import { useState } from "react"
import MyFormSelect from "../../static components/MyFormSelect"
import { Container, Button, InputAdornment, FormControl, OutlinedInput, Tooltip, FormControlLabel, Checkbox, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MyFormInput from "../../static components/MyFormInput"
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';
import styled from 'styled-components';
import swal from '@sweetalert/with-react';
import { useNavigate } from "react-router-dom";
import serverIP from "../../config";
import MyUploadInput from "../../static components/MyUploadInput";
import CarImagesViewer from "./CarImagesViewer";
import selectionLists from "./selectionLists";
import validators from "./validators";

const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
    font-size: 14px; 
`;
export default function MkAdd() {

    document.title = 'Sell your car'
    const [formData, setFormData] = useState({
        general: {
            company: '',
            model: '',
            year: '',
            previousUse: '',
            transmission: '',
            mileage: '',
            health: '',
            outerColor: '',
            upholstery: '',
        },
        engine: {
            motorCapacity: '',
            motorCylinders: '',
            drivetrain: '',
        },
        priceAndLicense: {
            price: '',
            licenseExpiry: ''
        },
        fuel: {
            fuelType: '',
            fuelTankCapacity: '',
        },
    })
    const [carImages, setCarImages] = useState([])
    const [addons, setAddons] = useState([])
    const [notes, setNotes] = useState('')
    const [MyErrors, setMyErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = (evt) => {

        let { name, value } = evt.target;
        const category = getCategory(name);
        setFormData({ ...formData, [category]: { ...formData[category], [name]: value } })
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
                setCarImages([...carImages, ...loadedImages]);
                console.log(carImages.length)
            })
            .catch((error) => {
                setMyErrors({ ...MyErrors, ['Car images']: 'Error while uploading' });
            });
    }

    const deleteImage = (img) => {
        let images = carImages

        images = images.filter(element => element != img)

        setCarImages(images)

    }

    const handleBlur = (evt, title) => {
        const { value, placeholder = null } = evt.target

        if (placeholder) {
            const isValidInput = validators[placeholder](value)
            if (isValidInput == null || value.trim() == '') {
                const updatedErrors = { ...MyErrors };
                delete updatedErrors[placeholder];
                setMyErrors(updatedErrors);
            }
            else
                setMyErrors({ ...MyErrors, [placeholder]: isValidInput })
        }
        else
            setMyErrors({ ...MyErrors, [title]: null })
    }

    const handleAddAddon = (addon, value) => {
        value ? setAddons([...addons, addon]) : setAddons(addons.filter(element => element !== addon))
    };
    const handleNotes = (evt) => { setNotes(evt.target.value) }

    const handleSubmit = (evt) => {
        evt.preventDefault()
        console.log(formData)
        const emptyFields = areRequiredFieldsEmpty(formData, carImages, MyErrors)
        if (Object.keys(emptyFields).length != 0) {
            setMyErrors(emptyFields)
            document.getElementById(Object.keys(emptyFields)[0]).scrollIntoView({ behavior: 'smooth', block: 'center' })
            swal({
                icon: 'error',
                text: 'Please fill out all required field',
            })
            return
        }

        axios.defaults.withCredentials = true
        axios.post(`${serverIP.ip}/adds/new_add`, { details: formData, addons: addons, images: carImages, notes: notes })
            .then(res => {
                swal({
                    icon: 'success',
                    text: 'Advertisement saved and posted successfully',
                }).then(() => navigate('../user/my/adds'))

            })
            .catch(e => {
                if (e.response && e.response.status == 401) {
                    swal({
                        icon: 'error',
                        text: 'You must be logged in to be able to post advertisement',
                        show: true
                    })
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

    const mainContainerProps = {
        maxWidth: 'md',
        style: {
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: 'translate(-50%)',
            paddingBottom: 20,
            boxShadow: '0px 0px 12px 0px rgba(0,0,0,0.1)',
            backgroundColor: 'white'
        }
    }

    const boxProps = {
        style: {
            borderBottom: 'solid 1px lightgray',
            padding: 30,

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

    return (
        <Container {...mainContainerProps}>

            <form action="" >
                <h2 style={{ padding: 5 }}>Sell Your Car</h2>
                <h6>* fields are required</h6>

                <div {...boxProps} key='basics-box'>
                    <h3>Basic</h3>
                    <MyFormSelect value={formData.general.company} required={true} name='company' title='Car manufacturer' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Car manufacturer' list={selectionLists.companies} />
                    <MyFormInput value={formData.general.model} required={true} name='model' title='Model' handleChange={handleChange} handleBlur={handleBlur} placeholder='Model' MyErrors={MyErrors} />
                    <MyFormSelect value={formData.general.year} required={true} name='year' title='Production year' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Production year' list={selectionLists.years} />
                    <MyFormSelect value={formData.general.transmission} required={true} name='transmission' title='Transmission' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Transmission' list={['Automatic', 'Manual']} />
                    <MyFormInput value={formData.general.mileage} required={true} name='mileage' title='Mileage' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Mileage' startAdornment={<InputAdornment position="start">Km</InputAdornment>} />
                    <MyFormSelect value={formData.general.previousUse} required={true} name='previousUse' title='Previous use' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Previous use' list={selectionLists.previousUse} />
                    <MyFormSelect value={formData.general.health}  name='health' title='Health' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Health' list={selectionLists.health} />
                    <MyFormSelect value={formData.general.outerColor} required={true} name='outerColor' title='Outer color' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Outer color' list={selectionLists.colors} />
                    <MyFormSelect value={formData.general.upholstery} name='upholstery' title='Upholstery' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Upholstery' list={['Leather', 'Fabric']} />
                </div>

                <div {...boxProps} key='engine-box'>
                    <h3>Engine</h3>
                    <MyFormInput value={formData.engine.motorCapacity} required={true} name='motorCapacity' title='Capacity' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Capacity' startAdornment={<InputAdornment position="start">CC</InputAdornment>} />
                    <MyFormInput value={formData.engine.motorCylinders} required={true} name='motorCylinders' title='Cylinders' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Cylinders' />
                    <MyFormSelect value={formData.engine.drivetrain} required={true} name='drivetrain' title='Drivetrain power' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Drivetrain power' list={selectionLists.drivetrain} />
                </div>

                <div {...boxProps} key='fuel-box'>
                    <h3>Fuel</h3>
                    <MyFormSelect value={formData.fuel.fuelType} required={true} name='fuelType' title='Fuel type' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Fuel type' list={selectionLists.fuelType} />
                    <MyFormInput value={formData.fuel.fuelTankCapacity} required={true} name='fuelTankCapacity' title='Fuel tank capacity' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Tank capacity' startAdornment={<InputAdornment position="start">L</InputAdornment>} />
                </div>


                <div {...boxProps} key='License and price-box'>
                    <h3>License and price</h3>
                    <MyFormInput required={true} value={formData.priceAndLicense.price} name='price' title='Price' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Price' startAdornment={<AttachMoneyIcon />} />
                    <MyFormInput required={false} value={formData.priceAndLicense.licenseExpiry} type="date" name='licenseExpiry' title='Licnese expiry' handleChange={handleChange} handleBlur={handleBlur} MyErrors={null} placeholder='Licnese expiry' />
                </div>

                <div {...boxProps}>
                    <h3>Car addons</h3>
                    <Grid container>
                        {addonsList.map((addon) => (
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
                        onChange={handleNotes}
                        name="extraNotes"
                        id="exampleFormControlTextarea1"
                        placeholder="Feel free to share any additional information about your car here."
                        value={notes}
                    />
                </div>

                <div {...boxProps}>
                    <h3>Car images</h3>
                    <MyUploadInput multiple={true} name='carImages' title='Car images' required={true} handleChange={handleImages} MyErrors={MyErrors} />
                    {carImages.length > 0 &&
                        (
                            <>
                                <h5 style={{ textAlign: 'center' }}>Images uploded</h5>
                                <CarImagesViewer deleteImage={deleteImage} images={carImages} />
                            </>
                        )
                    }

                </div>

                <LoadingButton fullWidth type="submit" onClick={handleSubmit} endIcon={<SaveIcon />} loadingPosition="end"
                    loading={loading}
                    variant="contained"
                    {...loadingButtonProps}
                >
                    Save and post
                </LoadingButton>
            </form>
        </Container>


    )
}

const getCategory = (fieldName) => {
    if (engine.includes(fieldName)) {
        return 'engine';
    } else if (general.includes(fieldName)) {
        return 'general';
    } else if (fuel.includes(fieldName)) {
        return 'fuel';
    } else if (priceAndLicense.includes(fieldName)) {
        return 'priceAndLicense';
    }
};

const general = [
    "company",
    "model",
    "year",
    "transmission",
    "outerColor",
    "upholstery",
    "mileage",
    "previousUse",
    "health",
    "extraNotes"
];

const engine = [
    "motorCapacity",
    "motorCylinders",
    "drivetrain"
];

const fuel = [
    "fuelTankCapacity",
    "fuelType",
];

const priceAndLicense = [
    "price",
    "licenseExpiry",
];

const addonsList = [
    'Sensors',
    'Steering Control',
    'Screen',
    'Fuel Saving System',
    'Keyless Entry',
    'Electric Handbrake',
    'Power Folding Mirrors',
    'Seat Heating',
    'Parking Assistance',
    'Lane Departure Warning',
    'Tow Hook',
    'Cruise Control',
    'Sunroof',
    'Electric Seats',
    'Electric Trunk',
    'Steering Heating',
];

const areRequiredFieldsEmpty = (formData, carImages, MyErrors) => {
    const requiredForm = {
        general: {
            "company": 'Car manufacturer',
            "model": 'Model',
            "year": 'Production year',
            "transmission": 'Transmission',
            "mileage": 'Mileage',
            "previousUse": 'Previous use',
            "health": 'Health',
        },
        engine: {
            "motorCapacity": 'Capacity',
            "motorCylinders": 'Cylinders',
            "drivetrain": 'Drivetrain power',
        },
        fuel: {
            "fuelTankCapacity": 'Fuel tank capacity',
            "fuelType": 'Fuel type',
        },
        priceAndLicense: {
            "price": 'Price',
        }
    }
    const emptyFields = {}

    Object.entries(requiredForm).forEach(([mainKey, subValues]) => {
        const parent = mainKey
        Object.entries(subValues).forEach(([key, value]) => {
            if (!formData[parent][key]) {
                emptyFields[value] = value + ' is required'
            }
        })
    })
    if (carImages.length == 0) {
        emptyFields['Car images'] = 'Car images is required'
    }
    return emptyFields

}
