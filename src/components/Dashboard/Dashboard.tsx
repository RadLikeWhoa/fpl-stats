import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import Select, { ValueType } from 'react-select'
import { useParams, useHistory } from 'react-router-dom'
import debounce from 'lodash/debounce'
import ReactSlider from 'react-slider'
import { Helmet } from 'react-helmet'
import { StatData, Stats, History, Range } from '../../types'
import { RootState } from '../../reducers'
import { Widget } from '../Widget'
import { Spinner } from '../Spinner'
import {
    thousandsSeparator,
    validateTeamId,
    getPointsLabel,
    last,
    filterStatData,
    filterHistoryData,
    head,
    getPastEvents,
    round,
} from '../../utilities'
import { TeamModal } from '../TeamModal'
import { addHiddenSection, fetchDataWithId, removeHiddenSection } from '../../reducers/settings'
import { Button } from '../Button'
import { HistoryWidget } from '../HistoryWidget'
import { TotsWidget } from '../TotsWidget'
import { PlayerStatsWidget } from '../PlayerStatsWidget'
import { FormationWidget } from '../FormationWidget'
import { CaptainWidget } from '../CaptainWidget'
import { GameweekWidget } from '../GameweekWidget'
import { PositionsWidget } from '../PositionsWidget'
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
import { MilestonesWidget } from '../MilestonesWidget'
import { PlayerOverview } from '../PlayerOverview/PlayerOverview'
import { FormWidget } from '../FormWidget'
import { PriceChangeWidget } from '../PriceChangeWidget'
import { InjuryWidget } from '../InjuryWidget'
import { ExpectedPointsWidget } from '../ExpectedPointsWidget'
import { PopularityWidget } from '../PopularityWidget'
import { TransfersWidget } from '../TransfersWidget'
import { PlayerComparisonWidget } from '../PlayerComparisonWidget'
import { DoubleDigitHaulsWidget } from '../DoubleDigitHaulsWidget'
import { PlayerGWReturnWidget } from '../PlayerGWReturnWidget'
import { TeamGWReturnWidget } from '../TeamGWReturnWidget'
import { TeamContributionWidget } from '../TeamContributionWidget'
import { PointsImprovementsWidget } from '../PointsImprovementsWidget'
import './Dashboard.scss'

export type OptionType = {
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

const sortOptions = [
    { value: 'points', label: 'Total Points' },
    { value: 'selection', label: 'Most Selected' },
    { value: 'start', label: 'Most Started' },
    { value: 'bench', label: 'Most Benched' },
    { value: 'alphabet', label: 'Alphabetically' },
]

export const FilteredDataContext = React.createContext<FilteredData | undefined>(undefined)

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
    const hiddenSections = useSelector((state: RootState) => state.settings.hiddenSections)

    const entry = useSelector((state: RootState) => state.entry.data)

    const rawHistory = useSelector((state: RootState) => state.history.data)

    const { team } = useParams<DashboardParams>()
    const browserHistory = useHistory()

    const [isModalOpen, setIsModalOpen] = useState(!team)

    const dispatch = useDispatch()

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    useEffect(() => {
        if (id && !team) {
            browserHistory.push(`/${id}/`)
        } else if (team && validateTeamId(team)) {
            setIsModalOpen(false)

            if (Number(team) !== entry?.id && !isLoading) {
                dispatch(fetchDataWithId(Number(team)))
            }
        } else {
            browserHistory.push('/')
        }
    }, [team, browserHistory, dispatch, id, isLoading, entry])

    useEffect(() => {
        setIsModalOpen(!team)
    }, [team])

    useEffect(() => {
        setIsModalOpen(!entry?.name)
    }, [entry])

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
        }, 300)
    ).current

    useEffect(() => {
        if (!rawStatsData || !bootstrap || !rawHistory) {
            return
        }

        debouncedFiltering(rawStatsData, rawHistory, bootstrap, range)
    }, [rawStatsData, bootstrap, rawHistory, range, debouncedFiltering, dispatch])

    const totalPoints = filteredData
        ? (last(filteredData.history.current)?.total_points || 0) -
          (rawHistory?.current?.find(event => event.event === (head(filteredData.history.current)?.event || 1) - 1)
              ?.total_points || 0)
        : 0

    const toggleHiddenSection = (section: string) => {
        if (hiddenSections.includes(section)) {
            dispatch(removeHiddenSection(section))
        } else {
            dispatch(addHiddenSection(section))
        }
    }

    const isSectionHidden = (section: string) => hiddenSections.includes(section)

    const renderSection = (title: string, children: JSX.Element) => {
        const id = title.toLowerCase().replace(/ /g, '-')
        const isHidden = isSectionHidden(id)

        return (
            <>
                <h2 className="dashboard__section">
                    <div className="dashboard__section__toggle">
                        <button
                            type="button"
                            title={isHidden ? `Expand "${title}"` : `Collapse "${title}"`}
                            onClick={() => toggleHiddenSection(id)}
                        ></button>
                        {isHidden ? (
                            <>
                                <div className="toggle-icon"></div>
                                <div className="toggle-icon"></div>
                            </>
                        ) : (
                            <div className="toggle-icon"></div>
                        )}
                    </div>
                    <span>{title}</span>
                </h2>
                {!isHidden && children}
            </>
        )
    }

    return (
        <FilteredDataContext.Provider value={filteredData}>
            <Helmet>
                <meta
                    name="theme-color"
                    content={getComputedStyle(document.documentElement).getPropertyValue('--body-background-color')}
                />
            </Helmet>
            <div className="dashboard">
                {isModalOpen && <TeamModal onClose={() => setIsModalOpen(false)} />}
                {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
                <div
                    className={classNames('dashboard__loading', {
                        'dashboard__loading--hidden': !isLoading,
                    })}
                >
                    <Spinner />
                </div>
                <div className="dashboard__content">
                    {entry && (
                        <header className="dashboard__entry">
                            <Widget>
                                <h1 className="dashboard__title">
                                    <SiteLink label={entry.name} />
                                    <div className="small muted">
                                        {getPointsLabel(thousandsSeparator(totalPoints))}
                                        {entry.summary_overall_rank && bootstrap && (
                                            <>
                                                {' '}
                                                — Rank {thousandsSeparator(entry.summary_overall_rank)} (Top{' '}
                                                {round((entry.summary_overall_rank / bootstrap.total_players) * 100)}%)
                                            </>
                                        )}
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
                    {renderSection(
                        'Overview',
                        <div className="dashboard__widgets">
                            <FormWidget />
                            <ExpectedPointsWidget gw="current" />
                            <ExpectedPointsWidget gw="next" />
                            <InjuryWidget />
                            <PriceChangeWidget type="gains" />
                            <PriceChangeWidget type="drops" />
                            <PopularityWidget />
                            <TransfersWidget type="in" />
                            <TransfersWidget type="out" />
                        </div>
                    )}
                    {renderSection(
                        'Season',
                        <>
                            <div className="dashboard__widgets dashboard__widgets--split">
                                <TotsWidget />
                                <NearMissesWidget />
                            </div>
                            <div className="dashboard__widgets">
                                <PlayerStatsWidget />
                                <SeasonWidget />
                                <HistoryWidget />
                                <GameweekWidget />
                                <MilestonesWidget />
                            </div>
                        </>
                    )}
                    {renderSection(
                        'Improvements',
                        <div className="dashboard__widgets dashboard__widgets--single">
                            <PointsImprovementsWidget />
                        </div>
                    )}
                    {renderSection(
                        'Players',
                        <>
                            <div className="dashboard__meta">
                                <label className="dashboard__meta__label">Sort by</label>
                                <Select
                                    options={sortOptions}
                                    value={sort}
                                    onChange={option => setSort(option)}
                                    styles={{
                                        container: provided => ({ ...provided, width: '100%' }),
                                        menu: provided => ({ ...provided, zIndex: 20 }),
                                    }}
                                />
                                <div className="dashboard__legend">
                                    <div className="dashboard__color">
                                        <div className="dashboard__color__indicator dashboard__color__indicator--started"></div>
                                        Started
                                    </div>
                                    <div className="dashboard__color">
                                        <div className="dashboard__color__indicator dashboard__color__indicator--benched"></div>
                                        Benched
                                    </div>
                                    <div className="dashboard__color">
                                        <div className="dashboard__color__indicator dashboard__color__indicator--captain"></div>
                                        Captain
                                    </div>
                                    <div className="dashboard__color">
                                        <div className="dashboard__color__indicator dashboard__color__indicator--triple"></div>
                                        TC
                                    </div>
                                    <div className="dashboard__color">
                                        <div className="dashboard__color__indicator"></div>
                                        Not Selected
                                    </div>
                                </div>
                            </div>
                            <PlayerOverview sort={sort} />
                            <div className="dashboard__widgets dashboard__widgets--single">
                                <PlayerComparisonWidget />
                            </div>
                            <div className="dashboard__widgets">
                                <PositionsWidget />
                                <FormationWidget />
                                <SelectionWidget title="Frequent Selections" metric="selections" />
                                <SelectionWidget title="Frequent Starters" metric="starts" />
                                <SelectionWidget title="Frequent Bench Players" metric="benched" />
                                <DifferenceWidget title="Consistent Starters" top />
                                <DifferenceWidget title="Consistent Bench Players" />
                            </div>
                        </>
                    )}
                    {renderSection(
                        'Returns',
                        <div className="dashboard__widgets">
                            <PlayerGWReturnWidget stat="points" />
                            <PlayerGWReturnWidget stat="benchPoints" />
                            <DoubleDigitHaulsWidget />
                            <TeamGWReturnWidget />
                        </div>
                    )}
                    {renderSection(
                        'Teams',
                        <div className="dashboard__widgets dashboard__widgets--single">
                            <TeamsWidget />
                        </div>
                    )}
                    {renderSection(
                        'Captains',
                        <div className="dashboard__widgets">
                            <CaptainWidget />
                            <CaptainOpportunityWidget />
                            <WrongCaptainWidget />
                        </div>
                    )}
                    {renderSection(
                        'Streaks',
                        <div className="dashboard__widgets">
                            <StreakWidget title="Non-Blank Streaks" metric="nonBlank" showDetailedStats />
                            <StreakWidget
                                title="Double-Digit Haul Streaks"
                                metric="doubleDigitHaul"
                                showDetailedStats
                            />
                            <StreakWidget title="Selection Streaks" metric="selection" showDetailedStats />
                            <StreakWidget title="Start Streaks" metric="start" showDetailedStats />
                            <StreakWidget title="Bench Appearance Streaks" metric="bench" />
                        </div>
                    )}
                    {renderSection(
                        'Contributions',
                        <div className="dashboard__widgets">
                            <ContributionWidget />
                            <TeamContributionWidget />
                            {(range.end - range.start + 1 === rawHistory?.current?.length ||
                                range.end - range.start === 37) && (
                                <>
                                    <MissedPointsShareWidget title="Most Points Scored Outside of Team" top />
                                    <MissedPointsShareWidget title="Fewest Points Scored Outside of Team" />
                                </>
                            )}
                        </div>
                    )}
                    {bootstrap &&
                        getPastEvents(bootstrap.events).length > 1 &&
                        renderSection(
                            'Graphs',
                            <div className="dashboard__graphs">
                                <OverallRankWidget />
                                <PointsWidget />
                                <ValueWidget />
                            </div>
                        )}
                    <div className="dashboard__legal">
                        <p>
                            FPL Stats uses data from the official Premier League Fantasy API. This site is not
                            affiliated with the Premier League.
                        </p>
                    </div>
                    {bootstrap && getPastEvents(bootstrap.events).length > 1 && (
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
        </FilteredDataContext.Provider>
    )
}

export default Dashboard
