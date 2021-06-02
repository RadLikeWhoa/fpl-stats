import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { Team } from '../Team'
import { Widget } from '../Widget'
import { getAllPlayers, getPointsLabel, round, sort, sumNumbers } from '../../utilities'
import { Metric } from '../Metric'
import './TeamsWidget.scss'

const TeamsWidget: React.FC = () => {
    const stats = useSelector((state: RootState) => state.stats.data)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!stats || !bootstrap) {
        return <Widget title="Teams" />
    }

    const counts = Object.values(stats)
        .reduce((acc: number[], curr) => [...acc, ...curr.map(el => el.element.team)], [])
        .reduce((acc: { [key: number]: number }, curr) => ({ ...acc, [curr]: (acc[Number(curr)] || 0) + 1 }), {})

    const teams = sort(bootstrap.teams, el => counts[el.id] || 0)

    const allPlayers = getAllPlayers(stats)

    return (
        <Widget title="Teams" cssClasses="teams-widget">
            {teams.length > 0 && (
                <ul className="widget__list">
                    {teams.map(team => {
                        const players = allPlayers.filter(player => player.element.team === team.id)
                        const points = sumNumbers(players.map(player => player.aggregates.totals.points))

                        return (
                            <li className="teams-widget__item" key={team.id}>
                                <div className="teams-widget__header">
                                    <Team team={team} />
                                    <div>
                                        <div>
                                            <b>{counts[team.id] || 0}</b>
                                        </div>
                                        <div className="muted">
                                            {getPointsLabel(points)},{' '}
                                            {players.length > 0 ? round(points / players.length) : 0}{' '}
                                            <Metric metric="ppp" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {Object.entries(stats).map(([position, players]) => {
                                        const positionPlayers = players.filter(
                                            player => player.element.team === team.id
                                        )

                                        if (!positionPlayers.length) {
                                            return null
                                        }

                                        return (
                                            <div
                                                className="teams-widget__position"
                                                data-position={
                                                    bootstrap.element_types.find(el => el.id === Number(position))
                                                        ?.plural_name_short
                                                }
                                                key={position}
                                            >
                                                {sort(
                                                    positionPlayers.filter(player => player.element.team === team.id),
                                                    el => el.aggregates.totals.points
                                                ).map(player => (
                                                    <div key={player.element.id}>
                                                        {player.element.web_name} (
                                                        {getPointsLabel(player.aggregates.totals.points)})
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </Widget>
    )
}

export default TeamsWidget
