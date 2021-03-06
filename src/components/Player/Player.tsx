import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import './Player.scss'

type Props = {
    id: number
}

const Player: React.FC<Props> = (props: Props) => {
    const bootstrap = useSelector((state: RootState) => state.bootstrap.data)

    const player = bootstrap?.elements.find(el => el.id === props.id)
    const team = bootstrap?.teams.find(el => el.id === player?.team)
    const position = bootstrap?.element_types.find(el => el.id === player?.element_type)

    return (
        <div className="player">
            <img
                src={`https://fantasy.premierleague.com/dist/img/shirts/special/shirt_${team?.code}${position?.singular_name_short === 'GKP' ? '_1' : ''}-66.png`}
                alt={player?.web_name}
                className="player__shirt"
            />
            <div className="player__detail">
                <div className="player__name">
                    <span>{player?.web_name}</span>
                </div>
                <div className="player__info">
                    <span className="player__team" title={team?.name}>{team?.short_name}</span>
                    <span className="player__position">{position?.singular_name_short}</span>
                </div>
            </div>
        </div>
    )
}

export default Player