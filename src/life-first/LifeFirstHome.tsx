import DeepArchiveRiver from '../DeepArchiveRiver';
import InfluenceUniverse from '../InfluenceUniverse';
import LifeFirstHero from './LifeFirstHero';
import RightNow from './RightNow';
import WorldRooms from './WorldRooms';
import LifeScenes from './LifeScenes';
import LongformVoice from './LongformVoice';
import CreateRoom from './CreateRoom';
import StartOnRoom from './StartOnRoom';
import ResearchRoom from './ResearchRoom';
import UserHandoff from './UserHandoff';
import {useLocale} from '../locale';
import './life-first.css';
export default function LifeFirstHome(){const {dir}=useLocale();return <main className='life-first-home' dir={dir}><LifeFirstHero/><RightNow/><WorldRooms/><LifeScenes/><LongformVoice/><InfluenceUniverse mode='cinematic'/><CreateRoom/><StartOnRoom/><ResearchRoom/><UserHandoff/><DeepArchiveRiver/></main>}
