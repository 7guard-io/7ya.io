export const publicVisual=(url:string)=>/^https:\/\//i.test(url)?'/api/media-image?v=5&url='+encodeURIComponent(url):'';
