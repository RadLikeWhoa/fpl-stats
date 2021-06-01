import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { getAllPlayers, round } from '../../utilities'
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
    })

    const topBenchwarmers = [ ...elements ].sort((a, b) => {
        const percentageDiff = b.benchedPercentage - a.benchedPercentage
        return percentageDiff === 0 ? b.benched - a.benched : percentageDiff
    })

    return (
        <Widget title={props.title}>
            <ul className="widget__list">
                {props.top && topStarters.slice(0, MAX_ITEMS).map(element => (
                    <li className="widget__list__item" key={element.element.id}>
                        <Player id={element.element.id} />
                        <span>{round(element.startsPercentage)}% ({element.starts})</span>
                    </li>
                ))}
                {!props.top && topBenchwarmers.slice(0, MAX_ITEMS).map(element => (
                    <li className="widget__list__item" key={element.element.id}>
                        <Player id={element.element.id} />
                        <span>{round(element.benchedPercentage)}% ({element.benched})</span>
                    </li>
                ))}
            </ul>
        </Widget>
    )
}

export default DifferenceWidget