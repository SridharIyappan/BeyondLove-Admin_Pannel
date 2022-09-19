import Box from '@mui/material/Box';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import {
    Toolbar,
    Tooltip,
    IconButton,
    Typography,
    OutlinedInput,
    InputAdornment,
    Stack,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SingleCustomerDetails = () => {
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [address, setAddress] = useState("");
    const [category, setCategory] = useState("")
    const [pincode, setPincode] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("");
    const [locations, setLocations] = useState("")

    const location = useLocation();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tok = localStorage.getItem('token');
            const id = location.state.id;
            if (id !== undefined && tok !== undefined) {
                getUniqueCustomerDetails(id, tok)
            }
        } else {
            console.log('we are running on the server');
        }
    }, [])

    const getUniqueCustomerDetails = async (id, token) => {
        try {
            const { data } = await axios.get(`http://localhost:3002/api/admin/get-uniquecustomer/${id}/${token}`);
            setCustomerName(data.user.customerName)
            setEmail(data.user.email)
            setPincode(data.user.pincode)
            setMobile(data.user.mobile)
            setAddress(data.user.address[2])
            setState(data.user.state[0])
            setCity(data.user.city[0])
            setLocations(data.user.location[0])
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '40ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <Typography variant="h4" gutterBottom>
                        Customer Details
                    </Typography>
                    <TextField
                        id="outlined-password-input"
                        label="Business Name"
                        value={customerName}
                        type="text" />

                    <TextField id="outlined-basic"
                        label="Email"
                        type="text"
                        value={email}
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Mobile"
                        type="number"
                        value={mobile}
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Address"
                        type="text"
                        value={address}
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Pincode"
                        type="number"
                        value={pincode}
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="State"
                        type="text"
                        value={state}
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="City"
                        type="text"
                        value={city}
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Location"
                        type="text"
                        value={locations}
                        variant="outlined" />
                </div>

            </Box>
        </div>
    );
}

export default SingleCustomerDetails;