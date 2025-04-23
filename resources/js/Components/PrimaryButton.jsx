export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white 
                    bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 
                    transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed 
                    ${className}`}
                disabled={disabled}
            >
            {children}
        </button>
    );
}
