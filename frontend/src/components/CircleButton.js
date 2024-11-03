const CircleButton = ({ body, icon }) => (
    <div className="relative group">
      <button className="flex items-center justify-center w-10 h-10 border border-primary rounded-full hover:bg-primary hover:text-background">
        <span>
          {icon}
        </span>
      </button>
      {body && (
        <span className="absolute bottom-12 px-3 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {body}
        </span>
      )}
    </div>
  );

  export default CircleButton;