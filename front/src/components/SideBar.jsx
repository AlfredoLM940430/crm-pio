import { Icon } from "./helpers/Icon";
import logo from "../../public/img/logo-caja-pio.png"
import { UserMenu } from "./helpers/UserMenu";
import { useAuth } from "../AuthContext";
import { puedeVer } from "../config/Permissions";

export const SideBar = ({ vistaActual, setVista, sidebarOpen, setSidebarOpen }) => {
    const { user } = useAuth(); // asumiendo que expone { user: { nivel, ... } }

    const navItems = [
        { id: "dashboard", icon: "dashboard", label: "Dashboard" },
        { id: "prospectos", icon: "group", label: "Prospectos" },
        // { id: "eventos", icon: "work", label: "Eventos" },
        { id: "agregarProspecto", icon: "add", label: "Agregar Prospecto" },
        { id: "agregarColaborador", icon: "add", label: "Agregar Colaborador" },
        // { id: "configuracion", icon: "settings", label: "Configuracion" },
    ].filter((item) => puedeVer(user?.userLevel, item.id));

    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <aside
                className={`h-screen w-64 fixed left-0 top-0 bg-white border-r border-stone-200
                flex flex-col py-6 px-4 z-20 transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="mb-10 px-2 flex items-center justify-between">
                    <img src={logo} alt="Logo" width={150} className="cursor-pointer" onClick={() => setVista('dashboard')} />
                    <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                        <Icon name="close" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = vistaActual === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setVista(item.id)}
                                className={
                                    isActive
                                        ? "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-950 font-bold bg-stone-100 transition-colors duration-200 text-left"
                                        : "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-stone-500 hover:text-emerald-950 hover:bg-stone-100 transition-colors duration-200 text-left"
                                }
                            >
                                <Icon name={item.icon} />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t border-stone-200 pt-4 px-2">
                    <UserMenu />
                </div>
            </aside>
        </>
    );
};