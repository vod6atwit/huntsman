import React, { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';

import reducer from './reducer';
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  // REGISTER_USER_BEGIN,
  // REGISTER_USER_SUCCESS,
  // REGISTER_USER_ERROR,
  // LOGIN_USER_BEGIN,
  // LOGIN_USER_SUCCESS,
  // LOGIN_USER_ERROR,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from './actions';

/* using this get token, user, and location approach when store token, user, and location in localStorage and globalState when development */

// reload data from local storage if exists
// const token = localStorage.getItem('token');
// const user = localStorage.getItem('user');
// const location = localStorage.getItem('location');

// global state values
const initialState = {
  // for auth && user
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  showSidebar: false,
  user: null,
  userLocation: '',

  /* using this approach when store token, user, and location in localStorage and globalState when development */

  // user: user ? JSON.parse(user) : null,
  // token: token ? token : null,
  // userLocation: location || '',
  // jobLocation: location || '',
  userLoading: true,

  // for job
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  postUrl: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'internship',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  jobs: [],
  jobLocation: '',
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  description: '',

  // for stats
  stats: {},
  monthlyApplicationStats: [],

  // for search
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'position name a-z', 'position name z-a'],
  searchBy: 'position',
  searchByOptions: ['position', 'company', 'location'],
};

const AppContext = React.createContext();

// providing the value for all the children by using AppContext
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios configuration
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  /* using this approach when store token localStorage and globalState when development to sending back the token every request to verify in the server */

  // axios configuration request
  // authFetch.interceptors.request.use(
  //   config => {
  //     config.headers['Authorization'] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   error => {
  //     return Promise.reject(error);
  //   }
  // );

  // axios configuration response
  authFetch.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      // console.log(error.response);
      // log the user out if unauthorized
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  // clear the alert after 4s
  const clearAlert = () => {
    setTimeout(() => {
      // always pass in the object for dispatch
      dispatch({ type: CLEAR_ALERT });
    }, 2000);
  };

  const displayAlert = () => {
    // always pass in the object for dispatch
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  /* using this approach when store token, user, and location in localStorage and globalState when development */

  // const addUserToLocalStorage = ({ user, token, location }) => {
  //   localStorage.setItem('user', JSON.stringify(user));
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('location', location);
  // };

  // const removeUserFromLocalStorage = ({ user, token, location }) => {
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('location');
  // };

  // setup parameters as a object to not worry about ordering
  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      // login and register user
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      /* using this approach if server sending back reponse with token */
      // const { user, token, location } = data;

      const { user, location } = data;

      dispatch({
        type: SETUP_USER_SUCCESS,
        // pass to the reducer.js
        payload: {
          user,
          location,
          alertText,

          /* using this approach if server sending back reponse with token */
          // token,
        },
      });

      /* Using this approach when enable LocalStorage function */
      // persist data to LocalStorage
      // addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    dispatch({ type: LOGOUT_USER });
    /* Using this approach when enable LocalStorage function */
    // removeUserFromLocalStorage({ user, token, location });
  };

  const updateUser = async currentUser => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);

      /* using this approach if server sending back reponse with token */
      // const { user, token, location } = data;
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        // global State object
        payload: {
          user,
          location,

          /* using this approach if server sending back reponse with token */
          // token,
        },
      });

      /* Using this approach when enable LocalStorage function */
      // persist data to LocalStorage
      // addUserToLocalStorage({ user, token, location });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }

    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const {
        position,
        company,
        jobLocation,
        jobType,
        status,
        postUrl,
        description,
      } = state;
      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status,
        postUrl,
        description,
      });

      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: CREATE_JOB_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { search, searchStatus, searchType, sort, searchBy, page } = state;

    // changing url depends on type of search
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}&searchBy=${searchBy}`;

    if (search) {
      url = url + `&search=${search}`;
    }

    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch.get(url);

      const { jobs, totalJobs, numOfPages } = data;

      // console.log(jobs);
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      // console.log(error.response);
      logoutUser();
    }
  };

  const setEditJob = id => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const {
        position,
        company,
        jobLocation,
        jobType,
        status,
        postUrl,
        description,
      } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
        postUrl,
        description,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: EDIT_JOB_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const deleteJob = async jobId => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      // delete in database
      await authFetch.delete(`jobs/${jobId}`);
      // get new job array from the database to render for frontend
      getJobs();
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: DELETE_JOB_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
      // console.log(error.response);
      // logoutUser();
    }
    clearAlert();
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch.get(`/jobs/stats`);
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplicationStats: data.monthlyApplicationStats,
        },
      });
    } catch (error) {
      // console.log(error.response);
      logoutUser();
    }
    clearAlert();
  };

  const clearfilter = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = page => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      // if token saved in cookie is still valid, this will pass through
      const { data } = await authFetch.get('/auth/getCurrentUser');
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      // console.log(error.response);
      if (error.response.status === 401) return;
      logoutUser();
    }
  };

  useEffect(() => {
    getCurrentUser();
    // eslint-disable-next-line
  }, []);

  return (
    // All the children (App) will able to use VAlUE passed through
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearfilter,
        changePage,
        getCurrentUser,
      }}
    >
      {/* <App/> */}
      {children}
    </AppContext.Provider>
  );
};

// custom hooks by using 'use'
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };

// const registerUser = async currentUser => {
//   dispatch({ type: REGISTER_USER_BEGIN });
//   try {
//     const response = await axios.post('/api/v1/auth/register', currentUser);
//     // console.log(response);

//     const { user, token, location } = response.data;
//     dispatch({
//       type: REGISTER_USER_SUCCESS,
//       payload: {
//         user,
//         token,
//         location,
//       },
//     });

//     // persist data to LocalStorage
//     addUserToLocalStorage({ user, token, location });
//   } catch (error) {
//     // console.log(error);
//     dispatch({
//       type: REGISTER_USER_ERROR,
//       payload: { msg: error.response.data.msg },
//     });
//   }
//   clearAlert();
// };

// const loginUser = async currentUser => {
//   dispatch({ type: LOGIN_USER_BEGIN });
//   try {
//     const { data } = await axios.post('/api/v1/auth/login', currentUser);

//     const { user, token, location } = data;
//     dispatch({
//       type: LOGIN_USER_SUCCESS,
//       payload: {
//         user,
//         token,
//         location,
//       },
//     });

//     // persist data to LocalStorage
//     addUserToLocalStorage({ user, token, location });
//   } catch (error) {
//     dispatch({
//       type: LOGIN_USER_ERROR,
//       payload: { msg: error.response.data.msg },
//     });
//   }
//   clearAlert();
// };
