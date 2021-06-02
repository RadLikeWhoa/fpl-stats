import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import './TotsPlayer.scss'

type Props = {
    id: number
    points: number
}

const TotsPlayer: React.FC<Props> = (props: Props) => {
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const player = bootstrap?.elements.find(el => el.id === props.id)
    const team = bootstrap?.teams.find(el => el.id === player?.team)
    const position = bootstrap?.element_types.find(el => el.id === player?.element_type)

    return (
        <div className="tots-player">
            <img
                src={`https://fantasy.premierleague.com/dist/img/shirts/special/shirt_${team?.code}${
                    position?.singular_name_short === 'GKP' ? '_1' : ''
                }-66.png`}
                alt={player?.web_name}
                className="tots-player__shirt"
            />
            <div className="tots-player__detail">
                <div className="tots-player__name">
                    <span>{player?.web_name}</span>
                </div>
                <div className="tots-player__points">{props.points}</div>
            </div>
        </div>
    )
}

export default TotsPlayer
