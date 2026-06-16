function Card({ id, children, variant = "default", className }) {
  const variants = {
    default: "gap-5 p-6 rounded-lg",

    dashboard: "py-5 px-6 rounded-lg",

    list: "items-center gap-8 p-7 pb-14 pt-6 rounded-xl",

    breakdown: "items-center rounded-lg",

    category: "justify-between items-center py-7 px-6 gap-3 rounded-lg",
  };

  return (
    <div
      id={id}
      className={`bg-white flex ${variant === "category" ? "shadow-[0px_12px_16px_rgba(76,103,100,0.05)]" : "flex-col shadow-[0px_20px_25px_rgba(76,103,100,0.1)]"} ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
