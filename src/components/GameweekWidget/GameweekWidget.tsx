import React from 'react'
import { useSelector } from 'react-redux'
import { useMeanLabel, useMeanValue } from '../../hooks'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { round, thousandsSeparator } from '../../utilities'

const GameweekWidget: React.FC = () => {
    const id = useSelector((state: RootState) => state.settings.id)

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
    const sortedRanks = [ ...history.current ].sort((a, b) => a.rank - b.rank)

    const gws = [ ...history.current ].sort((a, b) => b.points - a.points)

    const bestGW = gws[0]
    const worstGW = gws[gws.length - 1]

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
                <li className="widget__list__item">
                    <span>Best Gameweek</span>
                    <span>
                        {bestGW.points} pts
                        {' '}
                        (
                            <a href={`https://fantasy.premierleague.com/entry/${id}/event/${bestGW.event}/`} target="_blank" rel="noopener noreferrer">
                                GW {bestGW.event}
                            </a>
                        )
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Worst Gameweek</span>
                    <span>
                        {worstGW.points} pts
                        {' '}
                        (
                            <a href={`https://fantasy.premierleague.com/entry/${id}/event/${worstGW.event}/`} target="_blank" rel="noopener noreferrer">
                                GW {worstGW.event}
                            </a>
                        )
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Best GW Rank</span>
                    <span>
                        {thousandsSeparator(sortedRanks[0].rank)}
                        {' '}
                        (
                            <a href={`https://fantasy.premierleague.com/entry/${id}/event/${sortedRanks[0].event}/`} target="_blank" rel="noopener noreferrer">
                                GW {sortedRanks[0].event}
                            </a>
                        )
                    </span>
                </li>
                <li className="widget__list__item">
                    <span>Worst GW Rank</span>
                    <span>
                        {thousandsSeparator(sortedRanks[sortedRanks.length - 1].rank)}
                        {' '}
                        (
                            <a href={`https://fantasy.premierleague.com/entry/${id}/event/${sortedRanks[sortedRanks.length - 1].event}/`} target="_blank" rel="noopener noreferrer">
                                GW {sortedRanks[sortedRanks.length - 1].event}
                            </a>
                        )
                    </span>
                </li>
            </ul>
        </Widget>
    )
}

export default GameweekWidget