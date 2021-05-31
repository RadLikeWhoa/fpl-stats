import React from 'react'
import classNames from 'classnames'
import './Button.scss'

type Props = {
    label: string
    type?: 'reset' | 'submit' | 'button'
    disabled?: boolean
    secondary?: boolean
    onClick?: () => void
}

const Button: React.FC<Props> = (props: Props) => (
    <button
        className={classNames('button', { 'button--secondary': props.secondary })}
        type={props.type || 'button'}
        onClick={props.onClick}
        disabled={props.disabled}
    >
        {props.label}
    </button>
)

export default Button