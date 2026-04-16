import type { FC } from "react";
import Spinner from "../Spinner/Spinner"; // Assuming Spinner is in a separate file

interface SubmitButtonProps {
    label: string;
    loading?: boolean;
    loadingLabel?: string;
    className?: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({
    label,
    loading = false,
    loadingLabel = "Loading...",
    className = "bg-blue-500 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer py-2 px-4 rounded focus:outline-none focus:shadow-outline"
}) => {
    return (
        <button
            type="submit"
            disabled={loading}
            className={`${className} ${loading ? 'disabled:opacity-50 disabled:cursor-not-allowed rounded-lg'
                : ''}`}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <Spinner size="sm" />
                    <span className="ml-2">{loadingLabel}</span>
                </div>
            ) : (
                label
            )}
        </button>
    );
};

export default SubmitButton;
