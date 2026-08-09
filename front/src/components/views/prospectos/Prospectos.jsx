import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../api/api";
import { CandidateTable } from "./components/CandidateTable";
import { Filters } from "./components/Filters";
import { StatsRecap } from "./components/StatsRecap";
import { useMemo, useState } from "react";

function Prospectos({ metrics, setVista, setProspectoSeguimiento }) {

    const [filterMethod, setFilterMethod] = useState('Estatus');
    const [status, setStatus] = useState('Todos');
    const [branch, setBranch] = useState('');
    const [name, setName] = useState('');

    const { data: prospectosQuery = [] } = useQuery({
        queryKey: ['prospectos'],
        queryFn: api.getCandidatos,
    });

    const handleReset = () => {
        setStatus('Todos');
        setBranch('');
        setName('');
    };

    const prospectosFiltrados = useMemo(() => {
        return prospectosQuery.filter(candidato => {
            console.log(candidato);
            
            if (filterMethod === 'Estatus') {
                let matchStatus = true;

                if (status !== 'Todos') {
                    if (!candidato.eventos || candidato.eventos.length === 0) {
                        matchStatus = false;
                    } else {
                        const ultimoEvento = [...candidato.eventos].sort(
                            (a, b) => new Date(b.fecha) - new Date(a.fecha)
                        )[0];
                        matchStatus = ultimoEvento?.evento === status;
                    }
                }
                const matchBranch = !branch || candidato.branch === String(branch) || candidato.branch === branch;
                return matchStatus && matchBranch;
            }

            if (filterMethod === 'Nombre') {
                return candidato.firstName?.toLowerCase().includes(name.toLowerCase()) || candidato.lastName?.toLowerCase().includes(name.toLowerCase());
            }

            return true;
        });
    }, [prospectosQuery, filterMethod, status, branch, name]);

    return (
        <>
            <div className="flex justify-between items-end mt-6 mb-6 flex-wrap gap-4">
                <div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
                        PROSPECTOS
                    </h3>
                </div>
            </div>

            <StatsRecap metrics={metrics} />
            <hr className="mb-6 text-stone-300" /> 
            
            <Filters 
                filterMethod={filterMethod}
                setFilterMethod={setFilterMethod}
                status={status}
                setStatus={setStatus}
                branch={branch}
                setBranch={setBranch}
                name={name}
                setName={setName}
                handleReset={handleReset}
            />

            <CandidateTable 
                candidatos={prospectosFiltrados} 
                setVista={setVista} 
                setProspectoSeguimiento={setProspectoSeguimiento}
            />
        </>
    );
}

export default Prospectos;