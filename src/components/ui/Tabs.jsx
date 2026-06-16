function Tabs({ variant = "default", tabs, onChange, activeTab }) {
  return (
    <div className={`flex ${variant === "default" ? "gap-5" : "gap-8"}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`p-2 border-b-2 capitalize cursor-pointer transition-all ${variant === "default" ? "font-bold" : "font-semibold py-4"} ${activeTab === tab ? "text-primary border-primary" : variant === "default" ? "text-search border-transparent" : "text-date border-transparent"}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
