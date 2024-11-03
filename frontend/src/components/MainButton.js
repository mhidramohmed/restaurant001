"use client";
const MainButton = ({ type = 'button', className = '', children, ...props }) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default MainButton;
