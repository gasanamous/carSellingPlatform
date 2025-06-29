import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip, Button } from '@mui/material';
import axios from 'axios';
import serverIP from '../../config';
import swal from '@sweetalert/with-react';
import SyncIcon from '@mui/icons-material/Sync';
import { LoadingButton } from '@mui/lab';
import styled from 'styled-components';
import MyTextareaInput from '../../static components/MyTextareaInput';
const StyledB = styled.label`
  @media (width <= 768px) {
    font-size: 12px; 
  }
    font-size: 14px;
    display : block; 
`;
const loadingButtonProps = {
    sx: {
        backgroundColor: 'green',
        textTransform: 'none',
        padding: 1,
        ':hover': { backgroundColor: '#006400' },
        borderRadius: '0px',
        marginTop: 3,
        width: '50%',
        color: 'white'
    }

}
export default function ReportsList({ allReports, thisUser }) {

    const [reports, setReports] = React.useState(allReports)
    const [selectedReport, setselectedReport] = React.useState(null)
    const [rows, setRows] = React.useState(getRows(allReports.filter(rep => rep.status == 'in proccess')))
    const [refreshLoading, setRefreshLoading] = React.useState(false)
    const [feedbackMessage, setFeedbackMessage] = React.useState()
    const [response, setResponse] = React.useState(null)
    const [MyErrors, setMyErrors] = React.useState()
    const [loading, setLoading] = React.useState(false)

    const selectReport = (row) => {
        setFeedbackMessage(prev => null)
        setMyErrors(prev => null)
        setResponse(prec => null)
        setselectedReport(prev => row)
    }
    const changeFeedbackMessage = (e) => {
        const { value } = e.target
        console.log(value)
        setFeedbackMessage(value.trim())
    }

    const refresh = async () => {
        axios.defaults.withCredentials = true
        try {
            setRefreshLoading(true)
            const response = await axios.post(`${serverIP.ip}/administration/getInfo`);
            setRows(getRows(response.data.reports.filter(rep => rep.status == 'in proccess')))
            setselectedReport(null)
            setRefreshLoading(false)
            setLoading(false)
            setFeedbackMessage('')
            setMyErrors(false)
            setResponse(null)
        } catch (error) {
            setRefreshLoading(false)
        }
    }

    const sendFeedback = async (e) => {
        e.preventDefault()
        if (feedbackMessage.trim() == '') {
            setMyErrors({ 'Feedback': 'Please provide a feedback to send' })
            return
        }
        setMyErrors(null)
        setLoading(true)
        try {
            const response = await axios.post(`${serverIP.ip}/administration/sendFeedback`, { feedbackMessage: feedbackMessage, to: selectedReport.email, selectedReport: selectedReport })
            setResponse(true)
            refresh()
        } catch (error) {
            setResponse(false)
        }
        setLoading(false)
    }

    return (
        <>
            <div className='reports-table' id='table'>
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
                {
                    rows.length == 0 ?
                        <h5>No Reports founded</h5>
                        :
                        <>
                            <h4 style={{ padding: '10px 0px' }}>In proccess: </h4>
                            <StyledB style={{ color: 'gray', textAlign: 'left', display: 'block', cursor: 'initial' }}>
                                Here is the reports which users submit for their problems
                                </StyledB>

                            <TableContainer id='reports' component={Paper} sx={{mt : 1}}>
                                <Table sx={{ minWidth: 650 }} size='small' aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell align="left">Firstname</TableCell>
                                            <TableCell align="left">Lastname</TableCell>
                                            <TableCell align="left">Email</TableCell>
                                            <TableCell align="left">Subject</TableCell>
                                            <TableCell align="left">Submitted on</TableCell>
                                            <TableCell align="left">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            rows.map((row) => (
                                                <TableRow
                                                    key={row.repId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.id}
                                                    </TableCell>
                                                    <TableCell align="left">{row.firstname}</TableCell>
                                                    <TableCell align="left">{row.lastname}</TableCell>
                                                    <TableCell align="left">{row.email}</TableCell>
                                                    <TableCell align="left">{row.problemSubject}</TableCell>
                                                    <TableCell align="left">{row.submissionDate}</TableCell>
                                                    <TableCell align="left">
                                                        <Button fullWidth onClick={() => selectReport(row)} variant='outlined' color='error' sx={{ textTransform: 'none' }}>
                                                            details
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>

                }

                {
                    selectedReport != null && (

                        <div className="view-report-box">
                            <div className="report-card">
                                <table cellPadding={15} id={selectedReport.repId} style={{ width: '100%' }}>
                                    <tr>
                                        <td><StyledB>From</StyledB></td>
                                        <td>
                                            <StyledB>
                                                {`${selectedReport.firstname} ${selectedReport.lastname}`}
                                            </StyledB>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><StyledB>Problem</StyledB></td>
                                        <td>
                                            <StyledB>{`${selectedReport.problemSubject}`}</StyledB>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><StyledB>Details</StyledB></td>
                                        <td>
                                            <StyledB>{`${selectedReport.additionalDetails}`}</StyledB>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><StyledB>Send feedback</StyledB></td>
                                        <td id='textArea'>
                                            <MyTextareaInput title='Feedback' name='feedbackMessage' value={feedbackMessage} requried={false} handleChange={changeFeedbackMessage} MyErrors={MyErrors} />
                                            {
                                                response != null && (
                                                    <StyledB style={{ width: "100%", padding: 10, background: 'lightgreen', color: 'black', marginTop: '10px' }}>
                                                        {response == true ? 'Feedback sent successfully' : 'Error with sending feedback'}
                                                    </StyledB>
                                                )
                                            }


                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <LoadingButton variant="contained" loading={loading} onClick={sendFeedback} {...loadingButtonProps}>Send Feedback</LoadingButton>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    )}

            </div>

        </>
    );
}
const getRows = (reports) => {
    const allReports = reports
    const rows = []
    let id = 1
    allReports.forEach(rep => {
        rows.push({
            id: id,
            firstname: rep.firstname,
            lastname: rep.lastname,
            email: rep.email,
            problemSubject: rep.problemSubject,
            submissionDate: rep.submissionDate,
            additionalDetails: rep.additionalDetails,
            repId: rep._id,
        })
        id++
    })

    return rows
}

