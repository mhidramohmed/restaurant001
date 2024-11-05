"use client";
const MainButton = ({ type = 'button', className = '', children, ...props }) => {
  return (
    <button
      type={type}
      className={`px-4 py-4 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default MainButton;
