const AuthImagePattern = ({title,subtitle}) => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="grid grid-cols-3 gap-2 mb-6">
                {[...Array(9)].map((_, i) => (
                    <div
                        key={i}
                        className={`aspect-square rounded-2xl ${i % 2 === 0 ? "bg-blue-500 animate-pulse" : "bg-gray-200"}`}
                    />
                ))}
            </div>
            <h2 className="text-2xl font-bold mb-4 ">{title}</h2>
            <p className="">{subtitle}</p>
        </div>
    );
};

export default AuthImagePattern;