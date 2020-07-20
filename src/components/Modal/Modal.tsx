import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setId } from '../../reducers/settings'
import { Button } from '../Button'
import useClickOutside from '../../hooks/clickOutside';
import { validateTeamId } from '../../utilities'
import { RootState } from '../../reducers'
import './Modal.scss'

type Props = {
    onClose?: () => void
}

const Modal: React.FC<Props> = (props: Props) => {
    const [ value, setValue ] = useState<string>('')

    const id = useSelector((state: RootState) => state.settings.id)

    const dispatch = useDispatch()

    const close = useCallback((cancel: boolean) => {
        if (!id) {
            return
        }

        if (!cancel) {
            dispatch(setId(Number(value)))
        }

        if (props.onClose) {
            props.onClose()
        }
    }, [ dispatch, props, value, id ])

    const ref = useClickOutside<HTMLDivElement>(() => close(true))

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close(true)
            }
        }

        document.addEventListener('keyup', listener)

        return () => document.removeEventListener('keyup', listener)
    }, [ close ])

    return (
        <form onSubmit={() => close(false)}>
            <div className="modal">
                <div className="modal__element" ref={ref}>
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
                            type="submit"
                            disabled={!validateTeamId(value)}
                        />
                    </footer>
                </div>
            </div>
        </form>
    )
}

export default Modal
