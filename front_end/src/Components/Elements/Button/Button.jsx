import PropTypes from "prop-types";

const Button = ({ variant, type = "button", children }) => {
  return (
    <button
      className={`${variant} max-w-[190px] w-full flex justify-center items-center gap-2 h-[52px]  text-white rounded-lg capitalize font-semibold cursor-pointer`}
      type={type}
    >
      {" "}
      {children}
    </button>
  );

  Button.propTypes = {
    variant: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.node,
  };
};
export default Button;
