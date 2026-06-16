import { Link } from "react-router-dom";

function Button({
  variant = "primary",
  children,
  route,
  className,
  type,
  onClick,
  disabled,
}) {
  const variants = {
    primary: "bg-primary py-3 px-7 font-bold text-sm text-white tracking-wide",

    secondary: "bg-primary text-white font-semibold p-3",

    link: "flex items-center gap-4 py-3 px-4",

    outline:
      "flex items-center gap-2 py-2 px-5 border-2 border-primary text-primary",

    social:
      "w-full flex justify-center items-center gap-4 p-3 bg-google text-outline",
  };

  return route ? (
    <Link to={route} className={`rounded ${className} ${variants[variant]}`}>
      {children}
    </Link>
  ) : (
    <button
      type={type}
      className={`rounded cursor-pointer ${className} ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
