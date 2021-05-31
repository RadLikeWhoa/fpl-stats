import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import Select, { ValueType } from 'react-select'
import queryString from 'query-string'
import { Bootstrap, StatData, Stats } from '../../types'
import { fetchBootstrap } from '../../reducers/bootstrap'
import { RootState } from '../../reducers'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { Spinner } from '../Spinner'
import { getPastEvents, getTotalSelections, getTotalStarts, getTotalBenched, getChipAbbreviation, thousandsSeparator, getShortName, validateTeamId, getTotalPoints, round } from '../../utilities'
import { Modal } from '../Modal'
import { setId } from '../../reducers/settings'
import { buildData } from '../../reducers/stats'
import { Button } from '../Button'
import { fetchHistory } from '../../reducers/history'
import { HistoryWidget } from '../HistoryWidget'
import { TotsWidget } from '../TotsWidget'
import { PlayerStatsWidget } from '../PlayerStatsWidget'
import { FormationWidget } from '../FormationWidget'
import { CaptainWidget } from '../CaptainWidget'
import { GameweekWidget } from '../GameweekWidget'
import { PositionsWidget } from '../PositionsWidget'
import { fetchEntry } from '../../reducers/entry'
import { Metric } from '../Metric'
import { SeasonWidget } from '../SeasonWidget'
import { TeamsWidget } from '../TeamsWidget'
import { NonBlankStreakWidget } from '../NonBlankStreakWidget'
import { SelectionStreakWidget } from '../SelectionStreakWidget'
import { StartStreakWidget } from '../StartStreakWidget'
import { BenchStreakWidget } from '../BenchStreakWidget'
import { CaptainOpportunityWidget } from '../CaptainOpportunityWidget'
import { SelectionWidget } from '../SelectionWidget'
import { StarterWidget } from '../StarterWidget'
import { BenchWidget } from '../BenchWidget'
import { DifferenceWidget } from '../DifferenceWidget'
import { OverallRankWidget } from '../OverallRankWidget'
import { PointsWidget } from '../PointsWidget'
import { ValueWidget } from '../ValueWidget'
import './Dashboard.scss'
import { SiteLink } from '../SiteLink'

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

const renderPlayerList = (stats: Stats, bootstrap: Bootstrap, sort: OptionType): JSX.Element[] => Object.entries(stats).map(([ elementType, statData ]) => (
    <div key={elementType}>
        <li className="dashboard__category">
            <span>{bootstrap?.element_types.find(el => el.id === Number(elementType))?.plural_name_short}</span>
            <span>{statData.length}</span>
        </li>
        {statData
            .filter(element => element.data.filter(pick => pick.multiplier !== null).length)
            .sort((a, b) => sortings[sort.value](b) - sortings[sort.value](a))
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
                            {getTotalSelections(element)} ({round(getTotalSelections(element) / element.data.length * 100)}%)
                        </span>
                        <span className="dashboard__stat">
                            {getTotalStarts(element)} ({round(getTotalStarts(element) / element.data.length * 100)}%)
                        </span>
                        <span className="dashboard__stat">
                            {getTotalBenched(element)} ({round(getTotalBenched(element) / element.data.length * 100)}%)
                        </span>
                        <span className="dashboard__stat">
                            <span>
                                {getTotalPoints(element)} ({getTotalStarts(element) > 0 ? round(getTotalPoints(element) / getTotalStarts(element)) : 0} <Metric metric="ppg" />)
                            </span>
                        </span>
                    </div>
                </li>
            ))
        }
    </div>
))

const Dashboard: React.FC = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(true)
    const [ sort, setSort ] = useState<ValueType<OptionType>>(sortOptions[0])

    const isLoading = useSelector((state: RootState) => state.loading > 0)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const stats = useSelector((state: RootState) => state.stats.data)
    const chips = useSelector((state: RootState) => state.stats.chips)

    const id = useSelector((state: RootState) => state.settings.id)

    const entry = useSelector((state: RootState) => state.entry.data)

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
            dispatch(fetchEntry(id))

            window.location.hash = queryString.stringify({ team: id })
        }
    }, [ id, dispatch, bootstrap ])

    return (
        <div className="app">
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} />
            )}
            <div className={classNames('app__loading', {
                'app__loading--hidden': !isLoading,
            })}>
                <Spinner />
            </div>
            <div className="app__content">
                {entry && (
                    <header className="dashboard__entry">
                        <Widget>
                            <h1 className="dashboard__title">
                                <SiteLink label={entry.name} />
                                <div className="small">{entry.summary_overall_points} pts — Rank {thousandsSeparator(entry.summary_overall_rank)}</div>
                            </h1>
                            {id !== undefined && (
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    label="Change Team"
                                />
                            )}
                        </Widget>
                    </header>
                )}
                <div className="dashboard__widgets dashboard__widgets--split">
                    <TotsWidget />
                    <PlayerStatsWidget />
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
                </div>
                <div className={classNames('dashboard', {
                    'dashboard--cloaked': !id,
                })}>
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
                            {stats && bootstrap && renderPlayerList(stats, bootstrap, sort as OptionType)}
                        </ul>
                    </div>
                </div>
                <div className="dashboard__widgets">
                    <SelectionWidget />
                    <StarterWidget />
                    <BenchWidget />
                    <DifferenceWidget title="Most Consistent Starters" top />
                    <DifferenceWidget title="Most Consistent Bench Players" />
                    <TeamsWidget />
                    <PositionsWidget />
                    <HistoryWidget />
                    <FormationWidget />
                    <CaptainWidget />
                    <GameweekWidget />
                    <SeasonWidget />
                    <NonBlankStreakWidget />
                    <SelectionStreakWidget />
                    <StartStreakWidget />
                    <BenchStreakWidget />
                    <CaptainOpportunityWidget />
                </div>
                <div className="dashboard__graphs">
                    <OverallRankWidget />
                    <PointsWidget />
                    <ValueWidget />
                </div>
                <div className="app__legal">
                    <p>FPL Stats uses data from the official Premier League Fantasy API. This site is not affiliated with the Premier League.</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard