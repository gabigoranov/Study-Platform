import { useTranslation } from "react-i18next";
import { keys } from "../types/keys";

export default function Flashcards() {
    const { t } = useTranslation();
    
    return (
        <h1>{t(keys.flashcards)}</h1>
    )
}