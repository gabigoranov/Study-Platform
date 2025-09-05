import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FaChevronDown } from "react-icons/fa";

interface DropdownProps {
    options: { value: string; label: string; icon: IconType }[];
    onSelect: (value: string) => void;
}

export default function Dropdown({ options, onSelect }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left bg-neutral-300 rounded-lg">
            <div>
                <button
                    onClick={toggleDropdown}
                    className="inline-flex items-center gap-2 justify-center w-full px-4 py-3 text-md font-medium text-gray-700 bg-white bg-opacity-20 rounded-md bg-clip-padding hover:bg-opacity-50"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
                    {selectedValue ? (
                        options.find(option => option.value === selectedValue)?.icon({ size: 20, className: "mr-2" })
                    ) : (
                        <span className=""></span>
                    )}
                    {options.find(x => x.value === selectedValue)?.label || 'Select a subject'}
                    <FaChevronDown className='h-5 w-5 text-md text-gray-400' />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className="flex items-center px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                role="menuitem"
                            >
                                {option.icon({ size: 20, className: "mr-2" })}
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
