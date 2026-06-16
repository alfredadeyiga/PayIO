function FormDivider() {
  return (
    <div className="relative flex items-center">
      <label className="bg-background p-2 z-10 text-sm text-placeholder">
        or sign up with
      </label>
      
      <hr className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] border border-outline opacity-10" />
    </div>
  );
}

export default FormDivider;
