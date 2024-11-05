const CircleButton = ({ body, icon, href }) => (
  <div className="relative group">
    <a href={href} target="_blank" rel="noopener noreferrer">
      <button className="flex items-center justify-center w-14 h-14 border border-primary rounded-full hover:bg-primary hover:text-background transition-all duration-200">
        <span className="text-xl">{icon}</span>
      </button>
    </a>
    {body && (
      <a
        href={href} // Link to the specified URL
        target="_blank" // Open the link in a new tab
        rel="noopener noreferrer" // Security measure
        className="absolute bottom-[-70px] left-1/2 transform -translate-x-1/2 px-3 py-1 text-sm text-background bg-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-20 whitespace-nowrap delay-200"
      >
        {body}
      </a>
    )}
  </div>
);

export default CircleButton;
