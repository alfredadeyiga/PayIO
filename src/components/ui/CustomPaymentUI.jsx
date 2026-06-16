function CustomPaymentUI({ card }) {
  const lastFour = card.account_number.toString().slice(-4);

  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-3 items-center">
        {card.icon && (
          <img
            src={card.icon}
            className="w-5 h-5 hidden md:block shrink-0"
            alt="icon"
          />
        )}

        {card.type}
      </div>

      <p className="text-xs shrink-0">•••• {lastFour}</p>
    </div>
  );
}

export default CustomPaymentUI;
