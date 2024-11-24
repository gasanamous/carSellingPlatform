import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip, Button } from '@mui/material';
import axios from 'axios';
import serverIP from '../../config';
import swal from '@sweetalert/with-react';
import SyncIcon from '@mui/icons-material/Sync';
import { LoadingButton } from '@mui/lab';
import AddCard from '../../Adds/AddView/AddCard';

const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'carName', headerName: 'Car name', width: 200 },
    { field: 'post_date', headerName: 'Posted On', width: 130 },
    { field: 'fullname', headerName: 'Owner Name', width: 200 },
    { field: 'location', headerName: 'Owner Location', width: 160 },
    { field: 'phoneNumber', headerName: 'Owner Phone Number', width: 200 },
];

export default function AdvertisementsTable({ advertisements, thisUser }) {

    const [adds, setAdds] = React.useState(advertisements)
    const [selectedAdvertisements, setSelectedAdvertisements] = React.useState([])
    const [rows, setRows] = React.useState(getRows(advertisements))
    const [refreshLoading, setRefreshLoading] = React.useState(false)

    const handleRowSelection = (newSelection) => {

        if (newSelection.length == 0) setSelectedAdvertisements([])
        const selectedAdvertisementsTemp = []

        newSelection.forEach(selection => {
            const selectedRow = rows.find(row => row.id == selection)
            const selectedAdd = adds.find(add => add._id == selectedRow.addId)
            selectedAdvertisementsTemp.push(selectedAdd)
        })

        setSelectedAdvertisements(prev => (selectedAdvertisementsTemp))
    }

    const deleteSelectedAdvertisements = async () => {
        const text = selectedAdvertisements.length > 1 ? `Are you sure you want to delete this ${selectedAdvertisements.length} advertisements?` : `Are you sure you want to delete this advertisment?`
        swal({
            title: 'Are you sure?',
            text: text,
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
        }).then(async (value) => {
            if (value != 'delete') return
            axios.defaults.withCredentials = true
            try {

                const response = await axios.post(`${serverIP.ip}/administration/delete_adds`, { addsToDelete: selectedAdvertisements })
                swal(
                    {
                        icon: 'success',
                        text: `A  ${response.data.deletedCount} ${selectedAdvertisements.length == 1 ? `advertisement` : `advertisements`} deleted successfully`
                    }
                ).then(
                    () => window.location.reload()
                )

            } catch (error) {
                swal(
                    {
                        icon: 'error',
                        text: `An error occured during deleting ${selectedAdvertisements.length == 1 ? `advertisement` : `advertisements`}`
                    }
                )
            }
        })

    }

    const refresh = async () => {
        axios.defaults.withCredentials = true
        try {
            setRefreshLoading(true)
            const response = await axios.post(`${serverIP.ip}/administration/getInfo`);
            setAdds(prev => (response.data.adds))
            setRows(getRows(response.data.adds))
            setRefreshLoading(false)
        } catch (error) {
            setRefreshLoading(false)
        }
    }

    return (
        <>
            <div id='table'
                className='accounts-table adds-table'
                style={{ width: '100%' }}>

                <Tooltip
                    placement='top'
                    title={`delete ${selectedAdvertisements.length} advertisements`}>

                    <Button
                        variant='contained'
                        color='error'
                        disabled={selectedAdvertisements.length == 0}
                        sx={{ marginBottom: 1, textTransform: 'none' }}
                        onClick={deleteSelectedAdvertisements}
                        endIcon={<DeleteIcon />}
                    >Delete</Button>

                </Tooltip>

                <Tooltip
                    placement='top'
                    title='Refresh'>
                    <LoadingButton
                        variant='contained'
                        color='info'
                        onClick={refresh}
                        loading={refreshLoading}
                        sx={{ marginBottom: 1, textTransform: 'none', marginLeft: 3 }}
                        endIcon={<SyncIcon />}
                    >
                        Refresh
                    </LoadingButton>
                </Tooltip>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    density='standard'
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => handleRowSelection(newSelection)}
                />
            </div>
            {
                selectedAdvertisements.length > 0 && (
                    <div
                        className='accounts-table'
                        style={{ marginTop: '10px' }}>
                        <h5>Selected Advertisements</h5>
                        {
                            selectedAdvertisements.map((add, index) => (
                                <AddCard
                                    add={add}
                                    key={add._id}
                                    index={index}
                                    id={add._id}
                                    user={thisUser} />
                            ))
                        }
                    </div>
                )
            }

        </>
    );
}
const getRows = (adds) => {
    const allAdds = adds
    const rows = []
    let id = 1

    allAdds.forEach(add => {
        rows.push({
            id: id,
            carName: `${add.productionYear} ${add.carManufacturer} ${add.carModel}`,
            productionYear: add.productionYear,
            post_date: add.post_date,
            fullname: `${add.user.firstname} ${add.user.lastname}`,
            phoneNumber: `${add.user.phoneNumber}`,
            location: add.location,
            addId: add._id
        })
        id++
    })
    return rows
}

