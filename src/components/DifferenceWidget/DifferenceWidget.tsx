import React, { useContext } from 'react'
import { Widget } from '../Widget'
import { getAllPlayers, getGWCountLabel, round } from '../../utilities'
import { Player } from '../Player'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredDataContext } from '../Dashboard/Dashboard'

type Props = {
    title: string
    top?: boolean
}

const MAX_ITEMS = 5

const DifferenceWidget: React.FC<Props> = (props: Props) => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={props.title} />
    }

    const stats = data.stats.data

    const elements = getAllPlayers(stats).map(element => {
        const selections = element.aggregates.totals.selections
        const starts = element.aggregates.totals.starts
        const benched = element.aggregates.totals.benched

        return {
            ...element,
            benched,
            benchedPercentage: (benched / selections) * 100,
            starts,
            startsPercentage: (starts / selections) * 100,
        }
    })

    const starters = [...elements]
        .sort((a, b) => {
            const percentageDiff = b.startsPercentage - a.startsPercentage
            return percentageDiff === 0 ? b.starts - a.starts : percentageDiff
        })
        .filter(el => el.starts > 0)

    const benchwarmers = [...elements]
        .sort((a, b) => {
            const percentageDiff = b.benchedPercentage - a.benchedPercentage
            return percentageDiff === 0 ? b.benched - a.benched : percentageDiff
        })
        .filter(el => el.benched > 0)

    return (
        <BasePlayerWidget
            title={props.title}
            players={props.top ? starters : benchwarmers}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.element.id} />
                    <div>
                        <div>
                            <b>
                                {round(
                                    ((props.top
                                        ? element.aggregates.totals.starts
                                        : element.aggregates.totals.benched) /
                                        element.aggregates.totals.selections) *
                                        100
                                )}
                                %
                            </b>
                        </div>
                        <div className="muted">
                            {getGWCountLabel(
                                props.top ? element.aggregates.totals.starts : element.aggregates.totals.benched
                            )}
                        </div>
                    </div>
                </>
            )}
        />
    )
}

export default DifferenceWidget
