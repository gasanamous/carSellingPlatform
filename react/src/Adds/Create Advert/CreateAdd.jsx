import CreateAddForm from './CreateAddForm'
import { Container } from "@mui/material"
import serverIP from '../../config'
export default function CreateAdd() {

    document.title = 'Sell your car'

    const initialData = {
        carManufacturer: '',
        carModel: '',
        productionYear: '',
        transmission: '',
        mileage: '',
        previousUse: '',
        carHealth: '',
        outerColor: '',
        upholstery: '',
        engineCapacity: '',
        engineCylinders: '',
        drivetrainPower : '',
        fuelType: '',
        fuelTankCapacity: '',
        price: '',
        licenseExpiry: '',
        addons: [],
        notes: '',
        carImages: []
    }

    const mainContainerProps = {
        maxWidth: 'md',
        style: {
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translate(-50%)',
            paddingBottom : '20px'
        }
    }
    const url = `${serverIP.ip}/adds/new_add`
    
    return (
        <Container {...mainContainerProps}>
            <CreateAddForm initialData={initialData} url={url}/>
        </Container>

    )
}
