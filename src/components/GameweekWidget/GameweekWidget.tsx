import React from 'react'
import { useSelector } from 'react-redux'
import { useMeanLabel, useMeanValue } from '../../hooks'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { head, last, round, sort, thousandsSeparator } from '../../utilities'
import { SiteLink } from '../SiteLink'

const GameweekWidget: React.FC = () => {
    const history = useSelector((state: RootState) => state.history.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const meanLabel = useMeanLabel()
    const meanValue = useMeanValue()

    if (!history || !bootstrap) {
        return (
            <Widget title="Gameweeks" />
        )
    }

    const differences = history.current.map((week, index) => week.points - bootstrap.events[index].average_entry_score)
    const sortedRanks = sort(history.current, el => el.rank, 'asc')

    const gws = sort(history.current, el => el.points)

    const bestGW = head(gws)
    const worstGW = last(gws)

    const bestGWRank = head(sortedRanks)
    const worstGWRank = last(sortedRanks)

    return (
        <Widget title="Gameweeks">
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>{meanLabel('Difference to GW Average')}</span>
                    <span>{round(meanValue(differences))} pts</span>
                </li>
                <li className="widget__list__item">
                    <span>Times Above GW Average</span>
                    <span>{differences.filter(diff => diff >= 0).length}</span>
                </li>
                <li className="widget__list__item">
                    <span>Times Below GW Average</span>
                    <span>{differences.filter(diff => diff < 0).length}</span>
                </li>
                <li className="widget__list__item">
                    <span>{meanLabel('GW Rank')}</span>
                    <span>{thousandsSeparator(Number(round(meanValue(history.current.map(week => week.rank)))))}</span>
                </li>
                {bestGW && (
                    <li className="widget__list__item">
                        <span>Best Gameweek</span>
                        <span>
                            {bestGW.points} pts
                            {' '}
                            (
                                <SiteLink event={bestGW.event} />
                            )
                        </span>
                    </li>
                )}
                {worstGW && (
                    <li className="widget__list__item">
                        <span>Worst Gameweek</span>
                        <span>
                            {worstGW.points} pts
                            {' '}
                            (
                                <SiteLink event={worstGW.event} />
                            )
                        </span>
                    </li>
                )}
                {bestGWRank && (
                    <li className="widget__list__item">
                        <span>Best GW Rank</span>
                        <span>
                            {thousandsSeparator(bestGWRank.rank)}
                            {' '}
                            (
                                <SiteLink event={bestGWRank.event} />
                            )
                        </span>
                    </li>
                )}
                {worstGWRank && (
                    <li className="widget__list__item">
                        <span>Worst GW Rank</span>
                        <span>
                            {thousandsSeparator(worstGWRank.rank)}
                            {' '}
                            (
                                <SiteLink event={worstGWRank.event} />
                            )
                        </span>
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default GameweekWidget