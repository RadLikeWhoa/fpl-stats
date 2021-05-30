import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { getTotalPoints } from '../../utilities'
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
    const id = useSelector((state: RootState) => state.settings.id)

    const stats = useSelector((state: RootState) => state.stats.data)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    if (!stats) {
        return (
            <Widget
                title="Team of the Season"
                loading={isLoadingStats}
                cloaked={!id}
            ></Widget>
        )
    }

    const gk = [ ...stats[1] ].sort((a, b) => getTotalPoints(b) - getTotalPoints(a)).slice(0, MAX_GK)
    const def = [ ...stats[2] ].sort((a, b) => getTotalPoints(b) - getTotalPoints(a)).slice(0, MAX_DEF)
    const mid = [ ...stats[3] ].sort((a, b) => getTotalPoints(b) - getTotalPoints(a)).slice(0, MAX_MID)
    const fwd = [ ...stats[4] ].sort((a, b) => getTotalPoints(b) - getTotalPoints(a)).slice(0, MAX_FWD)

    const top = [ ...gk.slice(0, MIN_GK), ...def.slice(0, MIN_DEF), ...mid.slice(0, MIN_MID), ...fwd.slice(0, MIN_FWD) ]
    const rest = [ ...def.slice(MIN_DEF), ...mid.slice(MIN_MID), ...fwd.slice(MIN_FWD) ].sort((a, b) => getTotalPoints(b) - getTotalPoints(a))

    const xi = [ ...top, ...rest.slice(0, 4) ].sort((a, b) => a.element.element_type - b.element.element_type)
    const bench = [ ...gk.slice(MIN_GK), ...rest.slice(4) ].sort((a, b) => a.element.element_type - b.element.element_type)

    return (
        <Widget
            title="Team of the Season"
            loading={isLoadingStats}
            cloaked={!id}
        >
            <div className="tots">
                <div className="tots__row">
                    {xi.filter(el => el.element.element_type === 1).map(player => (
                        <TotsPlayer
                            id={player.element.id}
                            points={getTotalPoints(player)}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {xi.filter(el => el.element.element_type === 2).map(player => (
                        <TotsPlayer
                            id={player.element.id}
                            points={getTotalPoints(player)}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {xi.filter(el => el.element.element_type === 3).map(player => (
                        <TotsPlayer
                            id={player.element.id}
                            points={getTotalPoints(player)}
                        />
                    ))}
                </div>
                <div className="tots__row">
                    {xi.filter(el => el.element.element_type === 4).map(player => (
                        <TotsPlayer
                            id={player.element.id}
                            points={getTotalPoints(player)}
                        />
                    ))}
                </div>
                <div className="tots__row tots__row--bench">
                    {bench.map(player => (
                        <TotsPlayer
                            id={player.element.id}
                            points={getTotalPoints(player)}
                        />
                    ))}
                </div>
            </div>
        </Widget>
    )
}

export default TotsWidget