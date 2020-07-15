import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import './Modal.scss'
import { setId } from '../../reducers/settings'
import { Button } from '../Button'

type Props = {
    onClose?: () => void
}

const validateId = (value: string) => {
    const number = Number(value)
    return value && !Number.isNaN(number) && Number.isInteger(number)
}

const Modal: React.FC<Props> = (props: Props) => {
    const [ value, setValue ] = useState<string>('')

    const dispatch = useDispatch()

    const close = () => {
        dispatch(setId(Number(value)))

        if (props.onClose) {
            props.onClose()
        }
    }

    return (
        <div className="modal">
            <div className="modal__element">
                <header className="modal__header">
                    Enter Your Team ID
                </header>
                <div className="modal__body">
                    <input
                        className="modal__input"
                        type="text"
                        placeholder="e.g. 4654486"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </div>
                <footer className="modal__footer">
                    <Button
                        label="Show Stats"
                        disabled={!validateId(value)}
                        onClick={close}
                    />
                </footer>
            </div>
        </div>
    )
}

export default Modal
