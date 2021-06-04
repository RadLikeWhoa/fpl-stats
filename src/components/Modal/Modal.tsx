import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button } from '../Button'
import { validateTeamId } from '../../utilities'
import { RootState } from '../../reducers'
import './Modal.scss'

type Props = {
    onClose?: () => void
}

const Modal: React.FC<Props> = (props: Props) => {
    const [value, setValue] = useState<string>('')
    const isLoading = useSelector((state: RootState) => state.loading > 0)

    const history = useHistory()

    const close = useCallback(
        (cancel: boolean) => {
            if (!cancel) {
                history.push(`/${value}/`)
            } else {
                props.onClose?.()
            }
        },
        [value, history, props]
    )

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close(true)
            }
        }

        document.addEventListener('keyup', listener)

        return () => document.removeEventListener('keyup', listener)
    }, [close])

    const callbackRef = useCallback(inputElement => inputElement?.focus(), [])

    return (
        <form
            onSubmit={e => {
                close(false)
                e.preventDefault()
            }}
        >
            <div className="modal">
                <div className="modal__backdrop" onClick={() => close(true)}></div>
                <div className="modal__element">
                    <h3 className="modal__header">
                        Enter Your Team ID
                        <Button label="X" onClick={() => close(true)} aria-label="Close" />
                    </h3>
                    <div className="modal__body">
                        <div className="modal__input-wrapper">
                            <label htmlFor="query">Team ID</label>
                            <input
                                className="modal__input"
                                type="text"
                                placeholder="e.g. 4654486"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                ref={callbackRef}
                            />
                        </div>
                    </div>
                    <footer className="modal__footer">
                        <Button label="Show Stats" type="submit" disabled={!validateTeamId(value) || isLoading} />
                    </footer>
                </div>
            </div>
        </form>
    )
}

export default Modal
