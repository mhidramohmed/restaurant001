"use client";
const MainButton = ({ type = 'button', className = '', children, ...props }) => {
  return (
    <button
      type={type}
      className={`px-3 py-3 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default MainButton;
