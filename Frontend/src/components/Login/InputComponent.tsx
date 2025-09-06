type InputComponentProps = {
    type: string,
    placeholder: string,
    value: string,
    onChange: (value: string) => void,
    required?: boolean,
}

export default function InputComponent({type, placeholder, value, onChange, required} : InputComponentProps) {
    return (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
    )
}