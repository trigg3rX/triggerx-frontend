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
        <label className="block text-sm sm:text-base font-medium text-gray-300 text-nowrap mb-6">
          Function Arguments
        </label>
        {isDisabled && (
          <span className="text-sm text-yellow-400 mb-6">
            Arguments disabled for dynamic type
          </span>
        )}
      </div>
      {!isDisabled && (selectedFunction.inputs.map((input, index) => (
        <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between mt-6">
          <label className="block text-xs text-gray-400 text-nowrap">
            {input.name || `Argument ${index + 1}`} ({input.type})
          </label>
          <input
            type="text"
            value={functionInputs[index] || ""}
            onChange={(e) => onInputChange(index, e.target.value)}
            className={`text-xs xs:text-sm sm:text-base w-full md:w-[60%] xl:w-[70%] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none  ${
              isDisabled ? "opacity-50 cursor-not-allowed bg-gray-800" : ""
            }`}
            placeholder={`Enter ${input.type}`}
            disabled={isDisabled}
            readOnly={isDisabled}
            required
          />
        </div>
      )))}
    </div>
  );
}
