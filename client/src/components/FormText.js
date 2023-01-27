const FormText = ({ name, value, handleChange, labelText }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <textarea
        id={name} // related to the htmlFor attribute
        value={value}
        name={name}
        onChange={handleChange}
        className="form-textarea"
      />
    </div>
  );
};

export default FormText;
