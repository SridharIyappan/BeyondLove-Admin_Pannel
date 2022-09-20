import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
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
import { Box } from '@mui/system';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { ToastContainer, toast, TypeOptions } from 'react-toastify';
import { dataState } from '../../../utils/dataState';
import { dataCity } from '../../../utils/dataCity';
import { dataLocation } from '../../../utils/dataLocation';
import 'react-toastify/dist/ReactToastify.css';

// component
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------
const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));
const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));
// ----------------------------------------------------------------------
UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
export default function UserListToolbar({ numSelected, filterName, onFilterName, categoryShow, handleSearch }) {
  const [selectedState, setSelectedState] = useState('');
  const [cityArray, setCityArray] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [locationArray, setLocationArray] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [interval, setInterval] = useState('');

  useEffect(() => {
    dataState.sort((a, b) => (a.Geo_Name < b.Geo_Name ? -1 : 1));
    dataCity.sort((a, b) => (a[0] < b[0] ? -1 : 1));
    dataLocation.sort((a, b) => (a[0] < b[0] ? -1 : 1));
    const inter = localStorage.getItem('interval');
    console.log({ inter });
    setInterval(inter);
  }, []);

  const handleChangeCategory = (e) => {
    console.log(e.target.value);
    setSelectedCategory(e.target.value);
  };
  const handleChangeState = (e) => {
    console.log({ interval });
    clearInterval(interval);
    const state = e.target.value;

    setSelectedState([state.Geo_Name, state.id]);
  };

  const handleClickCity = () => {
    clearInterval(interval);
    localStorage.removeItem('interval');
    if (selectedState === '' || selectedState[1] === undefined) {
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
        if (city[1] === selectedState[1]) {
          arr.push(city);
        }
      });
      setCityArray(arr);
    }
  };

  // City Change Function
  const handleChangeCity = (e) => {
    const cty = e.target.value;
    setSelectedCity(cty);
  };

  const handleChangeLocation = (e) => {
    const loc = e.target.value;
    setSelectedLocation(loc);
  };

  // Filtering Locations by City
  const handleClickLocation = () => {
    clearInterval(interval);
    if (selectedCity === '' || selectedCity[2] === undefined) {
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
        if (loc[2] === selectedCity[2]) {
          arr.push(loc);
        }
      });
      setLocationArray(arr);
    }
  };

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <ToastContainer />

      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box>
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        </Box>
      )}
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ minWidth: 170 }}>
          {categoryShow && (
            <FormControl fullWidth>
              <InputLabel id="category">Category</InputLabel>
              <Select
                labelId="category"
                id="demo-simple-select"
                // value={selectedCategory}
                label="Category"
                onChange={handleChangeCategory}
              >
                <MenuItem value={'PetClinic'}>Pet Clinic</MenuItem>
                <MenuItem value={'PetGrooming'}>Pet Grooming</MenuItem>
                <MenuItem value={'PetTraining'}>Pet Training</MenuItem>
                <MenuItem value={'PetBoarding'}>Pet Boarding</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      )}

      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ minWidth: 150 }}>
          {categoryShow && (
            <FormControl fullWidth>
              <InputLabel id="state">State</InputLabel>

              <Select
                labelId="state"
                id="demo-simple-select"
                // value={stateName}
                label="State"
                onChange={handleChangeState}
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
          )}
        </Box>
      )}
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ minWidth: 150 }}>
          {categoryShow && (
            <FormControl fullWidth>
              <InputLabel id="city">City</InputLabel>
              <Select
                labelId="city"
                id="demo-simple-select"
                // value={age}
                label="City"
                onOpen={handleClickCity}
                onChange={handleChangeCity}
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
          )}
        </Box>
      )}
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ minWidth: 150 }}>
          {categoryShow && (
            <FormControl fullWidth>
              <InputLabel id="location">Location</InputLabel>
              <Select
                labelId="location"
                id="demo-simple-select"
                // value={age}
                label="Location"
                onOpen={handleClickLocation}
                onChange={handleChangeLocation}
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
          )}
        </Box>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Box>
          {categoryShow && (
            <Tooltip title="Search">
              <Button
                variant="contained"
                sx={{ height: '50px', width: '50px' }}
                onClick={() => handleSearch(selectedCategory, selectedState, selectedCity, selectedLocation)}
              >
                <SearchRoundedIcon />
              </Button>
            </Tooltip>
          )}
        </Box>
      )}
    </RootStyle>
  );
}
