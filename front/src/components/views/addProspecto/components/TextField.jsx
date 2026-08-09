export const TextField = ({ label, id, type = "text", placeholder, value, onChange, required, error, disabled = false }) => {

    if(id == 'phone') {
        return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-500" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`bg-white border rounded-lg p-3 focus:ring-2 focus:ring-emerald-950 focus:border-emerald-950 transition-all outline-none disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed ${
                    error ? "border-red-600" : "border-stone-300"
                }`}
                maxLength={10}
                onKeyDown={(e) => {
                    if (["Backspace", "Delete", "Tab", "Escape", "Enter"].includes(e.key)) {
                        return;
                    }
                    if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
            />
        </div>
        )
    }
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-500" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`bg-white border rounded-lg p-3 focus:ring-2 focus:ring-emerald-950 focus:border-emerald-950 transition-all outline-none disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed ${
                    error ? "border-red-600" : "border-stone-300"
                }`}
            />
        </div>
)}