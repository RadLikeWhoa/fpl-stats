import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { sort } from '../../utilities'
import { TotsPlayer } from '../TotsPlayer'
import { Widget } from '../Widget'
import './TotsWidget.scss'

const MIN_GK = 1
const MAX_GK = 2

const MIN_DEF = 3
const MAX_DEF = 5

const MIN_MID = 2
const MAX_MID = 5

const MIN_FWD = 1
const MAX_FWD = 3

const TotsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Team of the Season" />
        )
    }

    const gk = sort(stats[1], el => el.aggregates.totals.points).slice(0, MAX_GK)
    const def = sort(stats[2], el => el.aggregates.totals.points).slice(0, MAX_DEF)
    const mid = sort(stats[3], el => el.aggregates.totals.points).slice(0, MAX_MID)
    const fwd = sort(stats[4], el => el.aggregates.totals.points).slice(0, MAX_FWD)

    const top = gk.slice(0, MIN_GK).concat(def.slice(0, MIN_DEF)).concat(mid.slice(0, MIN_MID)).concat(fwd.slice(0, MIN_FWD))
    const rest = sort(def.slice(MIN_DEF).concat(mid.slice(MIN_MID)).concat(fwd.slice(MIN_FWD)), el => el.aggregates.totals.points)

    const xi = sort(top.concat(rest.slice(0, 4)), el => el.element.element_type, 'asc')
    const bench = sort(gk.slice(MIN_GK).concat(rest.slice(4)), el => el.element.element_type, 'asc')

    return (
        <Widget title="Team of the Season" cssClasses="tots-widget">
            <div className="tots">
                <div className="tots__row">
                    {xi.filter(el => el.element.element_type === 1).map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {xi.filter(el => el.element.element_type === 2).map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {xi.filter(el => el.element.element_type === 3).map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {xi.filter(el => el.element.element_type === 4).map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
                <div className="tots__row tots__row--bench">
                    {bench.map(player => (
                        <TotsPlayer
                            key={player.element.id}
                            id={player.element.id}
                            points={player.aggregates.totals.points}
                        />
                    ))}
                </div>
            </div>
        </Widget>
    )
}

export default TotsWidget