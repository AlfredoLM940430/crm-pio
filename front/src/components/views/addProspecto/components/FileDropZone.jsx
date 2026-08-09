import { useRef } from "react";
import { Icon } from "../../../helpers/Icon";

export const FileDropZone = ({ icon, title, subtitle, file, onFileChange }) => {
  const inputRef = useRef(null);

  return (
        <div className="space-y-3">
            <div
                className="border-2 border-dashed border-stone-300 rounded-xl p-10 flex flex-col items-center justify-center gap-4 bg-stone-50 hover:bg-stone-100 transition-all cursor-pointer group"
                onClick={() => inputRef.current?.click()}
            >
                <Icon
                    name={icon}
                    className="text-4xl text-stone-500 group-hover:scale-110 transition-transform"
                />
                <div className="text-center">
                    <p className="text-sm font-semibold">{file ? file.name : title}</p>
                    <p className="text-xs text-stone-500">{subtitle}</p>
                </div>
                <input
                    ref={inputRef}
                    accept="image/*,.pdf"
                    className="hidden"
                    type="file"
                    onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                />
                <button
                    type="button"
                    className="bg-emerald-950 text-white px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                    }}
                >
                    Buscar Archivos
                </button>
            </div>
        </div>
)}