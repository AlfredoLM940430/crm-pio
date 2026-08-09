import { FileDropZone } from "./FileDropZone"
import { Icon } from "../../../helpers/Icon"

export const VerificationSection = ({ data, onFileChange }) => {
    return (
        <section className="space-y-8">
            <div className="border-b border-stone-200 pb-4">
                <h2 className="text-xl font-semibold text-emerald-950 mb-1">Documentación</h2>
            </div>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-stone-500">Identificación (Pasaporte, INE, etc.)</label>
                    <FileDropZone
                        icon="cloud_upload"
                        title="Arrastra o sube el documento en esta zona"
                        subtitle="(JPG, PDF)"
                        file={data.idFile}
                        onFileChange={(f) => onFileChange("idFile", f)}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-stone-500">Comprobante de domicilio </label>
                    <FileDropZone
                        icon="home_pin"
                        title="Recibo CFE o Agua municipal"
                        subtitle="No mayor a 3 meses de antiguedad"
                        file={data.proofFile}
                        onFileChange={(f) => onFileChange("proofFile", f)}
                    />
                </div>
            </div>
        </section>
)}