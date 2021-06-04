import React from 'react'
import { getAllPlayers, getGWCountLabel, head, round, sort } from '../../utilities'
import { FilteredData } from '../Dashboard/Dashboard'
import { Player } from '../Player'
import { Widget } from '../Widget'

const TITLE = 'Wrong Captains'

type Props = {
    data: FilteredData | undefined
}

const WrongCaptainWidget: React.FC<Props> = (props: Props) => {
    if (!props.data) {
        return <Widget title={TITLE} />
    }

    const stats = props.data.stats.data
    const history = props.data.history

    const allPlayers = getAllPlayers(stats)
    const weeks = history.current.length

    const improvements = Array.from(Array(weeks).keys())
        .map((el, index) => ({
            top: head(sort(allPlayers, el => el.data[index].rawPoints || 0)),
            captain: allPlayers.find(player => (player.data[index].multiplier || 0) > 1),
        }))
        .filter(
            (element, index) =>
                (element.top?.data[index].rawPoints || 0) > (element.captain?.data[index].rawPoints || 0)
        )
        .reduce(
            (acc, curr) =>
                curr.captain
                    ? {
                          ...acc,
                          [curr.captain.element.id]:
                              (acc[curr.captain.element.id] ? acc[curr.captain.element.id] : 0) + 1,
                      }
                    : acc,
            {} as Record<number, number>
        )

    const timesUsed = allPlayers.reduce((acc, curr) => {
        return {
            ...acc,
            [curr.element.id]: curr.aggregates.totals.captaincies,
        }
    }, {} as Record<number, number>)

    return (
        <Widget title={TITLE}>
            {Object.entries(improvements).length > 0 && (
                <ul className="widget__list">
                    {sort(Object.entries(improvements), el => el[1]).map(([player, count]) => (
                        <li className="widget__list__item" key={player}>
                            <Player id={Number(player)} />
                            <div>
                                <div>
                                    <b>
                                        {count} out of {getGWCountLabel(timesUsed[Number(player)])}
                                    </b>
                                </div>
                                <div className="muted">{round((count / timesUsed[Number(player)]) * 100, 1)}%</div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Widget>
    )
}

export default WrongCaptainWidget
