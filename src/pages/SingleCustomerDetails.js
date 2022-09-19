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
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

const SingleCustomerDetails = () => {
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("");
    const [locations, setLocations] = useState("")
    const [petDetails, setPetDetails] = useState([])
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

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const getUniqueCustomerDetails = async (id, token) => {
        try {
            const { data } = await axios.get(`http://localhost:3002/api/admin/get-uniquecustomer/${id}/${token}`);
            console.log(data)
            setCustomerName(data.user.customerName)
            setEmail(data.user.email)
            setPincode(data.user.pincode)
            setMobile(data.user.mobile)
            setAddress(data.user.address[2])
            setState(data.user.state[0])
            setCity(data.user.city[0])
            setLocations(data.user.location[0])
            setPetDetails(data.pets);
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
                <div>
                    {petDetails.length > 0 && (<Typography variant="h4" gutterBottom>
                        Pet Details
                    </Typography>)}
                    <Box sx={{ m: 1, width: '75%' }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            {petDetails.map((pet) => {
                                return (
                                    <Grid item xs={6} key={pet._id}>
                                        <Item>
                                            <Paper sx={{ width: 320, maxWidth: '100%' }}>
                                                <MenuList>
                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Name
                                                        </Typography>
                                                        <ListItemText>{pet.petName}</ListItemText>
                                                    </MenuItem>

                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Age
                                                        </Typography>
                                                        <ListItemText>{pet.age}</ListItemText>
                                                    </MenuItem>

                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            DOB
                                                        </Typography>
                                                        <ListItemText>{pet.dob}</ListItemText>
                                                    </MenuItem>

                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Gender
                                                        </Typography>
                                                        <ListItemText>{pet.gender}</ListItemText>
                                                    </MenuItem>

                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Allergies
                                                        </Typography>
                                                        <ListItemText>{pet.allergies}</ListItemText>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Breed
                                                        </Typography>
                                                        <ListItemText>{pet.breed}</ListItemText>
                                                    </MenuItem>

                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Active
                                                        </Typography>
                                                        <ListItemText>{pet.active}</ListItemText>
                                                    </MenuItem>
                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Weight
                                                        </Typography>
                                                        <ListItemText>{pet.weight}</ListItemText>
                                                    </MenuItem>

                                                    <MenuItem>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Trained
                                                        </Typography>
                                                        {pet.trained ? <ListItemText>Yes</ListItemText> : <ListItemText>No</ListItemText>}
                                                    </MenuItem>
                                                </MenuList>
                                            </Paper>
                                        </Item>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Box >
                </div >
            </Box >
        </div >
    );
}

export default SingleCustomerDetails;