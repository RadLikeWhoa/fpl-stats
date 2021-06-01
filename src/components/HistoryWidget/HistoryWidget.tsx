import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { head, last, round, sort, thousandsSeparator } from '../../utilities'
import { Widget } from '../Widget'
import { useMeanValue, useMeanLabel } from '../../hooks'

const HistoryWidget: React.FC = () => {
    const history = useSelector((state: RootState) => state.history.data)

    const meanLabel = useMeanLabel()
    const meanValue = useMeanValue()

    if (!history) {
        return (
            <Widget title="Historical Data" />
        )
    }

    const pastSeasonsByRank = sort(history.past, el => el.rank, 'asc')
    const pastSeasonsByPoints = sort(history.past, el => el.total_points)

    const bestRankedSeason = head(pastSeasonsByRank)
    const worstRankedSeason = last(pastSeasonsByRank)

    const bestPointSeason = head(pastSeasonsByPoints)
    const worstPointSeason = last(pastSeasonsByPoints)

    const top1k = pastSeasonsByRank.filter(season => season.rank <= 1000).length
    const top10k = pastSeasonsByRank.filter(season => season.rank <= 10000).length
    const top100k = pastSeasonsByRank.filter(season => season.rank <= 100000).length
    const top1m = pastSeasonsByRank.filter(season => season.rank <= 1000000).length

    return (
        <Widget title="Historical Data">
            <ul className="widget__list">
                {bestRankedSeason && (
                    <li className="widget__list__item">
                        <span>Best Season Rank</span>
                        <span>{thousandsSeparator(bestRankedSeason.rank)} ({bestRankedSeason.season_name})</span>
                    </li>
                )}
                {bestPointSeason && (
                    <li className="widget__list__item">
                        <span>Best Points Finish</span>
                        <span>{thousandsSeparator(bestPointSeason.total_points)} ({bestPointSeason.season_name})</span>
                    </li>
                )}
                {worstRankedSeason && (
                    <li className="widget__list__item">
                        <span>Worst Season Rank</span>
                        <span>{thousandsSeparator(worstRankedSeason.rank)} ({worstRankedSeason.season_name})</span>
                    </li>
                )}
                {worstPointSeason && (
                    <li className="widget__list__item">
                        <span>Worst Points Finish</span>
                        <span>{thousandsSeparator(worstPointSeason.total_points)} ({worstPointSeason.season_name})</span>
                    </li>
                )}
                <li className="widget__list__item">
                    <span>{meanLabel('Rank')}</span>
                    <span>{thousandsSeparator(Number(round(meanValue(pastSeasonsByRank.map((season) => season.rank)), 0)))}</span>
                </li>
                <li className="widget__list__item">
                    <span>{meanLabel('Points')}</span>
                    <span>{thousandsSeparator(Number(round(meanValue(pastSeasonsByPoints.map((season) => season.total_points)), 0)))}</span>
                </li>
                <li className="widget__list__item">
                    <span>Top 1K Finishes</span>
                    <span>{top1k}</span>
                </li>
                <li className="widget__list__item">
                    <span>Top 10K Finishes</span>
                    <span>{top10k}</span>
                </li>
                <li className="widget__list__item">
                    <span>Top 100K Finishes</span>
                    <span>{top100k}</span>
                </li>
                <li className="widget__list__item">
                    <span>Top 1M Finishes</span>
                    <span>{top1m}</span>
                </li>
            </ul>
        </Widget>
    )
}

export default HistoryWidget