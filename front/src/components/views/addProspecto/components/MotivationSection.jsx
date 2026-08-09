import { Icon } from "../../../helpers/Icon";
import { SelectField } from "./SelectField";
import { TextField } from "./TextField";

export const MotivationSection = ({ data, onChange, errors, handlePrev, currentStep, logginUser }) => {

    return (
        <>
        <section className="space-y-8">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-xl font-semibold text-emerald-950 mb-1">
                Operativa
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                    label="Producto de interes"
                    id="interested_product"
                    placeholder="¿En que producto esta interesado?"
                    options={[
                        { value: "Solicitar crédito", label: "Solicitar crédito" },
                        { value: "Ingresar como socio", label: "Ingresar como socio" },
                        { value: "Ahorro | Inversión", label: "Ahorro | Inversión" },
                        { value: "Otros servicios", label: "Otros servicios" },
                    ]}
                    value={data.interested_product}
                    onChange={(e) => onChange("interested_product", e.target.value)}
                    required
                    error={errors.interested_product}
                />
                <SelectField
                    label="¿Como nos conocio?"
                    id="referal_source"
                    placeholder="Selecciona una opcion"
                    options={[
                        { value: "Publicidad (redes, medios)", label: "Publicidad (redes, medios)" },
                        { value: "Recomendación", label: "Recomendación" },
                        { value: "Llegó solo", label: "Llegó solo" },
                    ]}
                    value={data.referal_source}
                    onChange={(e) => onChange("referal_source", e.target.value)}
                    required
                    error={errors.referal_source}
                />
                <SelectField
                    label="Sucursal"
                    id="branch"
                    placeholder="Selecciona una sucursal"
                    options={[
                        { value: "Colotlán", label: "Colotlán" },
                        { value: "Tlaltenango", label: "Tlaltenango" },
                        { value: "Huejúcar", label: "Huejúcar" },
                        { value: "San Martín", label: "San Martín" },
                        { value: "Bolaños", label: "Bolaños" },
                        { value: "Río Grande", label: "Río Grande" },
                        { value: "Teúl", label: "Teúl" },
                        { value: "Fresnillo Centro", label: "Fresnillo Centro" },
                        { value: "Villa Guerrero", label: "Villa Guerrero" },
                        { value: "Puente de Camotlán", label: "Puente de Camotlán" },
                        { value: "Huejuquilla", label: "Huejuquilla" },
                        { value: "Jerez", label: "Jerez" },
                        { value: "Zacatecas", label: "Zacatecas" },
                        { value: "Monte Escobedo", label: "Monte Escobedo" },
                        { value: "Fresnillo Plateros", label: "Fresnillo Plateros" },
                        { value: "Tesistán", label: "Tesistán" },
                        { value: "Aguascalientes", label: "Aguascalientes" },
                        { value: "Puerto Vallarta", label: "Puerto Vallarta" },
                    ]}
                    value={data.branch}
                    onChange={(e) => onChange("branch", e.target.value)}
                    required
                    error={errors.branch}
                />
                <TextField
                    label="Responsable de alta"
                    id="registerBy"
                    placeholder=""
                    value={logginUser}
                    required
                    error={errors.registerBy}
                    disabled={true}
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
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-emerald-950 text-white rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-[0px_4px_12px_rgba(27,67,50,0.08)]"
            >
                <span>Guardar Prospecto</span>
                <Icon name="send" />
            </button>
        </div>
        </>
)}


