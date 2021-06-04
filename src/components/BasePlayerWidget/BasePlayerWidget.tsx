import React, { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { StatData } from '../../types'
import { normaliseDiacritics } from '../../utilities'
import { Button } from '../Button'
import { Widget } from '../Widget'
import { ModalInput } from '../ModalInput'
import './BasePlayerWidget.scss'

type Props = {
    title: string
    max: number
    players: StatData[]
    renderItem: (player: StatData) => JSX.Element | null
    cssClasses?: string
}

const renderList = (players: StatData[], renderItem: (player: StatData) => JSX.Element | null): JSX.Element => (
    <ul className="widget__list">
        {players.map(player => {
            const item = renderItem(player)

            if (!item) {
                return null
            }

            return (
                <li className="widget__list__item" key={player.element.id}>
                    {item}
                </li>
            )
        })}
    </ul>
)

const BasePlayerWidget: React.FC<Props> = (props: Props) => {
    const [value, setValue] = useState<string>('')
    const [showExtended, setShowExtended] = useState<boolean>(false)

    const callbackRef = useCallback(inputElement => inputElement?.focus(), [])

    const close = useCallback(() => {
        setShowExtended(false)
        setValue('')
    }, [setShowExtended, setValue])

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close()
            }
        }

        document.addEventListener('keyup', listener)

        return () => document.removeEventListener('keyup', listener)
    }, [close])

    const filteredPlayers = value
        ? props.players.filter(player =>
              normaliseDiacritics(player.element.web_name)
                  .toLowerCase()
                  .includes(normaliseDiacritics(value).toLowerCase())
          )
        : props.players

    const topPlayers = props.players.slice(0, props.max)

    return (
        <>
            <Widget title={props.title} cssClasses={classNames('base-player-widget', props.cssClasses)}>
                {props.players.length > 0 && (
                    <>
                        {renderList(topPlayers, props.renderItem)}
                        {props.players.length > props.max && (
                            <Button label="Show all" onClick={() => setShowExtended(true)} />
                        )}
                    </>
                )}
            </Widget>
            {showExtended && (
                <div className="modal modal--players">
                    <div className="modal__backdrop" onClick={() => close()}></div>
                    <Widget title={props.title} onClose={() => close()}>
                        <ModalInput
                            label="Name"
                            placeholder="Filter by name"
                            id="query"
                            value={value}
                            onChange={value => setValue(value)}
                            ref={callbackRef}
                        />
                        <div className="widget__scroller">
                            {filteredPlayers.length > 0 ? (
                                renderList(filteredPlayers, props.renderItem)
                            ) : (
                                <div className="widget__empty">No data available.</div>
                            )}
                        </div>
                    </Widget>
                </div>
            )}
        </>
    )
}

export default BasePlayerWidget
