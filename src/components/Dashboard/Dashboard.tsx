import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import Select, { ValueType } from 'react-select'
import { useParams, useHistory } from 'react-router-dom'
import debounce from 'lodash/debounce'
import ReactSlider from 'react-slider'
import { Bootstrap, StatData, Stats, History, Range } from '../../types'
import { RootState } from '../../reducers'
import { Player } from '../Player'
import { Widget } from '../Widget'
import { Spinner } from '../Spinner'
import {
    getChipAbbreviation,
    thousandsSeparator,
    validateTeamId,
    round,
    sort,
    getPointsLabel,
    last,
    filterStatData,
    filterHistoryData,
    head,
    getPastEvents,
} from '../../utilities'
import { TeamModal } from '../TeamModal'
import { fetchDataWithId } from '../../reducers/settings'
import { Button } from '../Button'
import { HistoryWidget } from '../HistoryWidget'
import { TotsWidget } from '../TotsWidget'
import { PlayerStatsWidget } from '../PlayerStatsWidget'
import { FormationWidget } from '../FormationWidget'
import { CaptainWidget } from '../CaptainWidget'
import { GameweekWidget } from '../GameweekWidget'
import { PositionsWidget } from '../PositionsWidget'
import { Metric } from '../Metric'
import { SeasonWidget } from '../SeasonWidget'
import { TeamsWidget } from '../TeamsWidget'
import { CaptainOpportunityWidget } from '../CaptainOpportunityWidget'
import { SelectionWidget } from '../SelectionWidget'
import { DifferenceWidget } from '../DifferenceWidget'
import { OverallRankWidget } from '../OverallRankWidget'
import { PointsWidget } from '../PointsWidget'
import { ValueWidget } from '../ValueWidget'
import { SiteLink } from '../SiteLink'
import { WrongCaptainWidget } from '../WrongCaptainWidget'
import { ContributionWidget } from '../ContributionWidget'
import { MissedPointsShareWidget } from '../MissedPointsShareWidget'
import { NearMissesWidget } from '../NearMissesWidget'
import { StreakWidget } from '../StreakWidget'
import { SettingsModal } from '../SettingsModal'
import { useMeanValue } from '../../hooks'
import { finishLoading, startLoading } from '../../reducers/loading'
import './Dashboard.scss'

type OptionType = {
    value: string
    label: string
}

type DashboardParams = {
    team?: string
}

export type FilteredData = {
    history: History
    stats: {
        data: Stats
        chips: {
            [key: number]: string
        }
        tots: {
            xi: StatData[]
            bench: StatData[]
        }
    }
}

const sortings: { [key: string]: (statData: StatData) => number } = {
    points: el => el.aggregates.totals.points,
    selection: el => el.aggregates.totals.selections,
    start: el => el.aggregates.totals.starts,
    bench: el => el.aggregates.totals.benched,
    alphabet: (statData: StatData): number => {
        return statData.element.web_name.toLowerCase().charCodeAt(0) * -1
    },
}

const sortOptions = [
    { value: 'points', label: 'Total Points' },
    { value: 'selection', label: 'Most Selected' },
    { value: 'start', label: 'Most Started' },
    { value: 'bench', label: 'Most Benched' },
    { value: 'alphabet', label: 'Alphabetically' },
]

const renderPlayerList = (
    stats: Stats,
    bootstrap: Bootstrap,
    sorting: OptionType,
    meanValue: (series: (number | null)[]) => number
): JSX.Element[] =>
    Object.entries(stats).map(([elementType, statData]) => (
        <div key={elementType}>
            <li className="dashboard__category">
                <span>{bootstrap?.element_types.find(el => el.id === Number(elementType))?.plural_name_short}</span>
                <span>{statData.length}</span>
            </li>
            {sort(
                statData.filter(element => element.data.filter(pick => pick.multiplier !== null).length),
                el => sortings[sorting.value](el)
            ).map(element => (
                <li key={element.element.id} className="dashboard__item">
                    <div className="dashboard__player">
                        <Player id={element.element.id} extended />
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
                            <div>
                                <b>{element.aggregates.totals.selections}</b>{' '}
                                <span className="muted">
                                    (
                                    {element.data.length
                                        ? round((element.aggregates.totals.selections / element.data.length) * 100)
                                        : 0}
                                    %)
                                </span>
                            </div>
                        </span>
                        <span className="dashboard__stat">
                            <div>
                                <b>{element.aggregates.totals.starts}</b>{' '}
                                <span className="muted">
                                    (
                                    {element.data.length
                                        ? round((element.aggregates.totals.starts / element.data.length) * 100)
                                        : 0}
                                    %)
                                </span>
                            </div>
                        </span>
                        <span className="dashboard__stat">
                            <div>
                                <b>{element.aggregates.totals.benched}</b>{' '}
                                <span className="muted">
                                    (
                                    {element.data.length
                                        ? round((element.aggregates.totals.benched / element.data.length) * 100)
                                        : 0}
                                    %)
                                </span>
                            </div>
                        </span>
                        <span className="dashboard__stat">
                            <div>
                                <b>{element.aggregates.totals.points}</b>{' '}
                                <span className="muted">
                                    (
                                    {round(
                                        meanValue(
                                            element.data
                                                .filter(data => (data.multiplier || 0) > 0)
                                                .map(data => data.points)
                                        )
                                    )}{' '}
                                    <Metric metric="ppg" />)
                                </span>
                            </div>
                        </span>
                    </div>
                </li>
            ))}
        </div>
    ))

const Dashboard: React.FC = () => {
    const [sort, setSort] = useState<ValueType<OptionType>>(sortOptions[0])
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
    const [range, setRange] = useState<Range>({ start: 0, end: 37 })
    const [filteredData, setFilteredData] = useState<FilteredData | undefined>(undefined)

    const isLoading = useSelector((state: RootState) => state.loading > 0)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const rawStatsData = useSelector((state: RootState) => state.stats.data)

    const id = useSelector((state: RootState) => state.settings.id)
    const theme = useSelector((state: RootState) => state.settings.theme)

    const entry = useSelector((state: RootState) => state.entry.data)

    const rawHistory = useSelector((state: RootState) => state.history.data)

    const { team } = useParams<DashboardParams>()
    const browserHistory = useHistory()

    const [isModalOpen, setIsModalOpen] = useState(!team)

    const dashboardRef = useRef<HTMLDivElement>(null)

    const dispatch = useDispatch()
    const meanValue = useMeanValue()

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    useEffect(() => {
        if (id && !team) {
            browserHistory.push(`/${id}/`)
        } else if (team && validateTeamId(team)) {
            setIsModalOpen(false)

            if (Number(team) !== id) {
                dispatch(fetchDataWithId(Number(team)))
            }
        } else {
            browserHistory.push('/')
        }
    }, [team, browserHistory, dispatch, id])

    useEffect(() => {
        setTimeout(() => {
            if (dashboardRef && dashboardRef.current) {
                dashboardRef.current.scrollTo(dashboardRef.current.scrollWidth, 0)
            }
        }, 1)
    }, [rawStatsData])

    useEffect(() => {
        setIsModalOpen(!team)
    }, [team])

    const debouncedFiltering = useRef(
        debounce(async (rawStatsData, rawHistory, bootstrap, range) => {
            const [filteredStatData, filteredHistoryData] = await Promise.all([
                filterStatData(rawStatsData, bootstrap, range),
                filterHistoryData(rawHistory, range),
            ])

            setFilteredData({
                stats: filteredStatData,
                history: filteredHistoryData,
            })

            dispatch(finishLoading())
        }, 300)
    ).current

    useEffect(() => {
        if (!rawStatsData || !bootstrap || !rawHistory) {
            return
        }

        dispatch(startLoading())
        debouncedFiltering(rawStatsData, rawHistory, bootstrap, range)
    }, [rawStatsData, bootstrap, rawHistory, range, debouncedFiltering, dispatch])

    const totalPoints = filteredData
        ? (last(filteredData.history.current)?.total_points || 0) -
          (rawHistory?.current.find(event => event.event === (head(filteredData.history.current)?.event || 1) - 1)
              ?.total_points || 0)
        : 0

    return (
        <div className="app">
            {isModalOpen && <TeamModal onClose={() => setIsModalOpen(false)} />}
            {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
            <div
                className={classNames('app__loading', {
                    'app__loading--hidden': !isLoading,
                })}
            >
                <Spinner />
            </div>
            <div className="app__content">
                {entry && (
                    <header className="dashboard__entry">
                        <Widget>
                            <h1 className="dashboard__title">
                                <SiteLink label={entry.name} />
                                <div className="small muted">
                                    {getPointsLabel(thousandsSeparator(totalPoints))} — Rank{' '}
                                    {thousandsSeparator(entry.summary_overall_rank)}
                                </div>
                            </h1>
                            <div>
                                <Button onClick={() => setIsSettingsOpen(true)} label="Settings" />
                                {id !== undefined && (
                                    <Button
                                        onClick={() => setIsModalOpen(true)}
                                        label="Change Team"
                                        disabled={isLoading}
                                    />
                                )}
                            </div>
                        </Widget>
                    </header>
                )}
                <div className="dashboard__widgets dashboard__widgets--split">
                    <TotsWidget data={filteredData} />
                    <NearMissesWidget data={filteredData} />
                </div>
                <div className="dashboard__widgets dashboard__widgets-duo">
                    <PlayerStatsWidget data={filteredData} />
                    <SeasonWidget data={filteredData} />
                    <HistoryWidget data={filteredData} />
                    <GameweekWidget data={filteredData} />
                    <PositionsWidget data={filteredData} />
                    <FormationWidget data={filteredData} />
                </div>
                <h2>
                    <span>Players</span>
                </h2>
                <div className="app__meta">
                    <label className="app__meta__label">Sort by</label>
                    <Select
                        options={sortOptions}
                        value={sort}
                        onChange={option => setSort(option)}
                        styles={{
                            container: provided => ({ ...provided, width: '100%' }),
                            menu: provided => ({ ...provided, zIndex: 20 }),
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
                <div
                    className={classNames('dashboard', {
                        'dashboard--cloaked': !id,
                    })}
                >
                    <div className="dashboard__container" ref={dashboardRef}>
                        <header className="dashboard__header">
                            <span className="dashboard__heading">Player</span>
                            {filteredData?.history.current.map(event => (
                                <span className="dashboard__stat" key={event.event}>
                                    GW {event.event}
                                    {filteredData?.stats.chips[event.event] && (
                                        <div>{getChipAbbreviation(filteredData.stats.chips[event.event])}</div>
                                    )}
                                </span>
                            ))}
                            <div className="dashboard__totals">
                                <span className="dashboard__stat">Selected</span>
                                <span className="dashboard__stat">Starting</span>
                                <span className="dashboard__stat">Benched</span>
                                <span className="dashboard__stat">Points</span>
                            </div>
                        </header>
                        <ul className="dashboard__list">
                            {filteredData &&
                                bootstrap &&
                                renderPlayerList(filteredData.stats.data, bootstrap, sort as OptionType, meanValue)}
                        </ul>
                    </div>
                </div>
                <div className="dashboard__widgets">
                    <SelectionWidget title="Top Selections" metric="selections" data={filteredData} />
                    <SelectionWidget title="Top Starters" metric="starts" data={filteredData} />
                    <SelectionWidget title="Top Bench Players" metric="benched" data={filteredData} />
                    <DifferenceWidget title="Most Consistent Starters" top data={filteredData} />
                    <DifferenceWidget title="Most Consistent Bench Players" data={filteredData} />
                </div>
                <h2>
                    <span>Teams</span>
                </h2>
                <div className="dashboard__widgets dashboard__widgets--single">
                    <TeamsWidget data={filteredData} />
                </div>
                <h2>
                    <span>Captains</span>
                </h2>
                <div className="dashboard__widgets">
                    <CaptainWidget data={filteredData} />
                    <CaptainOpportunityWidget data={filteredData} />
                    <WrongCaptainWidget data={filteredData} />
                </div>
                <h2>
                    <span>Streaks</span>
                </h2>
                <div className="dashboard__widgets">
                    <StreakWidget
                        title="Highest Non-Blank Streaks"
                        metric="nonBlank"
                        showDetailedStats
                        data={filteredData}
                    />
                    <StreakWidget
                        title="Highest Selection Streaks"
                        metric="selection"
                        showDetailedStats
                        data={filteredData}
                    />
                    <StreakWidget title="Highest Start Streaks" metric="start" showDetailedStats data={filteredData} />
                    <StreakWidget title="Highest Bench Appearance Streaks" metric="bench" data={filteredData} />
                </div>
                <h2>
                    <span>Contributions</span>
                </h2>
                <div className="dashboard__widgets">
                    <ContributionWidget data={filteredData} />
                    {range.end - range.start === rawHistory?.current.length && (
                        <>
                            <MissedPointsShareWidget
                                title="Most Points Scored Outside of Team"
                                top
                                data={filteredData}
                            />
                            <MissedPointsShareWidget title="Fewest Points Scored Outside of Team" data={filteredData} />
                        </>
                    )}
                </div>
                <h2>
                    <span>Graphs</span>
                </h2>
                <div className="dashboard__graphs">
                    <OverallRankWidget data={filteredData} />
                    <PointsWidget data={filteredData} />
                    <ValueWidget data={filteredData} />
                </div>
                <div className="app__legal">
                    <p>
                        FPL Stats uses data from the official Premier League Fantasy API. This site is not affiliated
                        with the Premier League.
                    </p>
                </div>
                {bootstrap && getPastEvents(bootstrap.events).length > 0 && (
                    <div className="dashboard__slider-wrapper">
                        <ReactSlider
                            className="dashboard__slider"
                            value={[range.start, range.end]}
                            min={(head(getPastEvents(bootstrap.events))?.id || 1) - 1}
                            max={(last(getPastEvents(bootstrap.events))?.id || 38) - 1}
                            onChange={([start, end]) => setRange({ start, end })}
                            renderThumb={(props, state) => <div {...props}>GW {state.valueNow + 1}</div>}
                            pearling
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
