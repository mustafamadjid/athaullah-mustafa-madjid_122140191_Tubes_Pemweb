import PropTypes from "prop-types";

const Input = ({ type, placeholder, name,value,variant,onChange  }) => {
  return (
    <>
      <div className="w-full mb-6">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={`${variant} w-full border-b-1 border-gray-300 p-3 focus:outline-none`}
        />
      </div>
    </>
  );
};
Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  variant: PropTypes.string,
  onChange: PropTypes.func,
};

export default Input;
