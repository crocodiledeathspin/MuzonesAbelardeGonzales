import type { FC } from "react"
import { Link } from "react-router-dom"

interface backButtonProps {
    label: string
    path: string
    newClassName?: string
    className?: string
}

const BackButton: FC<backButtonProps> = ({label, path, newClassName, className}) => {
  return (
    <>
    <Link
        to={path}
        className={`${newClassName ? newClassName : `px-4 py-3 bg-blue-400 hover:bg-blue-600 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg ${className}`}`}
      >
        {label}
      </Link>
    </>
  )
}

export default BackButton