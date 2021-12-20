import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { Button } from '../Button'
import { validateTeamId } from '../../utilities'
import { RootState } from '../../reducers'
import { Modal } from '../Modal'
import { ModalInput } from '../ModalInput'
import { OptionType } from '../Dashboard/Dashboard'
import './TeamModal.scss'

type Props = {
    onClose?: () => void
}

const TeamModal: React.FC<Props> = (props: Props) => {
    const [value, setValue] = useState<string>('')

    const isLoading = useSelector((state: RootState) => state.loading > 0)

    const id = useSelector((state: RootState) => state.settings.id)

    const history = useHistory()

    const recentTeams: string[] = useMemo(() => JSON.parse(localStorage.getItem('recentTeams') || '[]') || [], [])

    const close = useCallback(
        (cancel: boolean, team?: OptionType) => {
            if (!cancel) {
                history.push(`/${team?.value || value}/`)
            } else if (id) {
                props.onClose?.()
            }
        },
        [id, value, history, props]
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
                cssClasses="team-modal"
                onClose={() => close(true)}
                footer={
                    recentTeams.length > 0 ? (
                        <Select
                            className="team-modal__select"
                            options={recentTeams.map(team => ({ value: team.split(' — ')[0], label: team }))}
                            onChange={option => close(false, option as OptionType)}
                            placeholder="Recent Team IDs…"
                            styles={{
                                menu: provided => ({ ...provided, zIndex: 20, width: 'calc(100% - 2rem)' }),
                            }}
                        />
                    ) : null
                }
            >
                <ModalInput
                    label="Team ID"
                    placeholder="Enter your team ID"
                    value={value}
                    onChange={value => setValue(value)}
                    type="number"
                    innerRef={callbackRef}
                />
                <Button
                    label="Show Stats"
                    type="submit"
                    disabled={!validateTeamId(value) || value === `${id}` || isLoading}
                />
            </Modal>
        </form>
    )
}

export default TeamModal
