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
    stat: 'rawPoints' | 'benchPoints'
}

const PlayerGWReturnWidget: React.FC<Props> = (props: Props) => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={props.stat === 'rawPoints' ? POINTS_TITLE : BENCH_TITLE} />
    }

    const stats = data.stats.data

    const elements = sort(
        getAllPlayers(stats).reduce(
            (acc, curr) => [
                ...acc,
                ...curr.data
                    .filter(item => (props.stat === 'rawPoints' ? (item.multiplier || 0) > 0 : item.multiplier === 0))
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
            title={props.stat === 'rawPoints' ? POINTS_TITLE : BENCH_TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.element.id} />
                    <div>
                        <b>{getPointsLabel(element.data[0][props.stat] || 0)}</b>
                        <div>
                            <SiteLink event={element.data[0].event.id} />
                        </div>
                    </div>
                </>
            )}
        />
    )
}

export default PlayerGWReturnWidget
