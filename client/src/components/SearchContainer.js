import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { Form } from 'react-router-dom';

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchBy,
    searchByOptions,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearfilter,
  } = useAppContext();

  const handleSearch = e => {
    const name = e.target.name;
    const value = e.target.value;

    if (isLoading) return;

    handleChange({ name, value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    clearfilter();
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            // exact name in global state
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          <FormRowSelect
            labelText="Search By"
            // exact name in global state
            name="searchBy"
            value={searchBy}
            handleChange={handleSearch}
            list={searchByOptions}
          />
          <FormRowSelect
            labelText="job status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={['all', ...statusOptions]}
          />
          <FormRowSelect
            labelText="job type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={['all', ...jobTypeOptions]}
          />
          <FormRowSelect
            labelText="sort by"
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            clear filter
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
