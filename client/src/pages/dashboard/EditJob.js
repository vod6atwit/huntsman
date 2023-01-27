import { Link } from 'react-router-dom';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { FormRow, Alert, FormRowSelect, FormText } from '../../components';
import { useAppContext } from '../../context/appContext';

const EditJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    postUrl,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    editJob,
    description,
  } = useAppContext();

  const handleSubmit = e => {
    e.preventDefault();

    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }

    if (isEditing) {
      editJob();
      return;
    }
  };

  const handleJobInput = e => {
    // global state
    const name = e.target.name;
    // value typed in
    const value = e.target.value;

    handleChange({ name, value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>Edit Job</h3>
        {showAlert && <Alert />}

        <div className="form-center">
          <FormRow
            name="position" // related to global state
            value={position}
            type="text"
            handleChange={handleJobInput}
          />
          <FormRow
            name="company"
            value={company}
            type="text"
            handleChange={handleJobInput}
          />

          <FormRow
            name="postUrl"
            value={postUrl}
            type="url"
            handleChange={handleJobInput}
            labelText="post URL"
          />

          <FormRow
            name="jobLocation"
            value={jobLocation}
            type="text"
            handleChange={handleJobInput}
            labelText="job location"
          />

          <FormRowSelect
            name="jobType"
            value={jobType}
            list={jobTypeOptions}
            handleChange={handleJobInput}
            labelText="job type"
          />

          <FormRowSelect
            name="status"
            value={status}
            list={statusOptions}
            handleChange={handleJobInput}
          />

          <FormText
            name="description"
            value={description}
            handleChange={handleJobInput}
            labelText="description"
          />

          <div className="btn-container">
            {/* submit button need to be infront to be able to handle 'enter' key */}
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Done
            </button>

            <Link
              to="/all-jobs"
              className="btn btn-block clear-btn"
              onClick={() => {
                clearValues();
              }}
            >
              cancel
            </Link>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default EditJob;
