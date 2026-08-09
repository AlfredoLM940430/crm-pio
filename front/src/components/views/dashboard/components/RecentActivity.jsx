import { Icon } from "../../../helpers/Icon";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../../api/api";

export const RecentActivity = () => {

    const { data: recentActivity = [] } = useQuery({
        queryKey: ['recent-activity'],
        queryFn: api.recentActivity,
    });

    return (
        <div className="lg:col-span-4 bg-white border border-stone-200 p-6 rounded-2xl not-first:flex flex-col w-full h-[420px] md:h-[420px] transition-all hover:shadow-[0px_4px_12px_rgba(27,67,50,0.08)]">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold text-stone-800 tracking-tight">Actividad Reciente</h4>
                <div className="bg-emerald-50 rounded-lg">
                    <Icon name={"nest_clock_farsight_analog"} className={"text-emerald-700 w-5 h-5"} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-transparent format-scrollbar">
                {recentActivity.map((a, index) => {
                    return (
                        <div key={a._id} className="flex gap-4 relative group">
                            
                            {index !== recentActivity.length - 1 && (
                                <span className="absolute left-5 top-10 bottom-[-24px] w-[2px] bg-stone-100" aria-hidden="true" />
                            )}

                            <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center z-10">
                                <Icon name={"verified"} className={"text-emerald-600 w-5 h-5"} />
                            </div>

                            <div className="flex flex-col justify-center">
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    <strong className="font-semibold text-stone-900">{a.firstName}</strong>
                                    <br />
                                    <span className="bg-stone-50 px-1.5 py-0.5 rounded text-xs font-mono text-stone-700 border border-stone-200/60">
                                        {a.KPI}
                                    </span>
                                </p>
                                <span className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                    {a.timeAgo}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
)}