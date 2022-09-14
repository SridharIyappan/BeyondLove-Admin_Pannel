import * as Yup from 'yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik, Form, FormikProvider } from 'formik';
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
import { LoadingButton } from '@mui/lab';
import { ToastContainer, toast, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { dataState } from '../utils/dataState';
import { dataCity } from '../utils/dataCity';
import { dataLocation } from '../utils/dataLocation';
import Iconify from '../components/Iconify';

const AddingBusiness = () => {
  const [selectState, setSelectState] = useState('');
  const [cityArray, setCityArray] = useState([]);
  const [selectCity, setSelectCity] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationArray, setLocationArray] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');

  const LoginSchema = Yup.object().shape({
    businessName: Yup.string().required('Business Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    mobile: Yup.string().required('Mobile is required').min(10).max(10),
    address: Yup.string().required('Address is required'),
    password: Yup.string().required('Password is required'),
    category: Yup.string().required('Category is required'),
    // state: Yup.string().required('state is required'),
    // city: Yup.string().required('city is required'),
    // location: Yup.string().required('location is required'),
  });

  useEffect(() => {
    const tok = localStorage.getItem('token');
    setToken(tok);
  }, []);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      businessName: '',
      email: '',
      mobile: '',
      address: '',
      password: '',
      category: '',
      //   state: '',
      //   city: '',
      //   location: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (e) => {
      //   e.preventDefault();
      console.log('running');
      const d = {
        businessName: e.businessName,
        email: e.email,
        mobile: e.mobile,
        address: e.address,
        password: e.password,
        category: e.category,
        state: selectState,
        city: selectCity,
        location: selectedLocation,
      };
      console.log({ d });
      try {
        if (token !== null || token !== '' || token !== undefined) {
          if (selectState !== '' && selectCity !== '' && selectedLocation !== '') {
            const { data } = await axios.post(`http://localhost:3002/api/admin/create-business/${token}`, d);
            console.log(data);
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
          } else {
            toast.error('Please Select State', {
              theme: 'light',
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        }
      } catch (error) {
        console.log({ error });
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleChangeCategory = (e) => {
    console.log(e.target.value);
    setSelectedCategory(e.target.value);
  };

  const handleChangeState = (e) => {
    const state = e.target.value;
    setSelectState([state.Geo_Name, state.id]);
  };

  const handleClickCity = () => {
    console.log(selectState);
    if (selectState === '' || selectState[1] === undefined) {
      toast.error('Please Select State', {
        theme: 'light',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      const arr = [];
      dataCity.forEach((city) => {
        if (city[1] === selectState[1]) {
          arr.push(city);
        }
      });
      setCityArray(arr);
    }
  };

  const handleChangeCity = (e) => {
    const cty = e.target.value;
    setSelectCity(cty);
  };

  const handleChangeLocation = (e) => {
    const loc = e.target.value;
    setSelectedLocation(loc);
  };

  // Filtering Locations by City
  const handleClickLocation = () => {
    if (selectCity === '' || selectCity[2] === undefined) {
      toast.error('Please Select City', {
        theme: 'light',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      const arr = [];
      dataLocation.forEach((loc) => {
        if (loc[2] === selectCity[2]) {
          arr.push(loc);
        }
      });
      console.log({ arr });
      setLocationArray(arr);
    }
  };

  return (
    <Box m={2}>
      <FormikProvider value={formik}>
        <Typography variant="h4" m={1}>
          Add Business
        </Typography>
        <ToastContainer />
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack
            spacing={3}
            sx={{
              '& .MuiTextField-root': { m: 1, width: '40ch' },
            }}
          >
            <Box>
              <TextField
                id="outlined-password-input"
                label="Business Name"
                type="text"
                {...getFieldProps('businessName')}
                error={Boolean(touched.businessName && errors.businessName)}
                helperText={touched.businessName && errors.businessName}
              />

              <TextField
                id="outlined-basic"
                label="Email"
                type="text"
                variant="outlined"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                autoComplete="username"
                type="number"
                label="Mobile"
                {...getFieldProps('mobile')}
                error={Boolean(touched.mobile && errors.mobile)}
                helperText={touched.mobile && errors.mobile}
              />

              <TextField
                id="outlined-basic"
                label="Address"
                type="text"
                variant="outlined"
                {...getFieldProps('address')}
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address}
              />

              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                {...getFieldProps('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />

              <FormControl>
                <InputLabel id="category" sx={{ m: 1, width: '40ch' }}>
                  Category
                </InputLabel>
                <Select
                  labelId="Category"
                  id="demo-simple-select"
                  // value={selectedCategory}
                  label="Category"
                  sx={{ m: 1, width: '40ch' }}
                  onChange={handleChangeCategory}
                  {...getFieldProps('category')}
                  error={Boolean(touched.category && errors.category)}
                  helperText={touched.category && errors.category}
                >
                  <MenuItem value={'PetClinic'}>Pet Clinic</MenuItem>
                  <MenuItem value={'PetGrooming'}>Pet Grooming</MenuItem>
                  <MenuItem value={'PetTraining'}>Pet Training</MenuItem>
                  <MenuItem value={'PetBoarding'}>Pet Boarding</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="state" sx={{ m: 1, width: '40ch' }}>
                  State
                </InputLabel>
                <Select
                  labelId="Category"
                  id="demo-simple-select"
                  label="State"
                  sx={{ m: 1, width: '40ch' }}
                  onChange={handleChangeState}
                  required
                  //   {...getFieldProps('state')}
                  //   error={Boolean(touched.state && errors.state)}
                  //   helperText={touched.state && errors.state}
                >
                  {dataState.map((state) => {
                    return (
                      <MenuItem value={state} key={state.id}>
                        {state.Geo_Name !== '' && state.Geo_Name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel id="city" sx={{ m: 1, width: '40ch' }}>
                  City
                </InputLabel>
                <Select
                  labelId="Category"
                  id="demo-simple-select"
                  label="City"
                  sx={{ m: 1, width: '40ch' }}
                  onOpen={handleClickCity}
                  onChange={handleChangeCity}
                  required
                  //   {...getFieldProps('city')}
                  //   error={Boolean(touched.city && errors.city)}
                  //   helperText={touched.city && errors.city}
                >
                  {cityArray.map((city) => {
                    return (
                      <MenuItem value={city} key={city[2]}>
                        {city[0]}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel id="city" sx={{ m: 1, width: '40ch' }}>
                  Location
                </InputLabel>
                <Select
                  labelId="Category"
                  id="demo-simple-select"
                  label="Location"
                  sx={{ m: 1, width: '40ch' }}
                  onOpen={handleClickLocation}
                  onChange={handleChangeLocation}
                  required
                  //   {...getFieldProps('location')}
                  //   error={Boolean(touched.category && errors.location)}
                  //   helperText={touched.location && errors.location}
                >
                  {locationArray.map((location) => {
                    return (
                      <MenuItem value={location} key={location[3]}>
                        {location[0]}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Stack>

          <br />
          <LoadingButton
            sx={{ m: 1, width: '83ch' }}
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
          {/* </Box> */}
        </Form>
      </FormikProvider>
    </Box>
  );
};

export default AddingBusiness;
