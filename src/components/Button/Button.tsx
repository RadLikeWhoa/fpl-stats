import React from 'react'
import './Button.scss'

type Props = {
    label: string
    type?: 'reset' | 'submit' | 'button'
    disabled?: boolean
    onClick?: () => void
}

const Button: React.FC<Props> = (props: Props) => (
    <button className="button" type={props.type || 'button'} onClick={props.onClick} disabled={props.disabled}>
        {props.label}
    </button>
)

export default Button
