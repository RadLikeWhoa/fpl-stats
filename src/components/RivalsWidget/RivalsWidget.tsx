import React, { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Select, { ValueType } from 'react-select'
import classNames from 'classnames'
import { Widget } from '../Widget'
import { FilteredDataContext } from '../Dashboard/Dashboard'
import { RootState } from '../../reducers'
import { ModalInput } from '../ModalInput'
import { Button } from '../Button'
import { fetchApi, getPointsLabel } from '../../utilities'
import { CurrentHistory, History } from '../../types'
import { Spinner } from '../Spinner'
import './RivalsWidget.scss'

const TITLE = 'Rivals'

type OptionType = {
    value: keyof CurrentHistory
    label: string
}

const displayOptions: OptionType[] = [
    { value: 'points', label: 'GW Points' },
    { value: 'total_points', label: 'Total Points' },
]

const rivalColors = ['#7B1D17', '#17327B']

const RivalsWidget: React.FC = () => {
    const data = useContext(FilteredDataContext)
    const entry = useSelector((state: RootState) => state.entry.data)

    const [value, setValue] = useState<string>('')
    const [rivalData, setRivalData] = useState<Record<string, History>>({})
    const [display, setDisplay] = useState<ValueType<OptionType>>(displayOptions[0])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    if (!data || !bootstrap) {
        return <Widget title={TITLE} />
    }

    const addRival = async () => {
        setIsLoading(true)

        const [history, entry] = await Promise.all([fetchApi(`entry/${value}/history/`), fetchApi(`entry/${value}/`)])

        setRivalData(existing => ({
            ...existing,
            [entry.name]: history,
        }))

        setValue('')
        setIsLoading(false)
    }

    const removeRival = (rival: string) => {
        setRivalData(existing => {
            return Object.keys(existing).reduce((acc, key) => {
                if (key !== rival) {
                    acc[key] = existing[key]
                }

                return acc
            }, {} as Record<string, History>)
        })
    }

    const displayValue = (display as OptionType).value

    const pointsData = data.history.current.map(gw => {
        const factor = displayValue === 'value' || displayValue === 'bank' ? 0.1 : 1

        let response: Record<string, string | number> = {
            name: `GW ${gw.event}`,
        }

        if (entry) {
            response[`${entry.name}`] = gw[displayValue] * factor
        }

        Object.entries(rivalData).forEach(([name, history]) => {
            response[name] = (history.current.find(week => week.event === gw.event)?.[displayValue] || 0) * factor
        })

        return response
    })

    return (
        <Widget title={TITLE} cssClasses="rivals-widget">
            <div className="rivals-widget__selection">
                <ModalInput
                    label="Rival Team ID"
                    id="rival"
                    value={value}
                    type="number"
                    onChange={value => setValue(value)}
                />
                <Button label="Add Rival" disabled={Object.keys(rivalData).length === 2} onClick={() => addRival()} />
            </div>
            {Object.keys(rivalData).length > 0 && (
                <div className="rivals-widget__rivals">
                    {Object.keys(rivalData).map(name => (
                        <Button key={name} label={`${name} ×`} onClick={() => removeRival(name)} />
                    ))}
                </div>
            )}
            <div className="rivals-widget__metric">
                <Select
                    options={displayOptions}
                    className="player-comparison-widget__select"
                    value={display}
                    onChange={option => setDisplay(option)}
                    styles={{
                        container: provided => ({ ...provided, width: '100%' }),
                        menu: provided => ({ ...provided, zIndex: 20 }),
                    }}
                />
            </div>
            {Object.keys(rivalData).length > 0 && entry && pointsData && (
                <div className="rivals-widget__chart">
                    <ResponsiveContainer height={200} width="100%">
                        <AreaChart data={pointsData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Area
                                type="monotone"
                                dataKey={entry.name}
                                stroke="#177B47"
                                fill="#177B47"
                                fillOpacity="0.75"
                            />
                            {Object.keys(rivalData).map((key, index) => (
                                <Area
                                    type="monotone"
                                    dataKey={key}
                                    stroke={rivalColors[index]}
                                    fill={rivalColors[index]}
                                    fillOpacity="0.75"
                                />
                            ))}
                            <YAxis
                                reversed={(display as OptionType).value === 'overall_rank'}
                                tickFormatter={value => getPointsLabel(value)}
                                domain={['auto', 'auto']}
                                interval="preserveStartEnd"
                                hide={true}
                            />
                            <XAxis
                                dataKey="name"
                                angle={-90}
                                textAnchor="end"
                                interval="preserveStartEnd"
                                hide={true}
                            />
                            <Tooltip
                                isAnimationActive={false}
                                formatter={(value, name) => [getPointsLabel(Number(value)), name]}
                                separator=": "
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
            <div
                className={classNames('rivals-widget__loading', {
                    'rivals-widget__loading--hidden': !isLoading,
                })}
            >
                <Spinner />
            </div>
        </Widget>
    )
}

export default RivalsWidget
