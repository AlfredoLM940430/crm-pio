import { useState } from "react";
import { EstadoSocket } from "../../../hooks/EstadoSocket";
import { ApplicationGrowthChart } from "./components/ApplicationGrowthChart"
import { MetricsGrid } from "./components/MetricsGrid";
import { PieChartComponent } from "./components/PieChartComponent";
import { RecentActivity } from "./components/RecentActivity";
import { SemaforoBarChart } from "./components/SemaforoBarChart";
import { UpcomingInterviews } from "./components/UpcomingInterviews";

function Dashboard({metrics}) {

    return (
        <div className="pt-6">
            <div className="">
                <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6 rounded-xl border-b border-stone-100">
                    <div className="gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
                                    DASHBOARD
                                </h3>
                            </div>
                            <p className="text-stone-500 text-sm mt-1 sm:mt-2">
                                Estado general de aspirantes en <span className="font-semibold text-stone-700">Pío XII</span>.
                            </p>
                        </div>
                    </div>
                </div>

                <MetricsGrid metricsApi={metrics} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm">
                        <ApplicationGrowthChart metrics={metrics} />
                    </div>

                    <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm">
                        <SemaforoBarChart />
                    </div>
                    <div className="lg:col-span-6 rounded-2xl shadow-sm max-h-[420px]">
                        <RecentActivity  />
                    </div>
                    <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm max-h-[420px]">
                        <PieChartComponent />
                    </div>
                </div>
            </div>
        </div>
)}

export default Dashboard;