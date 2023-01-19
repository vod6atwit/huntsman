import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { FormRow, Alert, FormRowSelect } from '../../components';
import { useAppContext } from '../../context/appContext';

const AddJob = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
  } = useAppContext();

  const handleSubmit = e => {
    e.preventDefault();

    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }

    if (isEditing) {
      return;
    }

    createJob();

    // console.log('create job');
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
        <h3>{isEditing ? 'Edit Job' : 'Add Job'}</h3>
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

          <div className="btn-container">
            {/* submit button need to be infront to be able to handle 'enter' key */}
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>

            <button
              className="btn btn-block clear-btn"
              onClick={e => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
