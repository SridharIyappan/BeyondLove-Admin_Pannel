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
import { ToastContainer, toast, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingButton } from '@mui/lab';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dataState } from '../utils/dataState';
import { dataCity } from '../utils/dataCity';
import { dataLocation } from '../utils/dataLocation';

const EditBusiness = () => {
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [address, setAddress] = useState("");
    const [category, setCategory] = useState("")
    const [pincode, setPincode] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("");
    const [locations, setLocations] = useState("")
    const [token, setToken] = useState("");
    const [categories, setCategorires] = useState("");
    const [busId, setBusId] = useState("")

    const location = useLocation();

    const navigate = useNavigate();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tok = localStorage.getItem('token');
            const id = location.state.id;
            const category = location.state.category;
            if (id !== undefined && category !== undefined) {
                getUniqueBusinessDetails(id, category)
                setCategorires(category)
                setBusId(id)
                setToken(tok)
            }
        } else {
            console.log('we are running on the server');
        }
    }, [])

    const getUniqueBusinessDetails = async (id, category) => {
        try {
            const { data } = await axios.get(`http://localhost:3002/api/business/get-profile/${category}/${id}`);
            setBusinessName(data.business.businessName)
            setEmail(data.business.email)
            setMobile(data.business.mobile)
            setCategory(data.business.category)
            setAddress(data.business.address[0])
            setState(data.business.state[0])
            setCity(data.business.city[0])
            setLocations(data.business.location[0])
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }


    const EditBusinessDetail = async (e) => {
        e.preventDefault();
        const d = {
            businessName,
            email,
            mobile,
            address,
            category: categories,
            businessId: busId
        }
        console.log(d)
        try {
            const { data } = await axios.put(`http://localhost:3002/api/admin/update-business/${token}`, d)
            console.log(data)
            if (data.success) {
                toast.success(data.msg, {
                    theme: 'light',
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/dashboard/serviceprovider');
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <ToastContainer />
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
                        Business Edit Details
                    </Typography>
                    <TextField
                        id="outlined-password-input"
                        label="Business Name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        type="text" />

                    <TextField id="outlined-basic"
                        label="Email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Mobile"
                        type="number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        variant="outlined" />

                    {/* <TextField id="outlined-basic"
                        label="Pincode"
                        type="number"
                        value={pincode}
                        variant="outlined" /> */}

                    <TextField id="outlined-basic"
                        label="Category"
                        type="text"
                        value={category}
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
                    <LoadingButton
                        sx={{ m: 1, width: '83ch' }}
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={EditBusinessDetail}
                    >
                        Save
                    </LoadingButton>
                </div>
            </Box>
        </div>
    );
}

export default EditBusiness;