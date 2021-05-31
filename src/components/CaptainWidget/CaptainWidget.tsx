import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { thousandsSeparator, sumNumbers, round } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { Metric } from '../Metric';

const CaptainWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title="Captains" />
        )
    }

    const captains = Object
        .values(stats)
        .map(position => {
            return position
                .map(player => ({
                    player,
                    data: player.data.filter(data => (data.multiplier || 0) > 1),
                }))
                .filter(player => player.data.length > 0)
        })
        .reduce((acc, curr) => acc.concat(curr), [])
        .sort((a, b) => b.data.length - a.data.length)

    return (
        <Widget title="Captains">
            <ul className="widget__list">
                {captains.map(captain => {
                    const sum = sumNumbers(captain.data.map(data => data.points || 0))

                    return (
                        <li className="widget__list__item" key={captain.player.element.id}>
                            <Player id={captain.player.element.id} />
                            <span>{captain.data.length} ({thousandsSeparator(sum)} pts, {round(sum / captain.data.length)} <Metric metric="ppg" />)</span>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default CaptainWidget