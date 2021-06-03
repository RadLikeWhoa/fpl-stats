import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { RootState } from '../../reducers'
import { setMeanStrategy, setTheme } from '../../reducers/settings'
import { SegmentedControl } from '../SegmentedControl'
import './Settings.scss'

type Props = {
    onClose?: () => void
}

const meanOptions = [
    { label: 'Average', value: 'average' },
    { label: 'Median', value: 'median' },
]

const Settings: React.FC<Props> = (props: Props) => {
    const settings = useSelector((state: RootState) => state.settings)
    const [checked, setChecked] = useState<boolean>(settings.theme === 'dark')
    const [strategy, setStrategy] = useState<string>(settings.meanStrategy)

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
        if ((checked && settings.theme === 'light') || (!checked && settings.theme === 'dark')) {
            dispatch(setTheme(checked ? 'dark' : 'light'))
        }

        if (strategy !== settings.meanStrategy) {
            dispatch(setMeanStrategy(strategy))
        }
        props.onClose?.()
    }, [dispatch, checked, props, settings, strategy])

    return (
        <div className="modal modal--settings">
            <div className="modal__backdrop" onClick={() => close()}></div>
            <div className="modal__element">
                <h3 className="modal__header">Settings</h3>
                <div className="modal__body">
                    <SegmentedControl
                        label="Display values as"
                        options={meanOptions}
                        selected={strategy}
                        setSelected={value => setStrategy(value)}
                    />
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
