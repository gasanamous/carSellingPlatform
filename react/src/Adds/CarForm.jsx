import React, { useState } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Grid from '@mui/material/Grid';
import { TextField, Input, InputAdornment } from '@mui/material';
import styled from 'styled-components';

const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 15px; /* Adjust font size for medium screens */
  }
  @media (768px <= width <= 992px) {
    font-size: 16px; /* Adjust font size for medium screens */
  }
  @media (992px <= width) {
    font-size: 16px; /* Adjust font size for medium screens */
  }
`;

export default function CarForm() {

  const [formData, setFormData] = useState({
    company: '',
    model: '',
    year: '',
    transmission: '',
    motorCapacity:'',
    motorCylinders : '',
    turbocharged: '',
    horsepower: '',
    motorTorque: '',
    fuelTankCapacity: '',
    cityFuelEfficiency: '',
    highwayEfficiency: '',
    drivetrain: '',
    outerColor: '',
    upholstery:'',
    fuleType:'',
    price: '',
    mileage: '',
    health: '',
    previousUse:'',
    images:'',
    wheelSize:'',
    wheelType:'',
    licenseAndInsuranceExpiry:'',
    licenseAndInsuranceExpiryImage:'',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    console.log(formData.company)
    console.log(formData.model)
    console.log(formData.year)
    console.log(formData.transmission)
    console.log(formData.fuleType)
    console.log(formData.price)
    console.log(formData.mileage)
    console.log(formData.drivetrain)
    console.log(formData.outerColor)
    console.log(formData.upholstery)

    
  };

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
  ];

  const years = Array.from({ length: 45 }, (_, i) => (2024 - i).toString());

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "5px" }}>

        {/* First Grid Container */}
        <Grid container justifyContent="center" xs={10} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ backgroundColor: 'rgb(247, 247, 247)', marginTop: '5px' }}>
          <Grid item xs={12} >
            <InputLabel sx={{ color: "black", marginBottom: '5px' }} id="company-label" >General Car Details</InputLabel>
          </Grid>

          {/* CAR COMPANY SELECT */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Companies *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="company-label"
                id="company-select"
                value={formData.company}
                onChange={handleChange}
                name="company" // Fix here
              >
                {companies.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* CAR MODEL SELECT */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Models *</StyledB>
              <Input required
                sx={{ color: "black" }}
                // labelId="model-label"
                id="model-select"
                value={formData.model}
                onChange={handleChange}
                name="model" // Fix here
              />
            </FormControl>
          </Grid>

          {/* Production Year SELECT */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Production Year *</StyledB>
              <Select required
                sx={{ color: "black" }}
                // labelId="year-label"
                id="year-select"
                value={formData.year}
                onChange={handleChange}
                name="year" // Fix here
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Gear SELECT */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Transmission *</StyledB>
              <Select
                sx={{ color: "black" }}
                labelId="transmission-label"
                id="transmission-select"
                value={formData.transmission}
                onChange={handleChange}
                name="transmission" // Fix here
              >
                <MenuItem value="manual">Manual</MenuItem>
                <MenuItem value="automatic">Automatic</MenuItem>
              </Select>
            </FormControl>
          </Grid>


           {/*  mileage SELECT */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Mileage *</StyledB>
              <Input required
                startAdornment={<InputAdornment position="start">km</InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="mileage-label"
                id="mileage-input"
                value={formData.mileage}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                
                name="mileage" // Fix here
              />
            </FormControl>
          </Grid>



          {/* color SELECT */}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Color *</StyledB>
              <Input required
                fullWidth
                sx={{ color: "black" }}
                // labelId="outerColor-label"
                id="outerColor-input"
                value={formData.outerColor}
                onChange={handleChange}
                name="outerColor" // Fix here
              />
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Upholstery *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="upholstery-label"
                id="upholstery-select"
                value={formData.upholstery}
                onChange={handleChange}
                name="upholstery" // Fix here
              >
                <MenuItem value="leather">Leather</MenuItem>
                <MenuItem value="fabric">Fabric</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
        </Grid>
      </div>





















      <div style={{marginTop:'50px', display: 'flex', justifyContent: 'center' }}>
        <Grid container justifyContent="center" xs={10} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ backgroundColor: 'rgb(247, 247, 247)', marginTop: '5px' }}>
          <Grid item xs={12} >
            <StyledB>Engine Details </StyledB>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ marginTop: '5px' }}>
              <StyledB>Motor Capacity *</StyledB>
              <Input
                required
                startAdornment={<InputAdornment position="start"></InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="motorCapacity-label"
                id="motorCapacity-input"
                value={formData.motorCapacity}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                name="motorCapacity" // Fix here
              />
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Motor Cylinders *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="motorCylinders-label"
                id="motorCylinders-select"
                value={formData.motorCylinders}
                onChange={handleChange}
                name="motorCylinders" // Fix here
              >
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="8">8</MenuItem>
              </Select>
            </FormControl>
          </Grid>


          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Turbo charge *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="turbocharged-label"
                id="turbocharged-select"
                value={formData.turbocharged}
                onChange={handleChange}
                name="turbocharged" // Fix here
              >
                <MenuItem value="Single-Turbo">Single-Turbo</MenuItem>
                <MenuItem value="Twin-Turbo">Twin-Turbo</MenuItem>
                <MenuItem value="Twin-Scroll Turbo">Twin-Scroll Turbo</MenuItem>
                <MenuItem value="Variable Geometry Turbo">Variable Geometry Turbo</MenuItem>
                <MenuItem value="Variable Twin Scroll Turbo">Variable Twin Scroll Turbo</MenuItem>
                <MenuItem value="Electric Turbo">Electric Turbo</MenuItem>
              </Select>
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Horsepower *</StyledB>
              <Input required
                startAdornment={<InputAdornment position="start">hp</InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="horsepower-label"
                id="horsepower-input"
                value={formData.horsepower}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                
                name="horsepower" // Fix here
              />
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Motor Torque *</StyledB>
              <Input required
                startAdornment={<InputAdornment position="start"></InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="motorTorque-label"
                id="motorTorque-input"
                value={formData.motorTorque}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                
                name="motorTorque" // Fix here
              />
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Fuel Tank Capacity *</StyledB>
              <Input required
                startAdornment={<InputAdornment position="start">L</InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="fuelTankCapacity-label"
                id="fuelTankCapacity-input"
                value={formData.fuelTankCapacity}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                
                name="fuelTankCapacity" // Fix here
              />
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Fule Type *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="fuleType-label"
                id="fuleType-select"
                value={formData.fuleType}
                onChange={handleChange}
                name="fuleType" // Fix here
              >
                <MenuItem value="Gasoline ">Gasoline </MenuItem>
                <MenuItem value="Diesel">Diesel</MenuItem>
                <MenuItem value="Electric">Electric</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
                <MenuItem value="Hydrogen">Hydrogen</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>




















      <div style={{marginTop:'50px', display: 'flex', justifyContent: 'center' }}>
        <Grid container justifyContent="center" xs={10} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ backgroundColor: 'rgb(247, 247, 247)', marginTop: '5px' }}>
          <Grid item xs={12} >
            <StyledB>Additional Features </StyledB>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth sx={{ marginTop: '5px' }}>
              <StyledB>City Fuel Efficiency *</StyledB>
              <Input
                required
                startAdornment={<InputAdornment position="start">Km/L</InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="cityFuelEfficiency-label"
                id="cityFuelEfficiency-input"
                value={formData.cityFuelEfficiency}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                name="cityFuelEfficiency" // Fix here
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth sx={{ marginTop: '5px' }}>
              <StyledB>Highway Efficiency *</StyledB>
              <Input
                required
                startAdornment={<InputAdornment position="start">Km/L</InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="highwayEfficiency-label"
                id="highwayEfficiency-input"
                value={formData.highwayEfficiency}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                name="highwayEfficiency" // Fix here
              />
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Drivetrain *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="drivetrain-label"
                id="drivetrain-select"
                value={formData.drivetrain}
                onChange={handleChange}
                name="drivetrain" // Fix here
              >
                <MenuItem value="front-wheel-drive">Front-wheel Drive</MenuItem>
                <MenuItem value="rear-wheel-drive">Rear-wheel Drive</MenuItem>
                <MenuItem value="4-wheel-drive">4-wheel Drive</MenuItem>
              </Select>
            </FormControl>
          </Grid>


          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Wheel Size *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="wheelSize-label"
                id="wheelSize-select"
                value={formData.wheelSize}
                onChange={handleChange}
                name="wheelSize" // Fix here
              >
                <MenuItem value="14">14 inches</MenuItem>
                <MenuItem value="15">15 inches</MenuItem>
                <MenuItem value="16">16 inches</MenuItem>
                <MenuItem value="17">17 inches</MenuItem>
                <MenuItem value="18">18 inches</MenuItem>
                <MenuItem value="19">19 inches</MenuItem>
                <MenuItem value="20">20 inches</MenuItem>
              </Select>
            </FormControl>
          </Grid>


          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Wheel Type *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="wheelType-label"
                id="wheelType-select"
                value={formData.wheelType}
                onChange={handleChange}
                name="wheelType" // Fix here
              >
                <MenuItem value="steel">Steel</MenuItem>
                <MenuItem value="alloy">Alloy</MenuItem>
                
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </div>



















      <div style={{marginTop:'50px', display: 'flex', justifyContent: 'center' }}>
        <Grid container justifyContent="center" xs={10} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ backgroundColor: 'rgb(247, 247, 247)', marginTop: '5px' }}>
          <Grid item xs={12} >
            <StyledB>this filed is for the pic and licinse  </StyledB>
          </Grid>

          

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ marginTop: '5px' }}>
              <StyledB>place holder *</StyledB>
              <Input
                required
                startAdornment={<InputAdornment position="start">Km/L</InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="highwayEfficiency-label"
                id="highwayEfficiency-input"
                value={formData.highwayEfficiency}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                name="highwayEfficiency" // Fix here
              />
            </FormControl>
          </Grid>




        </Grid>
      </div>

























      <div style={{marginTop:'50px', display: 'flex', justifyContent: 'center' }}>
        <Grid container justifyContent="center" xs={10} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ backgroundColor: 'rgb(247, 247, 247)', marginTop: '5px' }}>
          <Grid item xs={12} >
            <StyledB>Health and Pricing </StyledB>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <StyledB>Health *</StyledB>
              <Select
                fullWidth
                sx={{ color: "black" }}
                // labelId="health-label"
                id="health-select"
                value={formData.health}
                onChange={handleChange}
                name="health" // Fix here
              >
                <MenuItem value="excellent">Excellent</MenuItem>
                <MenuItem value="good">Good</MenuItem>
                <MenuItem value="Fair">Fair</MenuItem>
                <MenuItem value="Poor">Poor</MenuItem>
            
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth sx={{ marginTop: '5px' }}>
              <StyledB>Price *</StyledB>
              <Input
                required
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                fullWidth
                sx={{ color: "black" }}
                // labelId="price-label"
                id="price-input"
                value={formData.price}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Prevent input of non-numeric characters
                  const regex = new RegExp("^[0-9]*$");
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                name="price" // Fix here
              />
            </FormControl>
          </Grid>




        </Grid>
      </div>
    </>
  );
}


