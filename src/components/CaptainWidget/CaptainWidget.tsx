import React, { useContext } from 'react'
import {
    thousandsSeparator,
    sumNumbers,
    round,
    sort,
    getPointsLabel,
    getGWCountLabel,
    pluralise,
} from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { Metric } from '../Metric'
import { useMeanValue } from '../../hooks'
import { FilteredDataContext } from '../Dashboard/Dashboard'

const TITLE = 'Captains'

const CaptainWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const meanValue = useMeanValue()

    if (!data) {
        return <Widget title={TITLE} />
    }

    const stats = data.stats.data

    const captains = sort(
        Object.values(stats)
            .map(position => {
                return position
                    .map(player => ({
                        player,
                        data: player.data.filter(data => (data.multiplier || 0) > 1),
                    }))
                    .filter(player => player.data.length > 0)
            })
            .reduce((acc, curr) => acc.concat(curr), []),
        el => el.data.length
    )

    const teams = captains.reduce((acc, captain) => {
        acc.add(captain.player.element.team)
        return acc
    }, new Set())

    return (
        <Widget title={TITLE}>
            {captains.length > 0 && (
                <>
                    <div className="widget__detail">
                        Selected a total of <b>{pluralise(captains.length, 'captain', 'captains')}</b> accross{' '}
                        <b>{pluralise(teams.size, 'team', 'teams')}</b>.
                    </div>
                    <ul className="widget__list">
                        {captains.map(captain => {
                            const points = captain.data.map(data => data.points)

                            return (
                                <li className="widget__list__item" key={captain.player.element.id}>
                                    <Player id={captain.player.element.id} />
                                    <div>
                                        <div>
                                            <b>{getGWCountLabel(captain.data.length)}</b>
                                        </div>
                                        <div className="muted">
                                            {getPointsLabel(thousandsSeparator(sumNumbers(points)))},{' '}
                                            {round(meanValue(points))} <Metric metric="ppg" />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </>
            )}
        </Widget>
    )
}

export default CaptainWidget
