import { Icon } from "../../../helpers/Icon";

const steps = [
    { number: 1, label: "Detalles Personales" },
    { number: 2, label: "Motivatación" },
];

export const Stepper = ({ currentStep, onStepClick }) => {
    return (
        <div className="mb-8 flex items-center justify-between relative z-0">
            <div className="absolute top-5 left-0 right-0 mx-5 h-[2px] -z-10">
                <div className="absolute inset-0 bg-stone-200" />
                <div 
                    className="absolute left-0 top-0 h-full bg-emerald-950 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
            </div>
            
            {steps.map((step, index) => {
                const isCompleted = currentStep > index + 1;
                const isActive = currentStep === index + 1;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onStepClick(index + 1)}
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 bg-white ${
                            isActive 
                                ? "border-emerald-950 text-emerald-950" 
                                : isCompleted 
                                ? "border-emerald-950 text-emerald-950" 
                                : "border-stone-200 text-stone-400"
                        }`}
                    >
                        {isCompleted ? (
                            <Icon name="check" className="text-emerald-950" />
                        ) : (
                            <span>{index + 1}</span>
                        )}
                    </button>
                );
            })}
        </div>
  )}