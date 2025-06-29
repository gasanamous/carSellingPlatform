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

const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'firstname', headerName: 'First name', width: 130 },
    { field: 'lastname', headerName: 'Last name', width: 130 },

    { field: 'city', headerName: 'City', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phoneNumber', headerName: 'PhoneNumber', width: 150 },
    {
        field: 'isLoggedIn', headerName: 'Status', width: 150, renderCell: (params) => (
            <span>{getStatus(params.value)}</span>
        )
    }

];


export default function AccountsTable({ usersProp, updateUsers }) {
    const [users, setUsers] = React.useState(usersProp)
    const [selectedUsers, setSelectedUsers] = React.useState([])
    const [rows, setRows] = React.useState(getRows(users))
    const [refreshLoading, setRefreshLoading] = React.useState(false)
    const handleRowSelection = (newSelection) => {
        if (newSelection.length == 0) setSelectedUsers([])
        const selectedUsersTemp = []
        newSelection.forEach(selection => {
            const selectedRow = rows.find(row => row.id == selection)
            const selectedUser = users.find(user => user._id == selectedRow.userId)
            selectedUsersTemp.push(selectedUser)
        })
        setSelectedUsers(prev => (selectedUsersTemp))
    }

    const deleteSelectedUsers = async () => {
        console.log(selectedUsers)
        const text = selectedUsers.length > 1 ? `Are you sure you want to delete this ${selectedUsers.length} users?` : `Are you sure you want to delete this user`
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

                const response = await axios.post(`${serverIP.ip}/administration/delete_users`, { users: selectedUsers })
                swal({
                    icon: 'success',
                    text: `A  ${response.data.deletedCount.users} ${selectedUsers.length == 1 ? `account` : `accounts`} with ${response.data.deletedCount.adds} advertisements deleted successfully`
                }).then(r => window.location.reload())

            } catch (error) {
                swal({
                    icon: 'error',
                    text: `An error occured during deleting ${selectedUsers.length == 1 ? 'user' : 'users'}`
                })
            }
        })

    }

    const refresh = async () => {
        axios.defaults.withCredentials = true
        try {
            setRefreshLoading(true)
            const response = await axios.post(`${serverIP.ip}/administration/getInfo`);
            console.log(response.data.users)
            setUsers(prev => (response.data.users))
            setRows(getRows(response.data.users))
            updateUsers(response.data.users)
            setRefreshLoading(false)
        } catch (error) {
            setRefreshLoading(false)
        }
    }

    return (
        <div id='table' className='accounts-table' style={{ width: '100%' }}>
            <Tooltip placement='top' title={`delete ${selectedUsers.length} users`}>
                <Button variant='contained' color='error' disabled={selectedUsers.length == 0}
                    sx={{ marginBottom: 1, textTransform: 'none' }}
                    onClick={deleteSelectedUsers}
                    endIcon={<DeleteIcon />}
                >Delete</Button>
            </Tooltip>

            <Tooltip placement='top' title='Refresh'>
                <LoadingButton variant='contained' color='info' onClick={refresh} loading={refreshLoading}
                    sx={{ marginBottom: 1, textTransform: 'none', marginLeft: 3 }}
                    endIcon={<SyncIcon />}
                >Refresh</LoadingButton>
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
    );
}
const getRows = (users) => {
    const allUsers = users
    const rows = []
    let id = 1
    allUsers.forEach(user => {
        rows.push({
            id: id,
            firstname: user.firstname,
            lastname: user.lastname,
            city: user.city,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isLoggedIn: user.isLoggedIn,
            userId: user._id
        })
        id++
    })
    return rows
}

const getStatus = (isLoggedIn) => (

    <Tooltip placement='right' title={isLoggedIn ==  false ? 'offline' : 'online'}>
        {
            isLoggedIn == true ? <CircleIcon color='success' /> : <CircleIcon color='black' />
        }
    </Tooltip>

)



