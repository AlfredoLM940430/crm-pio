import { useState } from "react";
import { SuccessModal } from "../addProspecto/components/SuccessModal";
import { Icon } from "../../helpers/Icon";
import { TextField } from "../addProspecto/components/TextField";
import { SelectField } from "../addProspecto/components/SelectField";
import { api } from "../../../../api/api";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../AuthContext";

const initialFormData = {
    firstName: "",
    lastName: "",
    branch: "",
    email: "",
    phone: "",
    userLevel: "",
};

function AddColaborador({setVista}) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const {user} = useAuth();

    const { mutate: guardarColaborador } = useMutation({
        mutationFn: api.crearColaborador,
        onSuccess: (data) => {
            console.log('Colaborador guardado en MongoDB con éxito:', data);
            setShowSuccess(true);
        },
        onError: (error) => {
            console.error('Error al guardar el colaborador:', error);
        },
    });

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio";
        if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio";
        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone) {
            newErrors.phone = "El número de celular es obligatorio";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "El número de celular debe tener 10 dígitos numéricos";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "El correo electrónico es obligatorio";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "El formato del correo electrónico no es válido";
        }
        if (!formData.branch) newErrors.branch = "Selecciona la sucursal";
        if (!formData.userLevel) newErrors.userLevel = "Selecciona el tipo de usuario";
        console.log(newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const trimForm = (data) => {
        const cleanData = { ...data };
        for (const key in cleanData) {
            if (typeof cleanData[key] === "string") {
                cleanData[key] = cleanData[key].trim();
            }
        }
        return cleanData;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const trimData = trimForm(formData);
        trimData.registerBy = 'root';
        trimData.password = '123456';

        guardarColaborador(trimData);
    };

    const resetAndClose = () => {
        setShowSuccess(false);
        setFormData(initialFormData);
        setErrors({});
        setVista('dashboard')
    };

    const accessRules = {
        "1": [1, 2, 3, 4, 5, 6, 7],
        "2": [3, 4, 5, 6, 7],
        "3": [4, 5, 6, 7],
        "4": [5, 6],
        "5": [],
        "6": [],
        "7": [],
    };

    const allOptions = [
        { value: 1, label: "Superusuario" },
        { value: 2, label: "Gerencia" },
        { value: 3, label: "Encargado de captación" },
        { value: 4, label: "Auxiliar Captación" },
        { value: 5, label: "Encargado de sucursal" },
        { value: 6, label: "Ejecutivos | Captación" },
        { value: 7, label: "Captación externo" },
    ];

    const allowedValues = accessRules[user?.userLevel] || [];
    const availableOptions = allOptions.filter((opt) => allowedValues.includes(opt.value));

    return (
        <>
            <div className="pt-6 pb-6 px-4 md:px-10 max-w-4xl mx-auto relative">
                <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 transition-all duration-500 min-h-[500px]">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <section className="space-y-8">
                            <div className="border-b border-stone-200 pb-4">
                                <h1 className="text-xl font-semibold text-emerald-950 mb-1">Toma de Información</h1>
                            </div>
                
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    label="Nombre completo"
                                    id="firstName"
                                    placeholder=""
                                    value={formData.firstName}
                                    onChange={(e) => updateField("firstName", e.target.value)}
                                    required
                                    error={errors.firstName}
                                />
                                <TextField
                                    label="Apellidos"
                                    id="lastName"
                                    placeholder=""
                                    value={formData.lastName}
                                    onChange={(e) => updateField("lastName", e.target.value)}
                                    required
                                    error={errors.lastName}
                                />

                                <TextField
                                    label="Correo Electrónico"
                                    id="email"
                                    type="email"
                                    placeholder=""
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    required
                                    error={errors.email}
                                />

                
                                <TextField
                                    label="Numero de celular"
                                    id="phone"
                                    type="tel"
                                    placeholder="+52 (000) 000-0000"
                                    value={formData.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    error={errors.phone}
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
                                    value={formData.branch}
                                    onChange={(e) => updateField("branch", e.target.value)}
                                    required
                                    error={errors.branch}
                                />
                                <SelectField
                                    label="Tipo de colaborador"
                                    id="userLevel"
                                    placeholder="Tipo de colaborador"
                                    options={availableOptions}
                                    value={formData.userLevel}
                                    onChange={(e) => updateField("userLevel", e.target.value)}
                                    required
                                    error={errors.userLevel}
                                />
                            </div>
                        </section>
                        <div className="flex justify-between items-center pt-8 border-t border-stone-200">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-3 bg-emerald-950 text-white rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-[0px_4px_12px_rgba(27,67,50,0.08)]"
                            >
                                <span>Guardar colaborador</span>
                                <Icon name="send" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <SuccessModal open={showSuccess} onClose={resetAndClose} setVista={setVista} />
        </>
)};

export default AddColaborador;