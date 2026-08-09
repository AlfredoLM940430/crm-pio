import { useState } from "react";
import { PersonalDetailsSection } from "./components/PersonalDetailsSection";
import { MotivationSection } from "./components/MotivationSection";
import { Stepper } from "./components/Stepper";
import { SuccessModal } from "./components/SuccessModal";
import { useAuth } from "../../../AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../../api/api";
import { useForm } from "../../../hooks/useForm";

const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interested_product: "",
    referal_source: "",
    branch: "",
    assignedTo: null,
    registerBy: "",
    dob: "",
};

const TOTAL_STEPS = 2;

const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const stepSchemas = {
    1: {
        firstName: (v) => (!v ? "El nombre es obligatorio" : undefined),
        lastName: (v) => (!v ? "El apellido es obligatorio" : undefined),
        phone: (v) => {
            if (!v) return "El número de celular es obligatorio";
            if (!phoneRegex.test(v)) return "El número de celular debe tener 10 dígitos numéricos";
        },
        email: (v) => {
            if (!v) return "El correo electrónico es obligatorio";
            if (!emailRegex.test(v)) return "El formato del correo electrónico no es válido";
        },
        dob: (v) => (!v ? "La fecha de nacimiento es obligatoria" : undefined),
    },
    2: {
        interested_product: (v) => (!v ? "En qué producto está interesado" : undefined),
        referal_source: (v) => (!v ? "¿Cómo nos conoció?" : undefined),
        branch: (v) => (!v ? "Selecciona la sucursal" : undefined),
    },
};

function AddProspecto({ setVista, setProspectoSeguimiento }) {

    const { user } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [prospecto, setProspecto] = useState(null);

    const { values: formData, errors, updateField, validate, reset } = useForm(initialFormData);

    const queryClient = useQueryClient();

    const { mutate: guardarProspecto, isPending } = useMutation({
        mutationFn: api.crearProspecto,
        onSuccess: (data) => {
            setProspecto(data);
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
            queryClient.invalidateQueries({ queryKey: ["semaforo"] });
            queryClient.invalidateQueries({ queryKey: ["referal-source"] });
            setShowSuccess(true);
        },
        onError: (error) => {
            console.error("Error al guardar el prospecto:", error);
        },
    });

    const validateStep = (step) => validate(stepSchemas[step]);

    const handleNext = () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < TOTAL_STEPS) {
            setCurrentStep((s) => s + 1);
            scrollToTop();
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep((s) => s - 1);
            scrollToTop();
        }
    };

    const goToStep = (targetStep) => {
        if (targetStep < currentStep) {
            setCurrentStep(targetStep);
            scrollToTop();
        } else if (targetStep > currentStep) {
            if (!validateStep(currentStep)) return;
            setCurrentStep(targetStep);
            scrollToTop();
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ahora = new Date();
        if (currentStep !== TOTAL_STEPS) return;
        if (!validateStep(currentStep)) return;

        const trimData = trimForm(formData);
        trimData.registerBy = user.id;
        trimData.dateControl = ahora;
        trimData.lastDateControl = ahora;
        trimData.registerByName = user.firstName;

        if (user?.userLevel == "5" || user?.userLevel == "6") {
            trimData.assignedTo = trimData.registerBy;
        }
        
        console.log(trimData);
        guardarProspecto(trimData);
    };

    const resetAndClose = () => {
        setShowSuccess(false);
        setCurrentStep(1);
        reset();
        if (user?.userLevel == "5" || user?.userLevel == "6") {
            setProspectoSeguimiento(prospecto);
            setVista("seguimientoProspecto");
        } else {
            setVista("prospectos");
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div className="mt-10 lg:mt-15 pb-6 px-4 md:mt-10 max-w-4xl mx-auto relative">
                <Stepper currentStep={currentStep} onStepClick={goToStep} />
                <div className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 transition-all duration-500 min-h-[500px]">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <PersonalDetailsSection
                                data={formData}
                                onChange={updateField}
                                errors={errors}
                                handlePrev={handlePrev}
                                handleNext={handleNext}
                                currentStep={currentStep}
                            />
                        )}
                        {currentStep === 2 && (
                            <MotivationSection
                                data={formData}
                                onChange={updateField}
                                errors={errors}
                                handlePrev={handlePrev}
                                currentStep={currentStep}
                                logginUser={`${user.firstName} ${user.lastName}`}
                            />
                        )}
                    </form>
                </div>
            </div>

            <SuccessModal open={showSuccess} onClose={resetAndClose} setVista={setVista} />
        </>
    );
}

export default AddProspecto;
