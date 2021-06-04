import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button } from '../Button'
import { validateTeamId } from '../../utilities'
import { RootState } from '../../reducers'
import { Modal } from '../Modal'
import { ModalInput } from '../ModalInput'

type Props = {
    onClose?: () => void
}

const TeamModal: React.FC<Props> = (props: Props) => {
    const [value, setValue] = useState<string>('')

    const isLoading = useSelector((state: RootState) => state.loading > 0)

    const id = useSelector((state: RootState) => state.settings.id)

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
            <Modal
                title="Select Team"
                onClose={() => close(true)}
                footer={
                    <Button
                        label="Show Stats"
                        type="submit"
                        disabled={!validateTeamId(value) || value === `${id}` || isLoading}
                    />
                }
            >
                <ModalInput
                    label="Team ID"
                    placeholder="Enter your team ID"
                    value={value}
                    onChange={value => setValue(value)}
                    ref={callbackRef}
                />
            </Modal>
        </form>
    )
}

export default TeamModal
