export function TimeIntervalInputs({ timeInterval, onTimeIntervalChange }) {
  return (
    <div>
      <label className="block text-sm sm:text-base font-medium text-gray-300 mb-6 text-nowrap">
        Time Interval
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
          <label className="block text-xs sm:text-sm pb-3 tracking-wider">Hours</label>
          <input
            type="number"
            value={timeInterval.hours}
            onChange={(e) => onTimeIntervalChange("hours", e.target.value)}
            className="text-xs xs:text-sm sm:text-base w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none"
            placeholder="Hours"
            min="0"
            max="23"
          />
        </div>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
          <label className="block text-xs sm:text-sm pb-3 tracking-wider">Minutes</label>
          <input
            type="number"
            value={timeInterval.minutes}
            onChange={(e) => onTimeIntervalChange("minutes", e.target.value)}
            className="text-xs xs:text-sm sm:text-base w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none"
            placeholder="Minutes"
            min="0"
            max="59"
          />
        </div>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/20 transition-all duration-300">
          <label className="block text-xs sm:text-sm pb-3 tracking-wider">Seconds</label>
          <input
            type="number"
            value={timeInterval.seconds}
            onChange={(e) => onTimeIntervalChange("seconds", e.target.value)}
            className="text-xs xs:text-sm sm:text-base w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none"
            placeholder="Seconds"
            min="0"
            max="59"
          />
        </div>
      </div>
    </div>
  );
}
