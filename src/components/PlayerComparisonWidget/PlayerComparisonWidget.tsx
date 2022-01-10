import React, { useContext, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Select, { ValueType } from 'react-select'
import { useSelector } from 'react-redux'
import { getPointsLabel, getAllPlayers } from '../../utilities'
import { Widget } from '../Widget'
import { FilteredDataContext, OptionType } from '../Dashboard/Dashboard'
import { RootState } from '../../reducers'
import { StatComparison } from '../StatComparison'
import './PlayerComparisonWidget.scss'

const TITLE = 'Player Comparison'

const PlayerComparisonWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const [leftSide, setLeftSide] = useState<ValueType<OptionType>>()
    const [rightSide, setRightSide] = useState<ValueType<OptionType>>()

    if (!data || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const allPlayers = getAllPlayers(data.stats.data)

    const playerOptions = allPlayers
        .sort((a, b) => a.element.web_name.localeCompare(b.element.web_name))
        .map(player => ({
            value: `${player.element.id}`,
            label: `${player.element.web_name} (${
                bootstrap.element_types.find(type => type.id === player.element.element_type)?.singular_name_short
            }, ${bootstrap.teams.find(team => team.id === player.element.team)?.short_name})`,
        }))

    const leftSideData = leftSide
        ? allPlayers.find(el => el.element.id === Number((leftSide as OptionType).value))
        : null

    const rightSideData = rightSide
        ? allPlayers.find(el => el.element.id === Number((rightSide as OptionType).value))
        : null

    const leftKey = leftSideData?.element.web_name || 'valueLeft'
    const rightKey = rightSideData?.element.web_name || 'valueRight'

    const pointsData = data.history.current.map(gw => {
        return {
            name: `GW ${gw.event}`,
            [leftKey]: leftSideData?.data.find(d => d.event.id === gw.event)?.rawPoints || 0,
            [rightKey]: rightSideData?.data.find(d => d.event.id === gw.event)?.rawPoints || 0,
        }
    })

    return (
        <Widget title={TITLE} cssClasses="player-comparison-widget">
            <div className="player-comparison-widget__selection">
                <div className="player-comparison-widget__column" />
                <div className="player-comparison-widget__column">
                    <Select
                        options={playerOptions}
                        className="player-comparison-widget__select"
                        value={leftSide}
                        onChange={option => setLeftSide(option)}
                        styles={{
                            container: provided => ({ ...provided, width: '100%' }),
                            menu: provided => ({ ...provided, zIndex: 20 }),
                        }}
                    />
                </div>
                <div className="player-comparison-widget__column">
                    <Select
                        options={playerOptions}
                        className="player-comparison-widget__select"
                        value={rightSide}
                        onChange={option => setRightSide(option)}
                        styles={{
                            container: provided => ({ ...provided, width: '100%' }),
                            menu: provided => ({ ...provided, zIndex: 20 }),
                        }}
                    />
                </div>
            </div>
            {leftSideData && rightSideData && (
                <>
                    <ul className="comparison-list">
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Goals Scored"
                            compare={(a, b) => a > b || a === b}
                            stat="goals"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Assists"
                            compare={(a, b) => a > b || a === b}
                            stat="assists"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Yellow Cards"
                            compare={(a, b) => a < b || a === b}
                            stat="yellowCards"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Red Cards"
                            compare={(a, b) => a < b || a === b}
                            stat="redCards"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Clean Sheets"
                            compare={(a, b) => a > b || a === b}
                            stat="cleanSheets"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Goals Conceded"
                            compare={(a, b) => a < b || a === b}
                            stat="goalsConceded"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Own Goals"
                            compare={(a, b) => a < b || a === b}
                            stat="ownGoals"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Saves"
                            compare={(a, b) => a > b || a === b}
                            stat="saves"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Minutes"
                            compare={(a, b) => a > b || a === b}
                            stat="minutes"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Penalties Missed"
                            compare={(a, b) => a < b || a === b}
                            stat="penaltiesMissed"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Penalties Saved"
                            compare={(a, b) => a > b || a === b}
                            stat="penaltiesSaved"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Times in Dreamteam"
                            compare={(a, b) => a > b || a === b}
                            stat="timesInDreamteam"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="BPS"
                            compare={(a, b) => a > b || a === b}
                            stat="bps"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Bonus Points"
                            compare={(a, b) => a > b || a === b}
                            stat="bonus"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Captaincies"
                            compare={(a, b) => a > b || a === b}
                            stat="captaincies"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Points"
                            compare={(a, b) => a > b || a === b}
                            stat="points"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Points on Bench"
                            compare={(a, b) => a > b || a === b}
                            stat="benchPoints"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Selections"
                            compare={(a, b) => a > b || a === b}
                            stat="selections"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Starts"
                            compare={(a, b) => a > b || a === b}
                            stat="starts"
                            columnClass="player-comparison-widget__column"
                        />
                        <StatComparison
                            left={leftSideData}
                            right={rightSideData}
                            label="Times on Bench"
                            compare={(a, b) => a > b || a === b}
                            stat="benched"
                            columnClass="player-comparison-widget__column"
                        />
                    </ul>
                    {pointsData && (
                        <div className="player-comparison-widget__chart">
                            <ResponsiveContainer height={300} width="100%">
                                <AreaChart data={pointsData} margin={{ bottom: 45, left: 15, right: 15 }}>
                                    <Area
                                        type="monotone"
                                        dataKey={leftKey}
                                        stroke="#177B47"
                                        fill="#177B47"
                                        fillOpacity="0.75"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey={rightKey}
                                        stroke="#00FF87"
                                        fill="#00FF87"
                                        fillOpacity="0.75"
                                    />
                                    <YAxis
                                        tickFormatter={value => getPointsLabel(value)}
                                        domain={['auto', 'auto']}
                                        interval="preserveStartEnd"
                                    />
                                    <XAxis dataKey="name" angle={-90} textAnchor="end" interval="preserveStartEnd" />
                                    <CartesianGrid stroke="rgba(192, 192, 192, 0.5)" strokeDasharray="3 3" />
                                    <Tooltip
                                        isAnimationActive={false}
                                        formatter={(value, name) => [getPointsLabel(Number(value)), name]}
                                        separator=": "
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </>
            )}
        </Widget>
    )
}

export default PlayerComparisonWidget
