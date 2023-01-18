import { useState } from 'react';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { Alert, FormRow } from '../../components';

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext();

  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [lastName, setLastName] = useState(user && user.lastName);
  const [location, setLocation] = useState(user && user.location);

  const handleSubmit = e => {
    e.preventDefault();
    // if (!name || !email || !lastName || !location) {
    //   displayAlert();
    //   return;
    // }
    updateUser({ name, email, lastName, location });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            name="name"
            value={name}
            type="text"
            handleChange={e => {
              setName(e.target.value);
            }}
          />
          <FormRow
            name="lastName"
            value={lastName}
            type="text"
            handleChange={e => {
              setLastName(e.target.value);
            }}
            labelText="Last Name"
          />
          <FormRow
            name="email"
            value={email}
            type="email"
            handleChange={e => {
              setEmail(e.target.value);
            }}
          />
          <FormRow
            name="location"
            value={location}
            type="text"
            handleChange={e => {
              setLocation(e.target.value);
            }}
          />
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? 'Please Wait ...' : 'save changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
