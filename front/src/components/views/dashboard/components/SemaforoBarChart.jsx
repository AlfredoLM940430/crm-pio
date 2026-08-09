import { useQuery } from '@tanstack/react-query';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { api } from '../../../../../api/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const COLOR_MAP = {
    rojo: {
        bg: 'rgba(200, 0, 0, 1)',
        border: 'rgba(255, 0, 0, 1)',
    },
    amarillo: {
        bg: 'rgba(234, 179, 8, 0.8)',
        border: 'rgba(234, 179, 8, 1)',
    },
    verde: {
        bg: 'rgba(0, 125, 25, 1)',
        border: 'rgba(34, 197, 94, 1)',
    },
};

export const SemaforoBarChart = () => {

    const { data: semaforo = [] } = useQuery({
        queryKey: ['semaforo'],
        queryFn: api.getSemaforo,
    });

    const safeData = Array.isArray(semaforo) ? semaforo : [];

    const labels = safeData.map((item) => item._id.toUpperCase());
    const values = safeData.map((item) => item.cantidad);

    const backgroundColors = safeData.map(
        (item) => COLOR_MAP[item._id.toLowerCase()]?.bg || 'rgba(156, 163, 175, 0.8)'
    );
    const borderColors = safeData.map(
        (item) => COLOR_MAP[item._id.toLowerCase()]?.border || 'rgba(156, 163, 175, 1)'
    );

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Aspirantes',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => ` Total: ${context.raw} prospectos`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <h3 className="text-center font-sans font-semibold text-gray-700 mb-4 text-lg">
                Semáforo de Seguimiento
            </h3>
            <div className="w-full h-[300px] relative">
                <Bar data={data} options={options} />
            </div>
        </div>
)};