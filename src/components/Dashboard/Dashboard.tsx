import React, { useState, useEffect, useRef } from 'react'
import { Bootstrap, StatData, Stats, History, ElementStats } from '../../types'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBootstrap } from '../../reducers/bootstrap'
import { RootState } from '../../reducers'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { Team } from '../Team'
import { Spinner } from '../Spinner'
import { getPastEvents, getTotalSelections, getTotalStarts, getTotalBenched, getChipAbbreviation, thousandsSeparator, getShortName, validateTeamId, thousandsShorthand, getTotalPoints } from '../../utilities'
import { Modal } from '../Modal'
import { setId } from '../../reducers/settings'
import { buildData } from '../../reducers/stats'
import { Button } from '../Button'
import classNames from 'classnames'
import { fetchHistory } from '../../reducers/history'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import Select, { ValueType } from 'react-select'
import queryString from 'query-string'
import './Dashboard.scss'
import TotsPlayer from '../TotsPlayer/TotsPlayer'

type OptionType = {
    value: string
    label: string
}

type QueryString = {
    team?: string
}

const sortings: { [ key: string ]: (statData: StatData) => number } = {
    points: getTotalPoints,
    selection: getTotalSelections,
    start: getTotalStarts,
    bench: getTotalBenched,
    alphabet: (statData: StatData): number => {
        return statData.element.web_name.toLowerCase().charCodeAt(0) * -1
    }
}

const sortOptions = [
    { value: 'points', label: 'Total Points' },
    { value: 'selection', label: 'Most Selected' },
    { value: 'start', label: 'Most Started' },
    { value: 'bench', label: 'Most Benched' },
    { value: 'alphabet', label: 'Alphabetically' },
]

const renderSelectionWidget = (stats: Stats): JSX.Element => {
    const elements = Object.values(stats)
        .reduce((acc, curr) => [ ...acc, ...curr ], [])
        .sort((a, b) => getTotalSelections(b) - getTotalSelections(a))

    return (
        <ul className="widget__list">
            {elements.slice(0, 10).map(element => (
                <li className="widget__list__item">
                    <Player id={element.element.id} />
                    {getTotalSelections(element)}
                </li>
            ))}
        </ul>
    )
}

const renderStartersWidget = (stats: Stats): JSX.Element => {
    const elements = Object.values(stats)
        .reduce((acc, curr) => [ ...acc, ...curr ], [])
        .sort((a, b) => getTotalStarts(b) - getTotalStarts(a))

    return (
        <ul className="widget__list">
            {elements.slice(0, 10).map(element => (
                <li className="widget__list__item">
                    <Player id={element.element.id} />
                    {getTotalStarts(element)}
                </li>
            ))}
        </ul>
    )
}

const renderBenchWidget = (stats: Stats): JSX.Element => {
    const elements = Object.values(stats)
        .reduce((acc, curr) => [ ...acc, ...curr ], [])
        .sort((a, b) => getTotalBenched(b) - getTotalBenched(a))

    return (
        <ul className="widget__list">
            {elements.slice(0, 10).map(element => (
                <li className="widget__list__item">
                    <Player id={element.element.id} />
                    {getTotalBenched(element)}
                </li>
            ))}
        </ul>
    )
}

const renderDifferenceWidget = (stats: Stats, top: boolean = false): JSX.Element => {
    const elements = Object.values(stats)
        .reduce((acc, curr) => [ ...acc, ...curr ], [])
        .map(element => {
            const selections = getTotalSelections(element)
            const benched = getTotalBenched(element)
            const starts = getTotalStarts(element)

            return {
                ...element,
                benched,
                benchedPercentage: benched / selections * 100,
                starts,
                startsPercentage: starts / selections * 100,
            }
        })

    const topStarters = [ ...elements ].sort((a, b) => {
        const percentageDiff = b.startsPercentage - a.startsPercentage
        return percentageDiff === 0 ? b.starts - a.starts : percentageDiff
    })

    const topBenchwarmers = [ ...elements ].sort((a, b) => {
        const percentageDiff = b.benchedPercentage - a.benchedPercentage
        return percentageDiff === 0 ? b.benched - a.benched : percentageDiff
    })

    return (
        <ul className="widget__list">
            {top && topStarters.slice(0, 10).map(element => (
                <li className="widget__list__item">
                    <Player id={element.element.id} />
                    <span>{element.startsPercentage.toFixed(1)}% ({element.starts})</span>
                </li>
            ))}
            {!top && topBenchwarmers.slice(0, 10).map(element => (
                <li className="widget__list__item">
                    <Player id={element.element.id} />
                    <span>{element.benchedPercentage.toFixed(1)}% ({element.benched})</span>
                </li>
            ))}
        </ul>
    )
}

const renderPositionWidget = (stats: Stats, bootstrap: Bootstrap): JSX.Element => {
    const positions: Record<string, number> = Object.entries(stats)
        .reduce((acc, [ elementType, elements ]) => ({
            ...acc,
            [elementType]: elements.length,
        }), {})

    return (
        <ul className="widget__list">
            <li className="widget__list__item">
                <span>Total</span>
                <span>{Object.values(positions).reduce((acc, curr) => acc + curr, 0)}</span>
            </li>
            {Object.entries(positions).map(([ elementType, elements ]) => (
                <li className="widget__list__item">
                    <span>{bootstrap.element_types.find(el => el.id === Number(elementType))?.plural_name}</span>
                    <span>{Number(elements)}</span>
                </li>
            ))}
        </ul>
    )
}

const renderTeamsWidget = (stats: Stats, bootstrap: Bootstrap): JSX.Element => {
    const counts = Object.values(stats)
        .reduce((acc: number[], curr) => [ ...acc, ...curr.map(el => el.element.team) ], [])
        .reduce((acc: { [key: number]: number }, curr) => ({ ...acc, [curr]: (acc[Number(curr)] || 0) + 1 }), {})

    const teams = [ ...bootstrap.teams ].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))

    return (
        <ul className="widget__list">
            {teams.map(team => (
                <li className="widget__list__item">
                    <Team team={team} />
                    <span>{counts[team.id] || 0}</span>
                </li>
            ))}
        </ul>
    )
}

const renderOverallRankWidget = (history: History, bootstrap: Bootstrap): JSX.Element => {
    const data = history.current.map(entry => {
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            value: entry.overall_rank,
        }
    })

    return (
        <div className="chart chart--reversed">
            <ResponsiveContainer height={300} width="100%">
                <AreaChart data={data} margin={{ bottom: 45, left: 15, right: 15 }}>
                    <Area type="monotone" dataKey="value" stroke="#177B47" fill="#177B47" />
                    <YAxis reversed={true} tickFormatter={value => thousandsShorthand(value)} interval="preserveStart" />
                    <XAxis dataKey="name" angle={-90} textAnchor="end" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                    <Tooltip isAnimationActive={false} formatter={value => [ thousandsSeparator(Number(value)), '' ]} separator="" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

const renderPointsWidget = (history: History, bootstrap: Bootstrap): JSX.Element => {
    const data = history.current.map(entry => {
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            points: entry.points,
            bench: entry.points_on_bench,
        }
    })

    return (
        <div className="chart">
            <ResponsiveContainer height={300} width="100%">
                <AreaChart data={data} margin={{ bottom: 45, left: 15, right: 15 }}>
                    <Area type="monotone" dataKey="points" stroke="#177B47" fill="#177B47" />
                    <Area type="monotone" dataKey="bench" stroke="#00FF87" fill="#00FF87" />
                    <YAxis />
                    <XAxis dataKey="name" angle={-90} textAnchor="end" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                    <Tooltip isAnimationActive={false} formatter={(value, name) => [ value, name.charAt(0).toUpperCase() + name.slice(1) ]} separator=": " />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

const renderValueWidget = (history: History, bootstrap: Bootstrap): JSX.Element => {
    const data = history.current.map(entry => {
        const event = bootstrap.events.find(event => event.id === entry.event)

        return {
            name: `GW ${event ? getShortName(event) : entry.event}`,
            value: entry.value + entry.bank,
        }
    })

    return (
        <div className="chart">
            <ResponsiveContainer height={300} width="100%">
                <AreaChart data={data} margin={{ bottom: 45, left: 15, right: 15 }}>
                    <Area type="monotone" dataKey="value" stroke="#177B47" fill="#177B47" />
                    <YAxis tickFormatter={value => `£${value / 10}`} domain={[ 'auto', 'auto' ]} />
                    <XAxis dataKey="name" angle={-90} textAnchor="end" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                    <Tooltip isAnimationActive={false} formatter={(value, name) => [ `£${Number(value) / 10}`, name.charAt(0).toUpperCase() + name.slice(1) ]} separator=": " />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

const renderTots = (stats: Stats): JSX.Element => {
    const gk = [...stats[1]].sort((a, b) => getTotalPoints(b) - getTotalPoints(a)).slice(0, 2)
    const def = [...stats[2]].sort((a, b) => getTotalPoints(b) - getTotalPoints(a)).slice(0, 5)
    const mid = [...stats[3]].sort((a, b) => getTotalPoints(b) - getTotalPoints(a)).slice(0, 5)
    const fwd = [...stats[4]].sort((a, b) => getTotalPoints(b) - getTotalPoints(a)).slice(0, 3)

    const top = [gk[0], ...def.slice(0, 3), ...mid.slice(0, 2), ...fwd.slice(0, 1)]
    const rest = [...def.slice(3), ...mid.slice(2), ...fwd.slice(1)].sort((a, b) => getTotalPoints(b) - getTotalPoints(a))

    const xi = [...top, ...rest.slice(0, 4)].sort((a, b) => a.element.element_type - b.element.element_type)
    const bench = [gk[1], ...rest.slice(4)].sort((a, b) => a.element.element_type - b.element.element_type)

    return (
        <div className="dashboard__tots">
            <div className="dashboard__tots-row">
                {xi.filter(el => el.element.element_type === 1).map(player => (
                    <TotsPlayer
                        id={player.element.id}
                        points={getTotalPoints(player)}
                    />
                ))}
            </div>
            <div className="dashboard__tots-row">
                {xi.filter(el => el.element.element_type === 2).map(player => (
                    <TotsPlayer
                        id={player.element.id}
                        points={getTotalPoints(player)}
                    />
                ))}
            </div>
            <div className="dashboard__tots-row">
                {xi.filter(el => el.element.element_type === 3).map(player => (
                    <TotsPlayer
                        id={player.element.id}
                        points={getTotalPoints(player)}
                    />
                ))}
            </div>
            <div className="dashboard__tots-row">
                {xi.filter(el => el.element.element_type === 4).map(player => (
                    <TotsPlayer
                        id={player.element.id}
                        points={getTotalPoints(player)}
                    />
                ))}
            </div>
            <div className="dashboard__tots-row dashboard__tots-row--bench">
                {bench.map(player => (
                    <TotsPlayer
                        id={player.element.id}
                        points={getTotalPoints(player)}
                    />
                ))}
            </div>
        </div>
    )
}

const renderStatsWidget = (history: History, stats: Stats, id: number | undefined): JSX.Element => {
    const gws = [ ...history.current ].sort((a, b) => b.points - a.points)

    const bestGW = gws[0]
    const worstGW = gws[gws.length - 1]

    const allPlayers = Object.values(stats).reduce((acc, curr) => [ ...acc, ...curr ]);

    const aggregateStats = (key: keyof ElementStats) => allPlayers.map(player => ({
        player,
        [key]: player.data.reduce((acc, data) => {
            if (typeof data.stats?.[key] === 'number') {
                return ((data.stats?.[key] as number) || 0) + acc;
            }

            if (typeof data.stats?.[key] === 'boolean') {
                return (+(data.stats?.[key] as boolean) || 0) + acc;
            }

            return acc;
        }, 0)
    })).sort((a, b) => (b[key] as number) - (a[key] as number))[0]

    const reds = aggregateStats('red_cards')
    const yellows = aggregateStats('yellow_cards')
    const goals = aggregateStats('goals_scored')
    const assists = aggregateStats('assists')
    const cleanSheets = aggregateStats('clean_sheets')
    const goalsConceded = aggregateStats('goals_conceded')
    const ownGoals = aggregateStats('own_goals')
    const saves = aggregateStats('saves')
    const minutes = aggregateStats('minutes')
    const penaltiesMissed = aggregateStats('penalties_missed')
    const penaltiesSaved = aggregateStats('penalties_saved')
    const inDreamteam = aggregateStats('in_dreamteam')
    const bps = aggregateStats('bps')
    const bonus = aggregateStats('bonus')

    const totalTransfers = history.current.reduce((acc,event) => acc + event.event_transfers, 0)
    const totalHits = history.current.reduce((acc,event) => acc + event.event_transfers_cost / 4, 0)
    const totalBenched = history.current.reduce((acc,event) => acc + event.points_on_bench, 0)

    const mostCaptaincies = allPlayers.map(player => ({
        player,
        captaincies: player.data.filter(data => data.multiplier && data.multiplier > 1).length,
    })).sort((a, b) => b.captaincies - a.captaincies)[0]

    return (
        <ul className="widget__list">
            <li className="widget__list__item">
                <span>Total Transfers Made</span>
                <span>
                    <a href={`https://fantasy.premierleague.com/entry/${id}/transfers`} target="_blank" rel="noopener noreferrer">
                        {totalTransfers}
                    </a>
                </span>
            </li>
            <li className="widget__list__item">
                <span>Total Hits Taken</span>
                <span>{totalHits} ({totalHits * -4} pts)</span>
            </li>
            <li className="widget__list__item">
                <span>Total Points on Bench</span>
                <span>{totalBenched} pts</span>
            </li>
            <li className="widget__list__item">
                <span>Best Gameweek</span>
                <span>
                    <a href={`https://fantasy.premierleague.com/entry/${id}/event/${bestGW.event}`} target="_blank" rel="noopener noreferrer">
                        GW {bestGW.event}
                    </a> ({bestGW.points} pts)
                </span>
            </li>
            <li className="widget__list__item">
                <span>Worst Gameweek</span>
                <span>
                    <a href={`https://fantasy.premierleague.com/entry/${id}/event/${worstGW.event}`} target="_blank" rel="noopener noreferrer">
                        GW {worstGW.event}
                    </a> ({worstGW.points} pts)
                </span>
            </li>
            {reds.red_cards > 0 && (
                <li className="widget__list__item">
                    <span>Most Red Cards</span>
                    <Player id={reds.player.element.id} suffix={`${reds.red_cards}`} condensed />
                </li>
            )}
            {yellows.yellow_cards > 0 && (
                <li className="widget__list__item">
                    <span>Most Yellow Cards</span>
                    <Player id={yellows.player.element.id} suffix={`${yellows.yellow_cards}`} condensed />
                </li>
            )}
            {goals.goals_scored > 0 && (
                <li className="widget__list__item">
                    <span>Top Scorer</span>
                    <Player id={goals.player.element.id} suffix={`${goals.goals_scored}`} condensed />
                </li>
            )}
            {assists.assists > 0 && (
                <li className="widget__list__item">
                    <span>Most Assists</span>
                    <Player id={assists.player.element.id} suffix={`${assists.assists}`} condensed />
                </li>
            )}
            {bonus.bonus > 0 && (
                <li className="widget__list__item">
                    <span>Most Bonus Points</span>
                    <Player id={bonus.player.element.id} suffix={`${bonus.bonus}`} condensed />
                </li>
            )}
            {bps.bps > 0 && (
                <li className="widget__list__item">
                    <span>Highest Total BPS</span>
                    <Player id={bps.player.element.id} suffix={`${bps.bps}`} condensed />
                </li>
            )}
            {cleanSheets.clean_sheets > 0 && (
                <li className="widget__list__item">
                    <span>Most Clean Sheets</span>
                    <Player id={cleanSheets.player.element.id} suffix={`${cleanSheets.clean_sheets}`} condensed />
                </li>
            )}
            {goalsConceded.goals_conceded > 0 && (
                <li className="widget__list__item">
                    <span>Most Goals Conceded</span>
                    <Player id={goalsConceded.player.element.id} suffix={`${goalsConceded.goals_conceded}`} condensed />
                </li>
            )}
            {saves.saves > 0 && (
                <li className="widget__list__item">
                    <span>Most Saves</span>
                    <Player id={saves.player.element.id} suffix={`${saves.saves}`} condensed />
                </li>
            )}
            {ownGoals.own_goals > 0 && (
                <li className="widget__list__item">
                    <span>Most Own Goals</span>
                    <Player id={ownGoals.player.element.id} suffix={`${ownGoals.own_goals}`} condensed />
                </li>
            )}
            {penaltiesMissed.penalties_missed > 0 && (
                <li className="widget__list__item">
                    <span>Most Penalties Missed</span>
                    <Player id={penaltiesMissed.player.element.id} suffix={`${penaltiesMissed.penalties_missed}`} condensed />
                </li>
            )}
            {penaltiesSaved.penalties_saved > 0 && (
                <li className="widget__list__item">
                    <span>Most Penalties Saved</span>
                    <Player id={penaltiesSaved.player.element.id} suffix={`${penaltiesSaved.penalties_saved}`} condensed />
                </li>
            )}
            {minutes.minutes > 0 && (
                <li className="widget__list__item">
                    <span>Most Minutes</span>
                    <Player id={minutes.player.element.id} suffix={`${thousandsSeparator(minutes.minutes as number)}`} condensed />
                </li>
            )}
            {inDreamteam.in_dreamteam > 0 && (
                <li className="widget__list__item">
                    <span>Most Times in Dreamteam</span>
                    <Player id={inDreamteam.player.element.id} suffix={`${inDreamteam.in_dreamteam}`} condensed />
                </li>
            )}
            {mostCaptaincies.captaincies > 0 && (
                <li className="widget__list__item">
                    <span>Most Captaincies</span>
                    <Player id={mostCaptaincies.player.element.id} suffix={`${mostCaptaincies.captaincies}`} condensed />
                </li>
            )}
        </ul>
    )
}

const Dashboard: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(true)
    const [ sort, setSort ] = useState<ValueType<OptionType>>(sortOptions[0])

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)
    const isLoadingBootstrap = useSelector((state: RootState) => state.bootstrap.loading)

    const stats = useSelector((state: RootState) => state.stats.data)
    const chips = useSelector((state: RootState) => state.stats.chips)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    const id = useSelector((state: RootState) => state.settings.id)

    const history = useSelector((state: RootState) => state.history.data)
    const isLoadingHistory = useSelector((state: RootState) => state.history.loading)

    const dashboardRef = useRef<HTMLDivElement>(null)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchBootstrap())

        const query: QueryString = queryString.parse(window.location.hash)

        if (query.team && validateTeamId(query.team)) {
            dispatch(setId(query.team))
        }
    }, [ dispatch ])

    useEffect(() => {
        setTimeout(() => {
            if (dashboardRef && dashboardRef.current) {
                dashboardRef.current.scrollTo(dashboardRef.current.scrollWidth, 0)
            }
        }, 1)
    }, [ stats ])

    useEffect(() => {
        setIsModalOpen(!id)

        if (bootstrap && id) {
            dispatch(buildData(bootstrap, id))
            dispatch(fetchHistory(id))

            window.location.hash = queryString.stringify({ team: id })
        }
    }, [ id, dispatch, bootstrap ])

    return (
        <div className="app">
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} />
            )}
            <div className={classNames('app__loading', {
                'app__loading--hidden': !isLoadingBootstrap,
            })}>
                <Spinner />
            </div>
            <div className="app__content">
                <div className="app__legend">
                    <div className="app__color">
                        <div className="app__color__indicator app__color__indicator--started"></div>
                        Started
                    </div>
                    <div className="app__color">
                        <div className="app__color__indicator app__color__indicator--benched"></div>
                        Benched
                    </div>
                    <div className="app__color">
                        <div className="app__color__indicator app__color__indicator--triple"></div>
                        TC
                    </div>
                    <div className="app__color">
                        <div className="app__color__indicator"></div>
                        Not Selected
                    </div>
                </div>
                <div className="dashboard__widgets dashboard__widgets--split">
                    <Widget
                        title="Team of the Season"
                        loading={isLoadingStats}
                        cloaked={!id}
                    >
                        {stats && renderTots(stats)}
                    </Widget>
                    <Widget
                        title="Stats"
                        loading={isLoadingHistory || isLoadingStats}
                        cloaked={!id}
                    >
                        {(history && stats) && renderStatsWidget(history, stats, id)}
                    </Widget>
                </div>
                <div className="app__meta">
                    <label className="app__meta__label">
                        Sort by
                    </label>
                    <Select
                        options={sortOptions}
                        value={sort}
                        onChange={option => setSort(option)}
                        styles={{
                            container: (provided) => ({ ...provided, width: '100%' }),
                            menu: (provided) => ({ ...provided, zIndex: 20 })
                        }}
                    />
                </div>
                <div className={classNames('dashboard', {
                    'dashboard--cloaked': !id,
                })}>
                    {isLoadingStats && (
                        <div className="dashboard__loading">
                            <Spinner />
                        </div>
                    )}
                    <div className="dashboard__container" ref={dashboardRef}>
                        <header className="dashboard__header">
                            <span className="dashboard__heading">
                                Player
                            </span>
                            {bootstrap?.events && getPastEvents(bootstrap.events).filter(event => event.top_element_info.points > 0).map(event => (
                                <span className="dashboard__stat" key={event.id}>
                                    {getShortName(event)}
                                    {chips && chips[event.id] && (
                                        <div>{getChipAbbreviation(chips[event.id])}</div>
                                    )}
                                </span>
                            ))}
                            <div className="dashboard__totals">
                                <span className="dashboard__stat">
                                    Selected
                                </span>
                                <span className="dashboard__stat">
                                    Starting
                                </span>
                                <span className="dashboard__stat">
                                    Benched
                                </span>
                                <span className="dashboard__stat">
                                    Points
                                </span>
                            </div>
                        </header>
                        <ul className="dashboard__list">
                            {stats && Object.entries(stats).map(([ elementType, statData ]) => (
                                <div key={elementType}>
                                    <li className="dashboard__category">
                                        <span>{bootstrap?.element_types.find(el => el.id === Number(elementType))?.plural_name_short}</span>
                                        <span>{statData.length}</span>
                                    </li>
                                    {statData
                                        .filter(element => element.data.filter(pick => pick.multiplier !== null).length)
                                        .sort((a, b) => sortings[(sort as OptionType).value](b) - sortings[(sort as OptionType).value](a))
                                        .map(element => (
                                            <li key={element.element.id} className="dashboard__item">
                                                <div className="dashboard__player">
                                                    <Player id={element.element.id} />
                                                </div>
                                                <div className="dashboard__stats">
                                                    {element.data.map(item => (
                                                        <span
                                                            key={item.event.id}
                                                            className={classNames('dashboard__stat', {
                                                                'dashboard__stat--benched': item.multiplier === 0,
                                                                'dashboard__stat--triple': item.multiplier === 3,
                                                                'dashboard__stat--started': item.multiplier,
                                                            })}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="dashboard__totals">
                                                    <span className="dashboard__stat">
                                                        {getTotalSelections(element)}
                                                    </span>
                                                    <span className="dashboard__stat">
                                                        {(getTotalSelections(element) / element.data.length * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="dashboard__stat">
                                                        {getTotalStarts(element)}
                                                    </span>
                                                    <span className="dashboard__stat">
                                                        {(getTotalStarts(element) / element.data.length * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="dashboard__stat">
                                                        {getTotalBenched(element)}
                                                    </span>
                                                    <span className="dashboard__stat">
                                                        {(getTotalBenched(element) / element.data.length * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="dashboard__stat dashboard__stat--wide">
                                                        {getTotalPoints(element)}
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="dashboard__widgets">
                    <Widget
                        title="Top Selections"
                        loading={isLoadingStats}
                        cloaked={!id}
                    >
                        {stats && renderSelectionWidget(stats)}
                    </Widget>
                    <Widget
                        title="Top Starters"
                        loading={isLoadingStats}
                        cloaked={!id}
                    >
                        {stats && renderStartersWidget(stats)}
                    </Widget>
                    <Widget
                        title="Top Benchwarmers"
                        loading={isLoadingStats}
                        cloaked={!id}
                    >
                        {stats && renderBenchWidget(stats)}
                    </Widget>
                    <Widget
                        title="Most Consistent Starters"
                        loading={isLoadingStats}
                        cloaked={!id}
                    >
                        {stats && renderDifferenceWidget(stats, true)}
                    </Widget>
                    <Widget
                        title="Most Consistent Benchwarmers"
                        loading={isLoadingStats}
                        cloaked={!id}
                    >
                        {stats && renderDifferenceWidget(stats)}
                    </Widget>
                    <Widget
                        title="Breakdown by Team"
                        loading={isLoadingStats}
                        cloaked={!id}
                    >
                        {stats && bootstrap && renderTeamsWidget(stats, bootstrap)}
                    </Widget>
                    <Widget
                        title="Breakdown by Position"
                        loading={isLoadingStats}
                        cloaked={!id}
                    >
                        {stats && bootstrap && renderPositionWidget(stats, bootstrap)}
                    </Widget>
                </div>
                <div className="dashboard__graphs">
                    <Widget
                        title="Overall Rank Evolution"
                        loading={isLoadingHistory}
                        cloaked={!id}
                    >
                        {history && bootstrap && renderOverallRankWidget(history, bootstrap)}
                    </Widget>
                    <Widget
                        title="Gameweek Points"
                        loading={isLoadingHistory}
                        cloaked={!id}
                    >
                        {history && bootstrap && renderPointsWidget(history, bootstrap)}
                    </Widget>
                    <Widget
                        title="Team Value Evolution"
                        loading={isLoadingHistory}
                        cloaked={!id}
                    >
                        {history && bootstrap && renderValueWidget(history, bootstrap)}
                    </Widget>
                </div>
                <div className="app__legal">
                    <p>FPL Stats uses data from the official Premier League Fantasy API. This site is not affiliated with the Premier League.</p>
                </div>
            </div>
            {id !== undefined && (
                <div className="app__footer">
                    <div className="app__footer__content">
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            label="Change Team"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard