import React from 'react'
import './ModalInput.scss'

type Props = {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    id?: string
    ref?: (element: any) => any
}

const ModalInput: React.FC<Props> = (props: Props) => {
    return (
        <div className="modal-input">
            <label htmlFor={props.id}>{props.label}</label>
            <input
                className="modal-input__element"
                id={props.id}
                type="text"
                placeholder={props.placeholder}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                ref={props.ref}
            />
        </div>
    )
}

export default ModalInput
