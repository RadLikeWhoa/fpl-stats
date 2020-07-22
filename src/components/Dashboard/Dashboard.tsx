import React, { useState, useEffect, useRef } from 'react'
import { Bootstrap, StatData, Stats, History } from '../../types'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBootstrap } from '../../reducers/bootstrap'
import { RootState } from '../../reducers'
import { Player } from '../Player'
import { Checkbox } from '../Checkbox'
import { Widget } from '../Widget'
import { Team } from '../Team'
import { Spinner } from '../Spinner'
import { getPastEvents, getTotalSelections, getTotalStarts, getTotalBenched, getChipAbbreviation, thousandsSeparator, getShortName, validateTeamId, thousandsShorthand } from '../../utilities'
import { Modal } from '../Modal'
import { toggleIncludeInactive, setId } from '../../reducers/settings'
import { buildData } from '../../reducers/stats'
import { Button } from '../Button'
import classNames from 'classnames'
import { fetchHistory } from '../../reducers/history'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import Select, { ValueType } from 'react-select'
import queryString from 'query-string'
import './Dashboard.scss'

type OptionType = {
    value: string
    label: string
}

type QueryString = {
    team?: string
}

const sortings: { [ key: string ]: (statData: StatData) => number } = {
    selection: getTotalSelections,
    start: getTotalStarts,
    bench: getTotalBenched,
    alphabet: (statData: StatData): number => {
        return statData.element.web_name.toLowerCase().charCodeAt(0) * -1
    }
}

const sortOptions = [
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
    const positions = Object.entries(stats)
        .reduce((acc, [ elementType, elements ]) => ({
            ...acc,
            [elementType]: elements.length,
        }), {})

    return (
        <ul className="widget__list">
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

const Dashboard: React.FC = () => {
    const [ filteredStats, setFilteredStats ] = useState<Stats | undefined>(undefined)
    const [ filteredHistory, setFilteredHistory ] = useState<History | undefined>(undefined)
    const [ isModalOpen, setIsModalOpen ] = useState(true)
    const [ sort, setSort ] = useState<ValueType<OptionType>>(sortOptions[0])

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)
    const isLoadingBootstrap = useSelector((state: RootState) => state.bootstrap.loading)

    const stats = useSelector((state: RootState) => state.stats.data)
    const chips = useSelector((state: RootState) => state.stats.chips)
    const isLoadingStats = useSelector((state: RootState) => state.stats.loading)

    const id = useSelector((state: RootState) => state.settings.id)
    const includeInactive = useSelector((state: RootState) => state.settings.includeInactive)

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

    useEffect(() => {
        if (!stats) {
            setFilteredStats(undefined)
            return
        }

        setFilteredStats(Object.entries(stats).reduce((acc: Stats, [ elementType, stats ]) => ({
            ...acc,
            [Number(elementType)]: stats.map(element => ({
                ...element,
                data: element.data.filter(item => {
                    const topPoints = bootstrap?.events.find(event => event.id === item.event.id)?.top_element_info.points
                    return includeInactive || (topPoints && topPoints > 0)
                }),
            })),
        }), {}))
    }, [ includeInactive, stats, bootstrap ])

    useEffect(() => {
        if (!history) {
            setFilteredHistory(undefined)
            return
        }

        setFilteredHistory({
            ...history,
            current: history.current.filter(current => {
                const topPoints = bootstrap?.events.find(event => event.id === current.event)?.top_element_info.points
                return includeInactive || (topPoints && topPoints > 0)
            })
        })
    }, [ includeInactive, history, bootstrap ])

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
                        {bootstrap?.events && getPastEvents(bootstrap.events).filter(event => includeInactive || event.top_element_info.points > 0).map(event => (
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
                        </div>
                    </header>
                    <ul className="dashboard__list">
                        {filteredStats && Object.entries(filteredStats).map(([ elementType, statData ]) => (
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
                    {filteredStats && renderSelectionWidget(filteredStats)}
                </Widget>
                <Widget
                    title="Top Starters"
                    loading={isLoadingStats}
                    cloaked={!id}
                >
                    {filteredStats && renderStartersWidget(filteredStats)}
                </Widget>
                <Widget
                    title="Top Benchwarmers"
                    loading={isLoadingStats}
                    cloaked={!id}
                >
                    {filteredStats && renderBenchWidget(filteredStats)}
                </Widget>
                <Widget
                    title="Most Consistent Starters"
                    loading={isLoadingStats}
                    cloaked={!id}
                >
                    {filteredStats && renderDifferenceWidget(filteredStats, true)}
                </Widget>
                <Widget
                    title="Most Consistent Benchwarmers"
                    loading={isLoadingStats}
                    cloaked={!id}
                >
                    {filteredStats && renderDifferenceWidget(filteredStats)}
                </Widget>
                <Widget
                    title="Breakdown by Team"
                    loading={isLoadingStats}
                    cloaked={!id}
                >
                    {filteredStats && bootstrap && renderTeamsWidget(filteredStats, bootstrap)}
                </Widget>
                <Widget
                    title="Breakdown by Position"
                    loading={isLoadingStats}
                    cloaked={!id}
                >
                    {filteredStats && bootstrap && renderPositionWidget(filteredStats, bootstrap)}
                </Widget>
            </div>
            <div className="dashboard__graphs">
                <Widget
                    title="Overall Rank Evolution"
                    loading={isLoadingHistory}
                    cloaked={!id}
                >
                    {filteredHistory && bootstrap && renderOverallRankWidget(filteredHistory, bootstrap)}
                </Widget>
                <Widget
                    title="Gameweek Points"
                    loading={isLoadingHistory}
                    cloaked={!id}
                >
                    {filteredHistory && bootstrap && renderPointsWidget(filteredHistory, bootstrap)}
                </Widget>
                <Widget
                    title="Team Value Evolution"
                    loading={isLoadingHistory}
                    cloaked={!id}
                >
                    {filteredHistory && bootstrap && renderValueWidget(filteredHistory, bootstrap)}
                </Widget>
            </div>
            <div className="app__legal">
                <p>FPL Stats uses data from the official Premier League Fantasy API. This site is not affiliated with the Premier League.</p>
            </div>
            {id !== undefined && (
                <div className="app__footer">
                    <div className="app__footer__content">
                        <Checkbox
                            label="Include inactive gameweeks"
                            checked={includeInactive}
                            onChange={() => dispatch(toggleIncludeInactive())}
                        />
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