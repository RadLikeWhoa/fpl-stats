import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { thousandsSeparator, sumNumbers } from '../../utilities'
import { Player } from '../Player'
import { Widget } from '../Widget'

const CaptainWidget: React.FC = () => {
    const id = useSelector((state: RootState) => state.settings.id)

    const stats = useSelector((state: RootState) => state.stats.data)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    if (!stats) {
        return (
            <Widget
                title="Captains"
                loading={isLoadingStats}
                cloaked={!id}
            />
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
        <Widget
            title="Captains"
            loading={isLoadingStats}
            cloaked={!id}
        >
            <ul className="widget__list">
                {captains.map(captain => {
                    const sum = sumNumbers(captain.data.map(data => data.points || 0))

                    return (
                        <li className="widget__list__item">
                            <Player id={captain.player.element.id} />
                            <span>{captain.data.length} ({thousandsSeparator(sum)} pts, {(sum / captain.data.length).toFixed(1)} ppg)</span>
                        </li>
                    )
                })}
            </ul>
        </Widget>
    )
}

export default CaptainWidget