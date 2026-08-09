import { Icon } from "../../../helpers/Icon";

export const SuccessModal = ({ open, onClose }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center transition-opacity duration-300">
            <div className="bg-white rounded-2xl p-12 max-w-lg w-full text-center shadow-2xl">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-950 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="task_alt" className="text-5xl" />
                </div>
                <h2 className="text-2xl font-semibold text-emerald-950 mb-4">REGISTRO GUARDADO</h2>

                <div className="flex flex-col gap-4">
                    <button
                        className="bg-emerald-950 text-white py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all"
                        onClick={onClose}
                    >
                        Ir prospectos
                    </button>
                </div>
            </div>
        </div>
    )}