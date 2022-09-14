import { filter, first } from 'lodash';
import { sentenceCase } from 'change-case';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'mobile', label: 'Mobile', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0].businessName, b[0].businessName);
    if (order !== 0) return order;
    return a[1].businessName - b[1].businessName;
  });
  if (query) {
    return filter(array, (_user) => _user.businessName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

let currentPage = 0;
let interval;
let searchInterval;

export default function ServiceProvider() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [allServiceProviders, setAllServiceProviders] = useState([]);

  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [firstInterval, setFirstInterval] = useState('');
  const [secondInterval, setSecondInterval] = useState('');

  const categoryShow = true;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    console.log({ isAsc }, { property });
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allServiceProviders.map((n) => n.businessName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allServiceProviders.length) : 0;

  const filteredUsers = applySortFilter(allServiceProviders, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token !== null) {
        currentPage = 0;
        interval = setInterval(() => {
          currentPage++;
          businessFilteration(currentPage, categoryFilter, stateFilter, cityFilter, locationFilter);
        }, 100);
        setFirstInterval(interval);
        localStorage.setItem('interval', interval);
      }
    } else {
      console.log('we are running on the server');
    }
  }, []);

  const businessFilteration = (pageNo, categoryFilter, stateFilter, cityFilter, locationFilter) => {
    console.log({ pageNo }, { categoryFilter }, { stateFilter }, { cityFilter }, { locationFilter });
    if (
      (categoryFilter === '' || categoryFilter === undefined) &&
      (stateFilter === '' || stateFilter === undefined) &&
      (cityFilter === '' || cityFilter === undefined) &&
      (locationFilter === '' || locationFilter === undefined)
    ) {
      console.log('all Filter');
      getBusinessWithoutCategory(pageNo);
    }

    // Filter All Business by selected category
    if (
      categoryFilter !== '' &&
      categoryFilter !== undefined &&
      (stateFilter === '' || stateFilter === undefined) &&
      (cityFilter === '' || cityFilter === undefined) &&
      (locationFilter === '' || locationFilter === undefined)
    ) {
      console.log('category filter');
      getBusinessWithCategory(pageNo, categoryFilter);
    }

    // Filter All Business by selected state
    if (
      (categoryFilter === '' || categoryFilter === undefined) &&
      stateFilter !== '' &&
      stateFilter !== undefined &&
      (cityFilter === '' || cityFilter === undefined) &&
      (locationFilter === '' || locationFilter === undefined)
    ) {
      console.log('state filter');
      console.log(stateFilter);
      getBusinessWithoutCategory(pageNo, 'state', stateFilter);
    }

    // Filter All business by selected city
    if (
      (categoryFilter === '' || categoryFilter === undefined) &&
      stateFilter !== '' &&
      stateFilter !== undefined &&
      cityFilter !== '' &&
      cityFilter !== undefined &&
      (locationFilter === '' || locationFilter === undefined)
    ) {
      console.log('city filter');
      getBusinessWithoutCategory(pageNo, 'city', stateFilter, cityFilter);
    }

    // Filter all business by selected location
    if (
      (categoryFilter === '' || categoryFilter === undefined) &&
      stateFilter !== '' &&
      stateFilter !== undefined &&
      cityFilter !== '' &&
      cityFilter !== undefined &&
      locationFilter !== '' &&
      locationFilter !== undefined
    ) {
      console.log('location filter');
      getBusinessWithoutCategory(pageNo, 'location', stateFilter, cityFilter, locationFilter);
    }

    // Filter all business by category and state
    if (
      categoryFilter !== '' &&
      categoryFilter !== undefined &&
      stateFilter !== '' &&
      stateFilter !== undefined &&
      (cityFilter === '' || cityFilter === undefined) &&
      (locationFilter === '' || locationFilter === undefined)
    ) {
      console.log('state with category');
      getBusinessWithCategory(pageNo, categoryFilter, 'state', stateFilter);
    }

    // Filter all business by category and city
    if (
      categoryFilter !== '' &&
      categoryFilter !== undefined &&
      stateFilter !== '' &&
      stateFilter !== undefined &&
      cityFilter !== '' &&
      cityFilter !== undefined &&
      (locationFilter === '' || locationFilter === undefined)
    ) {
      console.log('ciry and category');
      getBusinessWithCategory(pageNo, categoryFilter, 'city', stateFilter, cityFilter);
    }

    // Filter all business by category and city
    if (
      categoryFilter !== '' &&
      categoryFilter !== undefined &&
      stateFilter !== '' &&
      stateFilter !== undefined &&
      cityFilter !== '' &&
      cityFilter !== undefined &&
      locationFilter !== '' &&
      locationFilter !== undefined
    ) {
      console.log('location and category');
      getBusinessWithCategory(pageNo, categoryFilter, 'location', stateFilter, cityFilter, locationFilter);
    }
  };

  // Get Business without category function
  const getBusinessWithoutCategory = async (pageNo, type, state, city, location) => {
    console.log(pageNo);
    try {
      let arr = [];
      if (type === '' || type === undefined) {
        const { data } = await axios.get(
          `http://localhost:3002/api/business/get-profiles-from-all-categories/${pageNo}`
        );
        console.log(data);
        if (data.success) {
          arr = data.profilesArray;
        } else {
          clearInterval(interval);
          clearInterval(searchInterval);
          console.log('success false');
        }
      } else if (type === 'state') {
        console.log(state);
        const { data } = await axios.get(
          `http://localhost:3002/api/business/get-profiles-by-state/${state[0]}/${state[1]}/${pageNo}`
        );
        if (data.success) {
          arr = data.profilesArray;
        } else {
          clearInterval(interval);
          clearInterval(searchInterval);
          console.log('success false');
        }
      } else if (type === 'city') {
        console.log(city);
        const { data } = await axios.get(
          `http://localhost:3002/api/business/get-profiles-by-city/${city[0]}/${city[1]}/${city[2]}/${pageNo}`
        );
        if (data.success) {
          arr = data.profilesArray;
        } else {
          clearInterval(interval);
          clearInterval(searchInterval);
          console.log('success false');
        }
      } else if (type === 'location') {
        const { data } = await axios.get(
          `http://localhost:3002/api/business/get-profiles-by-location/${location[0]}/${location[1]}/${location[2]}/${location[3]}/${pageNo}`
        );
        if (data.success) {
          arr = data.profilesArray;
        } else {
          clearInterval(interval);
          clearInterval(searchInterval);
          console.log('success false');
        }
      } else {
        console.log('running');
      }

      setAllServiceProviders((businessData) => [...businessData, ...arr]);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Business with category function
  const getBusinessWithCategory = async (pageNo, category, type, state, city, location) => {
    let arr = [];
    if (type === '' || type === undefined) {
      const { data } = await axios.get(
        `http://localhost:3002/api/business/get-profiles-from-unique-category/${category}/${pageNo}`
      );
      console.log({ data });
      if (data.success) {
        arr = data.profilesArray;
      } else {
        console.log({ firstInterval, secondInterval });
        clearInterval(interval);
        clearInterval(searchInterval);
        console.log('success false');
      }
    } else if (type === 'state') {
      console.log(state);
      const { data } = await axios.get(
        `http://localhost:3002/api/business/get-profiles-by-state-category/${state[0]}/${state[1]}/${category}/${pageNo}`
      );
      if (data.success) {
        arr = data.profilesArray;
      } else {
        clearInterval(interval);
        clearInterval(searchInterval);
        console.log('success false');
      }
    } else if (type === 'city') {
      console.log(city);
      const { data } = await axios.get(
        `http://localhost:3002/api/business/get-profiles-by-city-category/${city[0]}/${city[1]}/${city[2]}/${category}/${pageNo}`
      );
      if (data.success) {
        arr = data.profilesArray;
      } else {
        clearInterval(interval);
        clearInterval(searchInterval);
        console.log('success false');
      }
    } else if (type === 'location') {
      const { data } = await axios.get(
        `http://localhost:3002/api/business/get-profiles-by-location-category/${location[0]}/${location[1]}/${location[2]}/${location[3]}/${category}/${pageNo}`
      );
      if (data.success) {
        arr = data.profilesArray;
      } else {
        clearInterval(interval);
        clearInterval(searchInterval);
        console.log('success false');
      }
    } else {
      console.log('running');
    }

    setAllServiceProviders((businessData) => [...businessData, ...arr]);
  };

  const handleSearch = (category, state, city, location) => {
    console.log({ category }, { state }, { city }, { location });
    clearInterval(interval);
    clearInterval(searchInterval);
    setAllServiceProviders([]);

    currentPage = 0;

    searchInterval = setInterval(() => {
      currentPage++;
      businessFilteration(currentPage, category, state, city, location);
    }, 1000);
    setSecondInterval(searchInterval);
    localStorage.setItem('interval', searchInterval);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    navigate('/dashboard/addingbusiness');
  };
  const handleBusiness = (id, category) => {
    console.log(id, category);
    navigate('/dashboard/singlebusinessdetails', { state: { id, category } });
  };

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Service Providers
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddUser}
          >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            categoryShow={categoryShow}
            handleSearch={handleSearch}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allServiceProviders.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, businessName, mobile, email, location, category } = row;
                    const isItemSelected = selected.indexOf(businessName) !== -1;
                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, businessName)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography
                              variant="subtitle2"
                              noWrap
                              onClick={() => handleBusiness(_id, category)}
                              sx={{ cursor: 'pointer' }}
                            >
                              {businessName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{mobile}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{location[0]}</TableCell>
                        {/* <TableCell align="left">
                          <Label variant="ghost" color={(status === 'banned' && 'error') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <UserMoreMenu />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allServiceProviders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
