//FunctionArguments.js
export function FunctionArguments({
  selectedFunction,
  functionInputs,
  onInputChange,
  argumentType,
}) {
  if (!selectedFunction || !selectedFunction.inputs.length) return null;

  const isDisabled = argumentType === "dynamic";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-300 tracking-wider">
          Function Arguments
        </label>
        {isDisabled && (
          <span className="text-sm text-yellow-400">
            Arguments disabled for dynamic type
          </span>
        )}
      </div>
      {selectedFunction.inputs.map((input, index) => (
        <div key={index} className="space-y-2">
          <label className="block text-xs text-gray-400">
            {input.name || `Argument ${index + 1}`} ({input.type})
          </label>
          <input
            type="text"
            value={functionInputs[index] || ""}
            onChange={(e) => onInputChange(index, e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none  ${
              isDisabled ? "opacity-50 cursor-not-allowed bg-gray-800" : ""
            }`}
            placeholder={`Enter ${input.type}`}
            disabled={isDisabled}
            readOnly={isDisabled}
          />
        </div>
      ))}
    </div>
  );
}
