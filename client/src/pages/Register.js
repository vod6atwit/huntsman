import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';

// local state values of register.js
const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const Register = () => {
  const navigate = useNavigate();

  // values = initialState object
  // local state object
  const [values, setValues] = useState(initialState);

  // global state object
  const { isLoading, showAlert, displayAlert, registerUser, user } =
    useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  // fire everytime we change the value in the state
  const handleChange = e => {
    // get the value of 'name' attribute from the FormRow,
    // then set that value in initialState = value that we type in of the target
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }

    const currentUser = { name, email, password };
    if (isMember) {
      console.log('Already registered');
    } else {
      registerUser(currentUser);
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 4000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>

        {showAlert && <Alert />}

        {/* name input */}
        {!values.isMember && (
          <FormRow
            name="name"
            value={values.name}
            type="text"
            handleChange={handleChange}
          />
        )}

        {/* email input */}
        <FormRow
          name="email"
          // set the value always the same as name in initialState
          value={values.email}
          type="email"
          handleChange={handleChange}
        />

        {/* password input */}
        <FormRow
          name="password"
          value={values.password}
          type="password"
          handleChange={handleChange}
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>

        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
