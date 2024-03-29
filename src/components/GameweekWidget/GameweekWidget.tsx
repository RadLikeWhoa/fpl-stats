import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { useMeanLabel, useMeanValue } from '../../hooks'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { head, last, round, sort, thousandsSeparator, getPointsLabel } from '../../utilities'
import { SiteLink } from '../SiteLink'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { ChangeBadge } from '../ChangeBadge'

const TITLE = 'Gameweeks'

const GameweekWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const meanLabel = useMeanLabel()
    const meanValue = useMeanValue()

    if (!data || !bootstrap || !data.history.current.length) {
        return <Widget title={TITLE} />
    }

    const history = data.history

    const differences = history.current.map(
        week => week.points - (bootstrap.events.find(el => el.id === week.event)?.average_entry_score || 0)
    )
    const sortedRanks = sort(history.current, el => el.rank, 'asc')

    const gws = sort(history.current, el => el.points)

    const bestGW = head(gws)
    const worstGW = last(gws)

    const bestGWRank = head(sortedRanks)
    const worstGWRank = last(sortedRanks)

    return (
        <Widget title={TITLE}>
            <ul className="widget__list">
                <li className="widget__list__item">
                    <span>{meanLabel('Difference to GW Average')}</span>
                    <ChangeBadge value={meanValue(differences)} />
                </li>
                <li className="widget__list__item">
                    <span>Times Above GW Average</span>
                    <b>{differences.filter(diff => diff >= 0).length}</b>
                </li>
                <li className="widget__list__item">
                    <span>Times Below GW Average</span>
                    <b>{differences.filter(diff => diff < 0).length}</b>
                </li>
                <li className="widget__list__item">
                    <span>{meanLabel('GW Rank')}</span>
                    <b>{thousandsSeparator(Number(round(meanValue(history.current.map(week => week.rank)))))}</b>
                </li>
                {bestGW && (
                    <li className="widget__list__item">
                        <span>Best Gameweek</span>
                        <span>
                            <b>{getPointsLabel(bestGW.points)}</b> (
                            <SiteLink event={bestGW.event} />)
                        </span>
                    </li>
                )}
                {worstGW && (
                    <li className="widget__list__item">
                        <span>Worst Gameweek</span>
                        <span>
                            <b>{getPointsLabel(worstGW.points)}</b> (
                            <SiteLink event={worstGW.event} />)
                        </span>
                    </li>
                )}
                {bestGWRank && (
                    <li className="widget__list__item">
                        <span>Best GW Rank</span>
                        <span>
                            <b>{thousandsSeparator(bestGWRank.rank)}</b> (
                            <SiteLink event={bestGWRank.event} />)
                        </span>
                    </li>
                )}
                {worstGWRank && (
                    <li className="widget__list__item">
                        <span>Worst GW Rank</span>
                        <span>
                            <b>{thousandsSeparator(worstGWRank.rank)}</b> (
                            <SiteLink event={worstGWRank.event} />)
                        </span>
                    </li>
                )}
            </ul>
        </Widget>
    )
}

export default GameweekWidget
