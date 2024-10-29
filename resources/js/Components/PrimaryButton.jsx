export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={`primary-button ${disabled ? 'disabled' : ''} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
