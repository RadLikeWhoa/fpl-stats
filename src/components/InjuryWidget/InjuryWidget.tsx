import React from 'react'
import { useSelector } from 'react-redux'
import { BasePlayerWidget } from '../BasePlayerWidget'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { last, sort } from '../../utilities'
import { Player } from '../Player'

const TITLE = 'Players in Doubt'
const MAX_ITEMS = 5

const InjuryWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!stats || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const picks = last(stats)?.pick.picks.map(el => el.element)
    const elements = sort(
        bootstrap.elements.filter(
            el =>
                picks?.includes(el.id) &&
                el.chance_of_playing_next_round !== null &&
                el.chance_of_playing_next_round !== 100
        ),
        el => Number(el.chance_of_playing_next_round),
        'asc'
    )

    return (
        <BasePlayerWidget
            title={TITLE}
            players={elements}
            max={MAX_ITEMS}
            renderItem={element => (
                <>
                    <Player id={element.id} />
                    <div>
                        <b>{element.chance_of_playing_next_round} %</b>
                    </div>
                </>
            )}
        />
    )
}

export default InjuryWidget
