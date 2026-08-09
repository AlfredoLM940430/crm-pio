export const SelectField = ({ label, id, options = [], placeholder, value, onChange, required, error, disabled = false }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-500" htmlFor={id}>
                {label}
            </label>
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required={required}
                className={`bg-white border rounded-lg p-3 focus:ring-2 focus:ring-emerald-950 focus:border-emerald-950 transition-all outline-none ${
                    error ? "border-red-600" : "border-stone-300"
                }`}
                disabled={disabled}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};