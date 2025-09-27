export const renderTypeBadge = (type: string) => {
    let bgColor = "bg-gray-400";
    let label = type;

    switch (type) {
        case "dine-in":
            bgColor = "bg-green-500";
            label = "Dine In";
            break;
        case "takeaway":
            bgColor = "bg-blue-500";
            label = "Takeaway";
            break;
        case "delivery":
            bgColor = "bg-orange-500";
            label = "Delivery";
            break;
        case "kiosk":
            bgColor = "bg-orange-500";
            label = "Kiosk";
            break;
        default:
            bgColor = "bg-gray-500";
            label = type;
    }

    return (
        <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-white text-sm font-bold ${bgColor}`}
        >
            {label}
        </span>
    );
};
