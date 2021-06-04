import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { thousandsSeparator, sumNumbers, round, sort, getPointsLabel, getGWCountLabel } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { Metric } from '../Metric'
import { useMeanValue } from '../../hooks'

const TITLE = 'Captains'

const CaptainWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    const meanValue = useMeanValue()

    if (!stats) {
        return <Widget title={TITLE} />
    }

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

    return (
        <Widget title={TITLE}>
            {captains.length > 0 && (
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
            )}
        </Widget>
    )
}

export default CaptainWidget
