import React from 'react'
import './Button.scss'

type Props = {
    label: string
    disabled?: boolean
    onClick?: () => void
}

const Button: React.FC<Props> = (props: Props) => (
    <button
        className="button"
        onClick={props.onClick}
        disabled={props.disabled}
    >
        {props.label}
    </button>
)

export default Button