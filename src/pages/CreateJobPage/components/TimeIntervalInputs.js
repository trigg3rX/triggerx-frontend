export function TimeIntervalInputs({ timeInterval, onTimeIntervalChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Time Interval</label>
      <div className="grid grid-cols-3 gap-4">
        <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
          <label className="block text-sm">Hours</label>
          <input
            type="number"
            value={timeInterval.hours}
            onChange={(e) => onTimeIntervalChange('hours', e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-800"
            placeholder="Hours"
            min="0"
            max="23"
          />
        </div>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
          <label className="block text-sm">Minutes</label>
          <input
            type="number"
            value={timeInterval.minutes}
            onChange={(e) => onTimeIntervalChange('minutes', e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-800"
            placeholder="Minutes"
            min="0"
            max="59"
          />
        </div>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
          <label className="block text-sm">Seconds</label>
          <input
            type="number"
            value={timeInterval.seconds}
            onChange={(e) => onTimeIntervalChange('seconds', e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-gray-800"
            placeholder="Seconds"
            min="0"
            max="59"
          />
        </div>
      </div>
    </div>
  );
} 