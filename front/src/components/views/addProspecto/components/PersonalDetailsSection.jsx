import { Icon } from "../../../helpers/Icon"
import { TextField } from "./TextField"

export const PersonalDetailsSection = ({ data, onChange, errors, handlePrev, handleNext, currentStep }) => {
    return (
        <>
        <section className="space-y-8">
            <div className="border-b border-stone-200 pb-4">
                <h1 className="text-xl font-semibold text-emerald-950 mb-1">Informacion Personal</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                    label="Nombre completo"
                    id="firstName"
                    placeholder=""
                    value={data.firstName}
                    onChange={(e) => onChange("firstName", e.target.value)}
                    required
                    error={errors.firstName}
                />
                <TextField
                    label="Apellidos"
                    id="lastName"
                    placeholder=""
                    value={data.lastName}
                    onChange={(e) => onChange("lastName", e.target.value)}
                    required
                    error={errors.lastName}
                />
                <div className="md:col-span-2">
                    <TextField
                        label="Correo Electrónico"
                        id="email"
                        type="email"
                        placeholder=""
                        value={data.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        //required
                        error={errors.email}
                    />
                </div>

                <TextField
                    label="Numero de celular"
                    id="phone"
                    type="tel"
                    placeholder="+52 (000) 000-0000"
                    value={data.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    error={errors.phone}
                />
                <TextField
                    label="Fecha de nacimiento"
                    id="dob"
                    type="date"
                    value={data.dob}
                    onChange={(e) => onChange("dob", e.target.value)}
                    error={errors.dob}
                />
            </div>
        </section>
        <div className="flex justify-between items-center pt-8 border-t border-stone-200">
            <button
                type="button"
                onClick={handlePrev}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-stone-500 hover:bg-stone-100 transition-all ${
                    currentStep === 1 ? "opacity-0 pointer-events-none" : ""
                }`}
            >
                <Icon name="arrow_back" />
                Back
            </button>
            <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-950 text-white rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            >
                <span>Continuar</span>
                <Icon name="arrow_forward" />
            </button>
        </div>
        </>
)}