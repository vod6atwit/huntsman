import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useState, useMemo, useEffect } from 'react';

const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState('');
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

    // if (isLoading) return;

    handleChange({ name, value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // clear the local state
    setLocalSearch('');
    // clear global state
    clearfilter();
  };

  const debounce = () => {
    let timeoutID;

    // only this return when useMemo call for the first time
    return e => {
      // update localSearch to display the value
      setLocalSearch(e.target.value);

      // clear previous timeOut if there is one
      clearTimeout(timeoutID);

      // the last timeOut will invoke the callback function to change the global state and rerender the jobsContainer
      timeoutID = setTimeout(() => {
        const name = e.target.name;
        const value = e.target.value;

        handleChange({ name, value });
      }, 1000);
    };
  };

  // run only 1 time to load the return function in debounce
  const optimizedDebounce = useMemo(
    () => debounce(),
    // eslint-disable-next-line
    []
  );

  return (
    <Wrapper>
      <form className="form">
        <h4>search form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            // exact name in global state
            name="search"
            value={localSearch}
            handleChange={optimizedDebounce}
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
