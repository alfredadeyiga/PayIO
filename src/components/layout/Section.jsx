import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

function Section({ variant = "dashboard", title, children, route, className }) {
  const variants = {
    dashboard: "gap-4",
    overview: "gap-2",
    auth: "px-8 gap-10 items-center",
  };

  return (
    <section
      className={`w-full flex flex-col max-w-[400px] ${variant !== "auth" && "md:max-w-none mx-auto md:mx-0"} ${variants[variant]} ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-card">{title}</h3>

          {route && (
            <Link
              to={route}
              className="flex items-center gap-1 font-medium text-card text-xs"
            >
              View All
              <MdKeyboardArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {children}
    </section>
  );
}

export default Section;
