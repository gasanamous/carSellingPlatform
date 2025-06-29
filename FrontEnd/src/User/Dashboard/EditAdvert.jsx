import { useState, useEffect } from "react"
import MyFormSelect from "../../static components/MyFormSelect"
import { Container, TextField, InputAdornment, FormControl, OutlinedInput, Tooltip, FormControlLabel, Checkbox, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import MyFormInput from "../../static components/MyFormInput"
import IconButton from '@mui/material/IconButton'
import swal from '@sweetalert/with-react';
import axios from "axios";
import serverIP from "../../config";
import styled from 'styled-components';
import CarImagesViewer from "../../Adds/Create Advert/CarImagesViewer";
import MyUploadInput from "../../static components/MyUploadInput";

const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
    font-size: 14px; 
`;

const mainContainerProps = {
    maxWidth: 'md',
    style: {
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translate(-50%)',
        paddingBottom: 20,
    }
}

const boxProps = {
    style: {
        border: 'solid 1px lightgray',
        padding: 30,
    }
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

export default function EditAdvertForm({ add }) {
    const [carImages, setCarImages] = useState(add.carImages)
    const [addons, setAddons] = useState(add.addons)
    const [notes, setNotes] = useState(add.notes)
    const [MyErrors, setMyErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState()

    const [formData, setFormData] = useState({
        general: add.general,
        fuel: add.fuel,
        engine: add.engine,
        priceAndLicense: add.priceAndLicense,
    })


    const handleChange = (evt) => {

        let { name, value, title } = evt.target;

        const category = getCategory(name);

        setFormData({ ...formData, [category]: { ...formData[category], [name]: value } })
    }

    const handleBlur = (evt, title = null) => {

        const { value } = evt.target;
        if (value.trim() == '')
            setMyErrors({ ...MyErrors, [title]: null })
        else
            setMyErrors({ ...MyErrors, [title]: null })
    }

    const handleBlurForNonSelectionInput = (evt) => {
        const { name, value, placeholder } = evt.target

        if (value.trim() == '')
            setMyErrors({ ...MyErrors, [placeholder]: null })
        else {
            const isValidInput = valdationInput[placeholder](value.trim())
            setMyErrors({ ...MyErrors, [placeholder]: isValidInput })
        }
    }

    const handleImages = (evt) => {
        const files = evt.target.files;
        let newImages = [];

        for (let i = 0; i < files.length; i++) {
            const image = files[i];
            const reader = new FileReader();

            reader.readAsDataURL(image);

            reader.onload = function handleOnLoadEnd(evt) {
                newImages.push(evt.target.result);
                setCarImages((prevImages) => [...prevImages, evt.target.result]);
                console.log('New Images: ', newImages);
            };
        }
    }

    const deleteImage = (img) => {
        let images = carImages

        images = images.filter(element => element != img)

        if (images.length == 0) {
            swal({
                icon: 'error',
                text: 'Sorry, your advertisement must has at least one image',
            })
            return
        }
        setCarImages(images)

    }

    const handleAddAddon = (addon, value) => {
        value ? setAddons([...addons, addon]) : setAddons(addons.filter(element => element !== addon))
    };

    const handleNotes = (evt) => { setNotes(evt.target.value.trim()) }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
       /* const emptyFields = areRequiredFieldsEmpty(formData, carImages, MyErrors)
        console.log(MyErrors)
        if (Object.keys(emptyFields).length != 0) {
            setMyErrors(emptyFields)
            document.getElementById(Object.keys(emptyFields)[0]).scrollIntoView({ behavior: 'smooth' })
            swal({
                icon: 'error',
                text: 'Please fill out all required field',
            })
            return
        }
        let e = 0
        Object.values(MyErrors).forEach(
            val => {
                if (val != null) {
                    e = 1
                }
            }
        )
        if (e == 1) {
            document.getElementById(Object.entries(MyErrors)[0][0]).scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
        }*/

        setLoading(true)
        axios.defaults.withCredentials = true
        await axios.post(`${serverIP.ip}/adds/user/my/adds/edit/${add._id}`, { details: formData, addons: addons, images: carImages, notes: notes })
            .then(
                () => swal({
                    icon: 'success',
                    text: 'Advertisement saved',
                })
            )
            .catch(
                e => {
                    if (e.response.status == 422)
                        setMyErrors(e.response.data.errors)
                    else
                        swal({
                            text: e.response.data,
                            icon: 'error'
                        })
                    console.log(e.response.data)
                }
            )
        setLoading(false)

    }

    const mainContainerProps = {
        maxWidth: 'md',
        style: {
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: 'translate(-50%)',
            paddingBottom: 20,
        }
    }

    const boxProps = {
        style: {
            border: 'solid 1px lightgray',
            padding: 30,
        }
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

    return (
        <Container {...mainContainerProps}>

            <div {...boxProps} key='basics-box'>
                <h3>Basic</h3>
                <MyFormSelect value={formData.general.company} required={true} name='company' title='Car manufacturer *' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Car manufacturer' list={companies} />
                <MyFormInput value={formData.general.model} required={true} name='model' title='Model' handleChange={handleChange} handleBlur={handleBlurForNonSelectionInput} placeholder='Model' MyErrors={MyErrors} />
                <MyFormSelect value={formData.general.year} required={true} name='year' title='Production year *' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Production year' list={years} />
                <MyFormSelect value={formData.general.transmission} required={true} name='transmission' title='Transmission *' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Transmission' list={['Automatic', 'Manual']} />
                <MyFormInput value={formData.general.mileage} required={true} name='mileage' title='Mileage' handleChange={handleChange} handleBlur={handleBlurForNonSelectionInput} MyErrors={MyErrors} placeholder='Mileage' startAdornment={<InputAdornment position="start">Km</InputAdornment>} />
                <MyFormSelect value={formData.general.previousUse} required={true} name='previousUse' title='Previous use *' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Previous use' list={previousUse} />
                <MyFormSelect value={formData.general.health} required={true} name='health' title='Health *' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Health' list={health} />
                <MyFormSelect value={formData.general.outerColor ? formData.general.outerColor : ''} name='outerColor' title='Outer color' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Outer color' list={colors} />
                <MyFormSelect value={formData.general.upholstery ? formData.general.upholstery : ''} name='upholstery' title='Upholstery' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Upholstery' list={['Leather', 'Fabric']} />
            </div>

            <div {...boxProps} key='engine-box'>
                <h3>Engine</h3>
                <MyFormInput value={formData.engine.motorCapacity} required={true} name='motorCapacity' title='Capacity' handleChange={handleChange} handleBlur={handleBlurForNonSelectionInput} MyErrors={MyErrors} placeholder='Capacity' startAdornment={<InputAdornment position="start">CC</InputAdornment>} />
                <MyFormInput value={formData.engine.motorCylinders} required={true} name='motorCylinders' title='Cylinders' handleChange={handleChange} handleBlur={handleBlurForNonSelectionInput} MyErrors={MyErrors} placeholder='Cylinders' />
                <MyFormSelect value={formData.engine.drivetrain} required={true} name='drivetrain' title='Drivetrain power *' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Drivetrain power' list={drivetrain} />
            </div>

            <div {...boxProps} key='fuel-box'>
                <h3>Fuel</h3>
                <MyFormSelect value={formData.fuel.fuelType} required={true} name='fuelType' title='Type *' handleChange={handleChange} handleBlur={handleBlur} MyErrors={MyErrors} placeholder='Fuel type' list={fuelType} />
                <MyFormInput value={formData.fuel.fuelTankCapacity} required={true} name='fuelTankCapacity' title='Tank capacity' handleChange={handleChange} handleBlur={handleBlurForNonSelectionInput} MyErrors={MyErrors} placeholder='Tank capacity' startAdornment={<InputAdornment position="start">L</InputAdornment>} />
            </div>


            <div {...boxProps} key='License and price-box'>
                <h3>License and price</h3>
                <MyFormInput required={true} value={formData.priceAndLicense.price} name='price' title='Price' handleChange={handleChange} handleBlur={handleBlurForNonSelectionInput} MyErrors={MyErrors} placeholder='Price' startAdornment={<AttachMoneyIcon />} />
                <MyFormInput required={false} value={formData.priceAndLicense.licenseExpiry} type="date" name='licenseExpiry' title='Licnese expiry' handleChange={handleChange} handleBlur={null} MyErrors={null} placeholder='Licnese expiry' />
            </div>

            <div {...boxProps} key='addons-box'>
                <h3>Car addons</h3>
                <Grid container>
                    {addonsList.map((addon) => (
                        <Grid key={addon} item xs={6} sm={6} md={6} lg={4} xl={4} >
                            <FormControlLabel
                                control={<Checkbox color='success' checked={addons.includes(addon)} onChange={(e) => handleAddAddon(addon, e.target.checked)} name={addon} />}
                                label={<StyledB>{addon}</StyledB>}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>

            <div {...boxProps}>
                <h3>Extra details or notes</h3>
                <textarea
                    defaultValue={add.notes}
                    className="form-control extraNotes"
                    style={{ borderRadius: 0 }}
                    rows={5}
                    onChange={handleNotes}
                    name="extraNotes"
                    id="exampleFormControlTextarea1"
                    placeholder="Feel free to share any additional information about your car here."
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
                Save
            </LoadingButton>
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
            "fuelTankCapacity": 'Tank capacity',
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
const valdationInput = {
    'Model': model => /^[a-zA-Z][a-zA-Z0-9\s-]*[a-zA-Z0-9]$/.test(model) ? null : 'Please provide a valid car model ex(BMW X5, F-80, Q-8)',
    'Mileage': mileage => /^(?!.*\.$)\d+(\.\d+)?$/.test(mileage) ? null : 'Please provide a valid mileage number (ex: 0.5, 10.5)',
    'Capacity': capacity => /^\d+$/.test(capacity) ? null : 'Please provide a valid engine capacity',
    'Cylinders': cylinders => /^\d+$/.test(cylinders) ? null : 'Please provide a valid engine cylinders number',
    'Tank capacity': capacity => /^\d+$/.test(capacity) ? null : 'Please provide a valid Fuel tank capacity number, (ex: 83)',
    'Price': price => /^\d+$/.test(price) ? null : 'Please provide a valid price, (ex: 31999)',
}
const health = ['Good', 'Excellent', 'Toast'].sort()
const companies = ["Acura", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac", "Chery", "Chevrolet", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hummer", "Hyundai", "Hutchinson", "Jaguar", "Jeep", "Kia", "Lada", "Land Rover", "Lexus", "Lincoln", "Lotus", "Maserati", "Mazda", "Mercedes-Benz", "Mitsubishi", "Nissan", "Pontiac", "Porsche", "Renault", "Rolls-Royce", "Saab", "SEAT", "Skoda", "Smart", "Subaru", "Suzuki", "Tata", "Tesla", "Toyota", "Volkswagen", "Volvo"].sort();
const years = Array.from({ length: 45 }, (_, i) => (2024 - i).toString());
const previousUse = ['Rental', 'Goverment', 'Private', 'Taxi'].sort()
const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Cyan', 'Magenta', 'Teal', 'Brown', 'Black', 'Gray', 'White'].sort()
const drivetrain = ['Front-wheel Drive', 'Rear-wheel Drive', '4-wheel Drive'].sort()
const fuelType = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Hydrogen'].sort()