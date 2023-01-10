import { useState, useEffect } from 'react';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
  showAlert: false,
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  // global state amd useNavigate

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  // fire everytime we change the value in the state
  const handleChange = e => {
    console.log(e.target);
  };

  const onSubmit = e => {
    e.preventDefault();
    console.log(e.target);
  };

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>

        {values.showAlert && <Alert />}

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

        <button type="submit" className="btn btn-block">
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
