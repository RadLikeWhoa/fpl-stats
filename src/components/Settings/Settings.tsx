import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { RootState } from '../../reducers'
import { setTheme } from '../../reducers/settings'
import './Settings.scss'

type Props = {
    onClose?: () => void
}

const Settings: React.FC<Props> = (props: Props) => {
    const settings = useSelector((state: RootState) => state.settings)
    const [checked, setChecked] = useState<boolean>(settings.theme === 'dark')

    const dispatch = useDispatch()

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                props.onClose?.()
            }
        }

        document.addEventListener('keyup', listener)

        return () => document.removeEventListener('keyup', listener)
    }, [props])

    const close = useCallback(() => {
        dispatch(setTheme(checked ? 'dark' : 'light'))
        props.onClose?.()
    }, [dispatch, checked, props])

    return (
        <div className="modal">
            <div className="modal__backdrop" onClick={() => close()}></div>
            <div className="modal__element">
                <h3 className="modal__header">Settings</h3>
                <div className="modal__body">
                    <Checkbox label="Use dark mode" checked={checked} onChange={e => setChecked(e.target.checked)} />
                </div>
                <footer className="modal__footer">
                    <Button label="Save Settings" type="button" onClick={() => close()} />
                </footer>
            </div>
        </div>
    )
}

export default Settings
