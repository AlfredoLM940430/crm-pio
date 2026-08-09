import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { api } from '../../../../../api/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChartComponent = () => {
    
    const { data: referalSource = [] } = useQuery({
        queryKey: ['referal-source'],
        queryFn: api.getReferalSource,
    });

    const labels = Object.keys(referalSource);
    const values = Object.values(referalSource);
    
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Cantidad',
                data: values,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            position: 'bottom',
            },
        },
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <h3 className="text-center font-sans font-semibold text-gray-700 mb-4 text-lg">
                Origen de Prospectos
            </h3>
            <div className="w-full h-[320px] md:h-[350px] relative">
                <Pie data={data} options={options} />
            </div>
        </div>
)}