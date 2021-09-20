import React, { useContext } from 'react'
import { getAllPlayers, getGWCountLabel, head, round, sort } from '../../utilities'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { Player } from '../Player'
import { Widget } from '../Widget'

const TITLE = 'Wrong Captains'

const WrongCaptainWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    if (!data) {
        return <Widget title={TITLE} />
    }

    const stats = data.stats.data
    const history = data.history

    const allPlayers = getAllPlayers(stats)
    const weeks = history.current.length

    const improvements = Array.from(Array(weeks).keys())
        .map((el, index) => ({
            top: head(sort(allPlayers, el => el.data[index].rawPoints || 0)),
            captain: allPlayers.find(player => (player.data[index].multiplier || 0) > 1),
        }))
        .reduce(
            (acc, curr, index) =>
                curr.captain && curr.top
                    ? {
                          ...acc,
                          [curr.captain.element.id]:
                              (acc[curr.captain.element.id] ? acc[curr.captain.element.id] : 0) +
                              ((curr.captain.data[index].rawPoints || 0) < (curr.top.data[index].rawPoints || 0)
                                  ? 1
                                  : 0),
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
                    {sort(Object.entries(improvements), el => el[1] / timesUsed[Number(el[0])]).map(
                        ([player, count]) => (
                            <li className="widget__list__item" key={player}>
                                <Player id={Number(player)} />
                                <div>
                                    <div>
                                        <b>
                                            {count} / {getGWCountLabel(timesUsed[Number(player)])}
                                        </b>
                                    </div>
                                    <div className="muted">{round((count / timesUsed[Number(player)]) * 100, 1)}%</div>
                                </div>
                            </li>
                        )
                    )}
                </ul>
            )}
        </Widget>
    )
}

export default WrongCaptainWidget
