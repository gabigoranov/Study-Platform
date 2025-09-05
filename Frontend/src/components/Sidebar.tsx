import Dropdown from "./Dropdown";
import { FaLaptopCode, FaCalculator, FaFlask } from 'react-icons/fa';
import { AiFillHome } from "react-icons/ai";    
import { PiNoteBlankFill } from "react-icons/pi";
import { MdMap } from "react-icons/md";

type SidebarProps = {
    isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
    const options = [
        { value: 'informatics', label: 'Informatics', icon: FaLaptopCode },
        { value: 'math', label: 'Math', icon: FaCalculator },
        { value: 'biology', label: 'Biology', icon: FaFlask },
    ];

    const handleSelect = (value: string) => {
        console.log(`Selected subject: ${value}`);
        // You can add additional logic here based on the selected value
    };

    return (
        <div className={`
            p-2 flex flex-col gap-2
            fixed md:static
            h-screen
            w-64
            bg-background-muted
            z-40
            transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            shadow-lg shadow-black/20
        `}>
                <h2 className="text-4xl font-bold">Study<br />Mate</h2>
                <Dropdown options={options} onSelect={handleSelect} />
                <nav className="pl-4 mt-6">
                    <ul>
                        <li className="flex g-4 items-center">
                            <AiFillHome className="text-xl mr-2" />
                            <a className="block text-xl text-gray-800 hover:text-gray-900" href="#">Home</a>
                        </li>
                        <li className="flex g-4 items-center">
                            <PiNoteBlankFill className="text-xl mr-2"/>
                            <a className="block text-xl text-gray-800 hover:text-gray-900" href="#">Flashcards</a>
                        </li>
                        <li className="flex g-4 items-center">
                            <MdMap className="text-xl mr-2"/>
                            <a className="block text-xl text-gray-800 hover:text-gray-900" href="#">Mindmaps</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
