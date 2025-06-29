import { Button, Grid, Select, MenuItem } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import MyFormSelect from "../../static components/MyFormSelect";
import MyFormInput from "../../static components/MyFormInput";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import selectionLists from "../Create Advert/selectionLists";
import './CardStyle.css'
const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
    font-size: 14px; 
    margin-top : 10px;
`;


const menuItemProps = {
    sx: {
        '&:hover': {
            backgroundColor: 'green',
            color: 'white'
        }
    }
}
const buttonProps = {
    sx: {
        marginTop: '15px',
        backgroundColor: 'green',
        textTransform: 'none',
        padding: 2,
        ':hover': { backgroundColor: '#006400' },
        borderRadius: '25px'
    }
}

export default function SeachBox({ searchFormData, handleChange, handleSearch }) {

    return (
        <Grid item className="card" sx={{ marginBottom: 2, padding: 3,pt : 0, backgroundColor: 'white' }}>
            <form style={{ width: '100%' }}>
                <StyledB  style={{ display: 'block', fontSize: 23,  marginBottom : '5px' }}>Search for a car</StyledB>
                <MyFormSelect required={false} placeholder='Select company' handleChange={handleChange} value={searchFormData.carManufacturer} list={selectionLists.companies} name='carManufacturer' title='Company' />
                <MyFormSelect required={false} placeholder='Select fuel Type' handleBlur={null} handleChange={handleChange} value={searchFormData.fuelType} list={selectionLists.fuelType} name='fuelType' title='Fuel type' />
                <MyFormSelect required={false} placeholder='Select transmission type' handleBlur={null} handleChange={handleChange} value={searchFormData.transmission} list={['Automatic', 'Manual']} name='transmission' title='Transmission type' />
                <MyFormSelect required={false} placeholder='Select production year' handleBlur={null} handleChange={handleChange} value={searchFormData.productionYear} list={selectionLists.years} name='productionYear' title='Production year' />
                <MyFormInput value={searchFormData.minPrice} required={false} type="number" title='Min price' handleChange={handleChange} name='minPrice' startAdornment={<AttachMoneyIcon />} />
                <MyFormInput value={searchFormData.maxPrice} required={false} type="number" title='Max price' handleChange={handleChange} name='maxPrice' startAdornment={<AttachMoneyIcon />} />
                <Button type='submit' onClick={handleSearch} endIcon={<SearchIcon />} fullWidth variant='contained' {...buttonProps}>
                    <h6 className='font' style={{ margin: 0 }}>Search</h6>
                </Button >
            </form>

        </Grid>
    )
}

const fuelTypeArray = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Hydrogen'].sort()
const companies = [
    "Toyota",
    "Ford",
    "BMW",
    "Mercedes-Benz",
    "Honda",
    "Chevrolet",
    "Nissan",
    "Audi",
    "Volkswagen",
    "Kia",
    "Hyundai",
    "Jeep",
    "Lexus",
    "Mitsubishi",
    "Volvo",
    "Subaru",
    "Jaguar",
    "Porsche",
    "Cadillac",
    "Land Rover",
    "Tesla",
    "SEAT",
    "Mazda",
    "Suzuki",
    "Renault",
    "Bugatti",
    "Genesis",
    "Rolls-Royce",
    "Bentley",
    "Fiat",
    "Maserati",
    "Aston Martin",
    "Lotus",
    "Skoda",
    "Smart",
    "Chery",
    "Lincoln",
    "Tata",
    "Hummer",
    "Saab",
    "GMC",
    "Dodge",
    "Ferrari",
    "Pontiac",
    "Acura",
    "Hutchinson",
    "Lada"
].sort();

const years = Array.from({ length: 45 }, (_, i) => (2024 - i).toString());


