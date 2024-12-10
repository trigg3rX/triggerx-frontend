export function FunctionArguments({ selectedFunction, functionInputs, onInputChange }) {
  if (!selectedFunction) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Function Arguments</label>
      {selectedFunction.inputs.map((input, index) => (
        <div key={index} className="mb-2">
          <label className="block text-xs text-gray-400 mb-1">
            {input.name || `Argument ${index + 1}`} ({input.type})
          </label>
          <input
            type="text"
            value={functionInputs[index]}
            onChange={(e) => onInputChange(index, e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300"
            placeholder={`Enter ${input.type}`}
          />
        </div>
      ))}
    </div>
  );
} 