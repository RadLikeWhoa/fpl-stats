import React, { useContext } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSelector } from 'react-redux'
import { head, last, round, sort, thousandsSeparator, thousandsShorthand } from '../../utilities'
import { Widget } from '../Widget'
import { useMeanValue, useMeanLabel } from '../../hooks'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { RootState } from '../../reducers'
import './HistoryWidget.scss'

const TITLE = 'Historical Data'

const HistoryWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)
    const theme = useSelector((state: RootState) => state.settings.theme)

    const meanLabel = useMeanLabel()
    const meanValue = useMeanValue()

    if (!data) {
        return <Widget title={TITLE} />
    }

    const history = data.history

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

    let rankData = history.past.map(season => ({
        name: season.season_name,
        value: season.rank,
    }))

    const max = (head(sort([...rankData], el => el.value))?.value || 0) * 1.05

    rankData = [...rankData].map(element => ({
        ...element,
        max,
    }))

    return (
        <Widget title={TITLE} cssClasses="history-widget">
            {rankData.length > 1 && (
                <ResponsiveContainer height={100} width="100%">
                    <AreaChart data={rankData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Area type="monotone" dataKey="max" fill="#177B47" fillOpacity="0.75" />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#177B47"
                            fill={theme === 'dark' ? '#3a4556' : '#fff'}
                            fillOpacity="1"
                        />
                        <YAxis
                            reversed={true}
                            tickFormatter={value => thousandsShorthand(value)}
                            domain={[1, max]}
                            interval="preserveStartEnd"
                            tickCount={10}
                            hide={true}
                        />
                        <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" hide={true} />
                        <Tooltip
                            isAnimationActive={false}
                            formatter={(value, name) =>
                                name === 'max' ? [undefined, undefined] : [thousandsSeparator(Number(value)), 'Rank']
                            }
                            separator=": "
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
            <ul className="widget__list">
                {bestRankedSeason && (
                    <li className="widget__list__item">
                        <span>Best Season Rank</span>
                        <span>
                            <b>{thousandsSeparator(bestRankedSeason.rank)}</b> ({bestRankedSeason.season_name})
                        </span>
                    </li>
                )}
                {worstRankedSeason && (
                    <li className="widget__list__item">
                        <span>Worst Season Rank</span>
                        <span>
                            <b>{thousandsSeparator(worstRankedSeason.rank)}</b> ({worstRankedSeason.season_name})
                        </span>
                    </li>
                )}
                {bestPointSeason && (
                    <li className="widget__list__item">
                        <span>Best Points Finish</span>
                        <span>
                            <b>{thousandsSeparator(bestPointSeason.total_points)}</b> ({bestPointSeason.season_name})
                        </span>
                    </li>
                )}
                {worstPointSeason && (
                    <li className="widget__list__item">
                        <span>Worst Points Finish</span>
                        <span>
                            <b>{thousandsSeparator(worstPointSeason.total_points)}</b> ({worstPointSeason.season_name})
                        </span>
                    </li>
                )}
                <li className="widget__list__item">
                    <span>{meanLabel('Rank')}</span>
                    <b>
                        {thousandsSeparator(Number(round(meanValue(pastSeasonsByRank.map(season => season.rank)), 0)))}
                    </b>
                </li>
                <li className="widget__list__item">
                    <span>{meanLabel('Points')}</span>
                    <b>
                        {thousandsSeparator(
                            Number(round(meanValue(pastSeasonsByPoints.map(season => season.total_points)), 0))
                        )}
                    </b>
                </li>
                <li className="widget__list__item">
                    <span>Top 1K Finishes</span>
                    <b>{top1k}</b>
                </li>
                <li className="widget__list__item">
                    <span>Top 10K Finishes</span>
                    <b>{top10k}</b>
                </li>
                <li className="widget__list__item">
                    <span>Top 100K Finishes</span>
                    <b>{top100k}</b>
                </li>
                <li className="widget__list__item">
                    <span>Top 1M Finishes</span>
                    <b>{top1m}</b>
                </li>
            </ul>
        </Widget>
    )
}

export default HistoryWidget
