interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  incrementDisabled?: boolean;
  decrementDisabled?: boolean;
}

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  incrementDisabled = false,
  decrementDisabled = false,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrement}
        disabled={decrementDisabled}
        className="h-8 w-8 rounded border disabled:cursor-not-allowed disabled:opacity-50"
      >
        -
      </button>
      <span className="w-6 text-center">{quantity}</span>
      <button
        onClick={onIncrement}
        disabled={incrementDisabled}
        className="h-8 w-8 rounded border disabled:cursor-not-allowed disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}
