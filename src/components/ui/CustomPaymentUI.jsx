function CustomPaymentUI({ balance }) {
  const lastFour = balance.account_number.toString().slice(-4);

  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-3 items-center">
        {balance.icon && (
          <img
            src={balance.icon}
            className="w-5 h-5 hidden md:block shrink-0"
            alt="icon"
          />
        )}

        {balance.type}
      </div>

      <p className="text-xs shrink-0">•••• {lastFour}</p>
    </div>
  );
}

export default CustomPaymentUI;
