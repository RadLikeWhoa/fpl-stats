import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Checkbox } from '../Checkbox'
import { RootState } from '../../reducers'
import { setMeanStrategy, setTheme } from '../../reducers/settings'
import { SegmentedControl } from '../SegmentedControl'
import { Modal } from '../Modal'
import './SettingsModal.scss'

type Props = {
    onClose?: () => void
}

const meanOptions = [
    { label: 'Average', value: 'average' },
    { label: 'Median', value: 'median' },
]

const SettingsModal: React.FC<Props> = (props: Props) => {
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

    useEffect(() => {
        if ((checked && settings.theme === 'light') || (!checked && settings.theme === 'dark')) {
            dispatch(setTheme(checked ? 'dark' : 'light'))
        }
    }, [checked, dispatch, settings.theme])

    useEffect(() => {
        if (strategy !== settings.meanStrategy) {
            dispatch(setMeanStrategy(strategy))
        }
    }, [dispatch, settings.meanStrategy, strategy])

    return (
        <Modal title="Settings" onClose={() => props.onClose?.()} cssClasses="modal--settings">
            <SegmentedControl
                label="Display values as"
                options={meanOptions}
                selected={strategy}
                setSelected={value => setStrategy(value)}
            />
            <Checkbox label="Use dark mode" checked={checked} onChange={e => setChecked(e.target.checked)} reversed />
        </Modal>
    )
}

export default SettingsModal
