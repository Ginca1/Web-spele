export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <div className={`error-messages ${className}`} {...props}>
           
            {Array.isArray(message) ? (
                message.map((msg, index) => (
                    <div key={index} className="error-message">
                        {msg}
                    </div>
                ))
            ) : (
                <div className="error-message">{message}</div>
            )}
        </div>
    ) : null;
}