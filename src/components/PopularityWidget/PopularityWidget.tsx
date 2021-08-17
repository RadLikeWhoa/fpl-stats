import React from 'react'
import { useSelector } from 'react-redux'
import { BaseLiveWidget } from '../BaseLiveWidget'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { last, sort } from '../../utilities'
import { Player } from '../Player'

const TITLE = 'Popularity Breakdown'
const MAX_ITEMS = 5

const PopularityWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!stats || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const picks = last(stats)?.pick.picks.map(el => el.element)
    const elements = sort(
        bootstrap.elements.filter(el => picks?.includes(el.id)),
        el => Number(el.selected_by_percent)
    )

    return (
        <BaseLiveWidget
            title={TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.id} />
                    <div>
                        <b>{element.selected_by_percent} %</b>
                    </div>
                </>
            )}
        />
    )
}

export default PopularityWidget
