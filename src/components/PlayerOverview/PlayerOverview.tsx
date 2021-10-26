import classNames from 'classnames'
import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { ValueType } from 'react-select'
import { useMeanValue } from '../../hooks'
import { RootState } from '../../reducers'
import { Bootstrap, StatData, Stats } from '../../types'
import { getChipAbbreviation, round, sort } from '../../utilities'
import { FilteredDataContext, OptionType } from '../Dashboard/Dashboard'
import { Metric } from '../Metric'
import { Player } from '../Player'
import './PlayerOverview.scss'

type Props = {
    sort: ValueType<OptionType>
    ref: React.RefObject<HTMLDivElement>
}

const sortings: { [key: string]: (statData: StatData) => number } = {
    points: el => el.aggregates.totals.points,
    selection: el => el.aggregates.totals.selections,
    start: el => el.aggregates.totals.starts,
    bench: el => el.aggregates.totals.benched,
    alphabet: (statData: StatData): number => {
        return statData.element.web_name.toLowerCase().charCodeAt(0) * -1
    },
}

const renderPlayerList = (
    stats: Stats,
    bootstrap: Bootstrap,
    sorting: OptionType,
    meanValue: (series: (number | null)[]) => number
): JSX.Element[] =>
    Object.entries(stats).map(([elementType, statData]) => (
        <div key={elementType}>
            <li className="player-overview__category">
                <span>{bootstrap?.element_types.find(el => el.id === Number(elementType))?.plural_name_short}</span>
                <span>{statData.length}</span>
            </li>
            {sort(
                statData.filter(element => element.data.filter(pick => pick.multiplier !== null).length),
                el => sortings[sorting.value](el)
            ).map(element => (
                <li key={element.element.id} className="player-overview__item">
                    <div className="player-overview__player">
                        <Player id={element.element.id} extended />
                    </div>
                    <div className="player-overview__stats">
                        {element.data.map(item => (
                            <span
                                key={item.event.id}
                                className={classNames('player-overview__stat', {
                                    'player-overview__stat--benched': item.multiplier === 0,
                                    'player-overview__stat--captain': item.multiplier === 2,
                                    'player-overview__stat--triple': item.multiplier === 3,
                                    'player-overview__stat--started': item.multiplier,
                                })}
                            />
                        ))}
                    </div>
                    <div className="player-overview__totals">
                        <span className="player-overview__stat">
                            <div>
                                <b>{element.aggregates.totals.selections}</b>{' '}
                                <span className="muted">
                                    (
                                    {element.data.length
                                        ? round((element.aggregates.totals.selections / element.data.length) * 100)
                                        : 0}
                                    %)
                                </span>
                            </div>
                        </span>
                        <span className="player-overview__stat">
                            <div>
                                <b>{element.aggregates.totals.starts}</b>{' '}
                                <span className="muted">
                                    (
                                    {element.data.length
                                        ? round((element.aggregates.totals.starts / element.data.length) * 100)
                                        : 0}
                                    %)
                                </span>
                            </div>
                        </span>
                        <span className="player-overview__stat">
                            <div>
                                <b>{element.aggregates.totals.benched}</b>{' '}
                                <span className="muted">
                                    (
                                    {element.data.length
                                        ? round((element.aggregates.totals.benched / element.data.length) * 100)
                                        : 0}
                                    %)
                                </span>
                            </div>
                        </span>
                        <span className="player-overview__stat">
                            <div>
                                <b>{element.aggregates.totals.points}</b>{' '}
                                <span className="muted">
                                    (
                                    {round(
                                        meanValue(
                                            element.data
                                                .filter(data => (data.multiplier || 0) > 0)
                                                .map(data => data.points)
                                        )
                                    )}{' '}
                                    <Metric metric="ppg" />)
                                </span>
                            </div>
                        </span>
                    </div>
                </li>
            ))}
        </div>
    ))

export const PlayerOverview: React.FC<Props> = (props: Props) => {
    const id = useSelector((state: RootState) => state.settings.id)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)
    const data = useContext(FilteredDataContext)

    const meanValue = useMeanValue()

    return (
        <div
            className={classNames('player-overview', {
                'player-overview--cloaked': !id,
            })}
        >
            <div className="player-overview__container" ref={props.ref}>
                {data && bootstrap && Object.keys(data.stats.data).length > 0 ? (
                    <>
                        <header className="player-overview__header">
                            <span className="player-overview__heading">Player</span>
                            {data?.history.current?.map(event => (
                                <span className="player-overview__stat" key={event.event}>
                                    GW {event.event}
                                    {data?.stats.chips[event.event] && (
                                        <div>{getChipAbbreviation(data.stats.chips[event.event])}</div>
                                    )}
                                </span>
                            ))}
                            <div className="player-overview__totals">
                                <span className="player-overview__stat">Selected</span>
                                <span className="player-overview__stat">Starting</span>
                                <span className="player-overview__stat">Benched</span>
                                <span className="player-overview__stat">Points</span>
                            </div>
                        </header>
                        <ul className="player-overview__list">
                            {renderPlayerList(data.stats.data, bootstrap, props.sort as OptionType, meanValue)}
                        </ul>
                    </>
                ) : (
                    <div className="player-overview__empty">No data available.</div>
                )}
            </div>
        </div>
    )
}
