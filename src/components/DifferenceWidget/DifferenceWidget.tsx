import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, round } from '../../utilities'
import { Player } from '../Player'

type Props = {
    title: string
    top?: boolean
}

const MAX_ITEMS = 10

const DifferenceWidget: React.FC<Props> = (props: Props) => {
    const stats = useSelector((state: RootState) => state.stats.data)

    if (!stats) {
        return (
            <Widget title={props.title} />
        )
    }

    const elements = getAllPlayers(stats)
        .map(element => {
            const selections = element.aggregates.totals.selections
            const starts = element.aggregates.totals.starts
            const benched = element.aggregates.totals.benched

            return {
                ...element,
                benched,
                benchedPercentage: benched / selections * 100,
                starts,
                startsPercentage: starts / selections * 100,
            }
        })

    const topStarters = [ ...elements ].sort((a, b) => {
        const percentageDiff = b.startsPercentage - a.startsPercentage
        return percentageDiff === 0 ? b.starts - a.starts : percentageDiff
    }).slice(0, MAX_ITEMS)

    const topBenchwarmers = [ ...elements ].sort((a, b) => {
        const percentageDiff = b.benchedPercentage - a.benchedPercentage
        return percentageDiff === 0 ? b.benched - a.benched : percentageDiff
    }).slice(0, MAX_ITEMS)

    return (
        <Widget title={props.title}>
            {((props.top && topStarters.length > 0) || (!props.top && topBenchwarmers.length > 0)) && (
                <ul className="widget__list">
                    {props.top && topStarters.map(element => (
                        <li className="widget__list__item" key={element.element.id}>
                            <Player id={element.element.id} />
                            <div>
                                <div>
                                    <b>{round(element.startsPercentage)}%</b>
                                </div>
                                <div className="muted">
                                    {getGWCountLabel(element.starts)}
                                </div>
                            </div>
                        </li>
                    ))}
                    {!props.top && topBenchwarmers.map(element => (
                        <li className="widget__list__item" key={element.element.id}>
                            <Player id={element.element.id} />
                            <div>
                                <div>
                                    <b>{round(element.benchedPercentage)}%</b>
                                </div>
                                <div className="muted">
                                    {getGWCountLabel(element.benched)}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Widget>
    )
}

export default DifferenceWidget