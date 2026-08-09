const infoCards = [
    {
        icon: "shield",
        iconBg: "bg-orange-100",
        iconColor: "text-amber-700",
        title: "Data Privacy",
        text: "MemberTrack uses enterprise-grade encryption to protect your sensitive application data from end to end.",
    },
    {
        icon: "history",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-900",
        title: "Review Process",
        text: "Applications are typically reviewed by the Council of Stewards within 3-5 business days of submission.",
    },
    {
        icon: "contact_support",
        iconBg: "bg-stone-200",
        iconColor: "text-stone-700",
        title: "Need Assistance?",
        text: "Our onboarding specialists are available 24/7. Use the help widget or email steward@membertrack.org.",
    },
];

export const SupportCards = () => {
    return (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {infoCards.map((card) => (
            <div key={card.title} className="bg-white border border-stone-200 p-6 rounded-xl space-y-4">
            <span className={`inline-block material-symbols-outlined ${card.iconColor} p-2 ${card.iconBg} rounded-lg`}>
                {card.icon}
            </span>
            <h3 className="text-sm font-semibold">{card.title}</h3>
            <p className="text-xs text-stone-500 leading-relaxed">{card.text}</p>
            </div>
        ))}
        </div>
)}
