import manifest from './recovered-media.json';
export type RecoveredMediaRecord={id:string;layer:'RECOVERED';title:{he:string;en:string;ru:string};summary:{he:string;en:string;ru:string};publisher:string;sourceLabel:string;sourceUrl:string;mediaKind:'video'|'audio';sourceRange:string;sourceStartSeconds:number;sourceEndSeconds:number;durationSeconds:number;recoveredAt:string;provenance:string;verification:string;topics:string[];playable:true};
export const RECOVERED_MEDIA_RELEASE=manifest.release;
export const recoveredMediaRecords=manifest.records as RecoveredMediaRecord[];
