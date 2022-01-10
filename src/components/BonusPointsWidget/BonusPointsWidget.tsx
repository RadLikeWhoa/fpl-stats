import React, { useContext } from 'react'
import { Widget } from '../Widget'
import { getAllPlayers, getPointsLabel, round, sort } from '../../utilities'
import { Player } from '../Player'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { Metric } from '../Metric'
import { getGWCountLabel } from '../../utilities/strings'

const TITLE = 'Bonus Points'
const MAX_ITEMS = 10

const BonusPointsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={TITLE} />
    }

    const stats = data.stats.data

    const elements = sort(getAllPlayers(stats), el => el.aggregates.totals.bonus)

    return (
        <BasePlayerWidget
            title={TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => {
                const count = element.data.filter(gw => (gw.bonusPoints || 0) > 0).length

                return (
                    <>
                        <Player id={element.element.id} />
                        <div>
                            <b>{getPointsLabel(element.aggregates.totals.bonus)}</b> ({getGWCountLabel(count)},{' '}
                            {round(element.aggregates.totals.bonus / count)} <Metric metric="ppg" />)
                        </div>
                    </>
                )
            }}
        />
    )
}

export default BonusPointsWidget
