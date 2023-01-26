import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const Landing = () => {
  const { user } = useAppContext();
  return (
    <>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              job <span>huntsman</span> app
            </h1>
            <p>
              Job Huntsman App is designed to help job seekers save their dream
              jobs application in one convenient location. The app features a
              user-friendly interface that allows users to search, add, and edit
              all saved job applications by position, location, company, status
              and job type. With our Job Huntsman App, applying and keeping
              track of your dream job has never been easier.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login/Register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </>
  );
};

export default Landing;
