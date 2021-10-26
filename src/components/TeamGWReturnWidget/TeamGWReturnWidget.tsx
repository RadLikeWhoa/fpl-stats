import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Widget } from '../Widget'
import { getAllPlayers, getPointsLabel, round, sort } from '../../utilities'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { SiteLink } from '../SiteLink'
import { RootState } from '../../reducers'
import { Team } from '../Team'
import { Metric } from '../Metric'
import { CurrentHistory, Team as TeamType } from '../../types'
import { WidgetWithModal } from '../WidgetWithModal'

const TITLE = 'Top GW Teams'
const MAX_ITEMS = 15

type TeamData = {
    team: TeamType
    event: CurrentHistory
    points: number | null
    players: number
}

const renderItem = (item: TeamData): JSX.Element => {
    return (
        <>
            <Team team={item.team} />
            <div>
                <b>{getPointsLabel(item.points || 0)}</b> (
                <SiteLink event={item.event.event} />, {round((item.points || 0) / item.players)}{' '}
                <Metric metric="ppp" />)
            </div>
        </>
    )
}

const getItemKey = (item: TeamData): string => {
    return `${item.team.id}-${item.event.event}`
}

const matchesFilter = (item: TeamData, query: string): boolean => {
    return item.team.name.toLowerCase().includes(query.toLowerCase())
}

const TeamGWReturnWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!data || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const stats = data.stats.data
    const allPlayers = getAllPlayers(stats)

    const teamData = sort(
        data.history.current
            .map(event => {
                return bootstrap.teams
                    .map(team => {
                        let players = 0

                        return {
                            team,
                            event,
                            points: allPlayers
                                .filter(player => player.element.team === team.id)
                                .reduce((acc: number | null, curr) => {
                                    const points = curr.data.find(item => item.event.id === event.event)?.points

                                    if (points !== undefined && points !== null) {
                                        players += 1
                                        return (acc || 0) + points
                                    }

                                    return acc
                                }, null),
                            players,
                        }
                    })
                    .filter(team => team.points !== null)
            })
            .reduce((acc, curr) => [...acc, ...curr]),
        el => el.points || 0
    )

    return (
        <WidgetWithModal
            title={TITLE}
            max={MAX_ITEMS}
            data={teamData}
            renderItem={renderItem}
            getItemKey={getItemKey}
            matchesFilter={matchesFilter}
        />
    )
}

export default TeamGWReturnWidget
