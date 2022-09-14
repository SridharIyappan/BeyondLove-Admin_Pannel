import Box from '@mui/material/Box';
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

const SingleBusinessDetails = () => {
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
                    <TextField
                        id="outlined-password-input"
                        label="Business Name"
                        type="text" />

                    <TextField id="outlined-basic"
                        label="Email"
                        type="text"
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Mobile"
                        type="number"
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Address"
                        type="text"
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Pincode"
                        type="number"
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Category"
                        type="text"
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="State"
                        type="text"
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="City"
                        type="text"
                        variant="outlined" />

                    <TextField id="outlined-basic"
                        label="Location"
                        type="text"
                        variant="outlined" />
                </div>
            </Box>
        </div>
    );
}

export default SingleBusinessDetails;