import {ArrowUpLeft} from 'lucide-react';
import {useLocale} from '../locale';
import {lifeMomentHref} from './moment-link';
import './life-context-link.css';
const labels={he:'בתוך רגע החיים',en:'Inside the life moment',ru:'Внутри момента жизни'} as const;
export default function LifeContextLink({momentId,label,className=''}:{momentId:string;label?:string;className?:string}){const {locale}=useLocale();return <a className={'life-context-link '+className} href={lifeMomentHref(momentId,locale)}><span>{label||labels[locale]}</span><ArrowUpLeft/></a>}