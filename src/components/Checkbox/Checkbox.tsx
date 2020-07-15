import React, { ChangeEvent } from 'react'
import './Checkbox.scss'

type Props = {
    label: string
    checked: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: React.FC<Props> = (props: Props) => (
    <div className="checkbox">
        <label className="checkbox__label">
            <input
                type="checkbox"
                className="checkbox__element"
                checked={props.checked}
                onChange={props.onChange}
            />
            <div className="checkbox__visual"></div>
            {props.label}
        </label>
    </div>
)

export default Checkbox