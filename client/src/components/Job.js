import moment from 'moment';
import {
  FaLocationArrow,
  FaBriefcase,
  FaCalendarAlt,
  FaLink,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';
import UrlPost from './UrlPost';

const Job = ({
  _id,
  position,
  company,
  postUrl,
  jobLocation,
  jobType,
  createdAt,
  status,
}) => {
  const { setEditJob, deleteJob } = useAppContext();

  // use moment package to format dates
  let date = moment(createdAt);
  date = date.format('MMMM Do, YYYY');

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${status}`}>{status}</div>
          {postUrl && <UrlPost icon={<FaLink />} url={postUrl} />}
        </div>

        <footer className="actions">
          <Link
            to="/edit-job"
            className="btn edit-btn"
            onClick={() => {
              setEditJob(_id);
            }}
          >
            Edit
          </Link>
          <button
            type="button"
            className="btn delete-btn"
            onClick={() => {
              deleteJob(_id);
            }}
          >
            Delete
          </button>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
