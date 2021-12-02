import React, { useContext } from 'react'
import { Widget } from '../Widget'
import { getAllPlayers, getPointsLabel, sort } from '../../utilities'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { StatData } from '../../types'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { Player } from '../Player'
import { SiteLink } from '../SiteLink'

const POINTS_TITLE = 'Top GW Points'
const BENCH_TITLE = 'Top GW Bench Points'
const MAX_ITEMS = 10

type Props = {
    stat: 'points' | 'benchPoints'
}

const PlayerGWReturnWidget: React.FC<Props> = (props: Props) => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={props.stat === 'points' ? POINTS_TITLE : BENCH_TITLE} />
    }

    const stats = data.stats.data

    const elements = sort(
        getAllPlayers(stats).reduce(
            (acc, curr) => [
                ...acc,
                ...curr.data
                    .filter(item => (props.stat === 'points' ? (item.multiplier || 0) > 0 : item.multiplier === 0))
                    .map(item => ({
                        ...curr,
                        data: [item],
                    })),
            ],
            [] as StatData[]
        ),
        el => el.data[0][props.stat] || 0
    )

    return (
        <BasePlayerWidget
            title={props.stat === 'points' ? POINTS_TITLE : BENCH_TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.element.id} />
                    <div>
                        <b>{getPointsLabel(element.data[0][props.stat] || 0)}</b> (
                        <SiteLink event={element.data[0].event.id} />
                        {(element.data[0].multiplier || 0) > 1 ? ', C' : ''})
                    </div>
                </>
            )}
        />
    )
}

export default PlayerGWReturnWidget
