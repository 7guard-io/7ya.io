import { useEffect, useId, useState } from 'react';
import { Play } from 'lucide-react';
import './lazy-youtube.css';

type LazyYouTubeProps = {
    videoId: string;
    title: string;
    thumbnail: string;
    eager?: boolean;
};

type PlayerActivationDetail = {
    instanceId: string;
};

const PLAYER_ACTIVATION_EVENT = '7ya:youtube-player-activate';

export default function LazyYouTube({ videoId, title, thumbnail, eager = false }: LazyYouTubeProps) {
    const instanceId = useId();
    const [active, setActive] = useState(false);
    const [posterFailed, setPosterFailed] = useState(false);

    useEffect(() => {
        const releaseWhenAnotherPlayerStarts = (event: Event) => {
            const detail = (event as CustomEvent<PlayerActivationDetail>).detail;
            if (detail?.instanceId && detail.instanceId !== instanceId) {
                setActive(false);
            }
        };

        window.addEventListener(PLAYER_ACTIVATION_EVENT, releaseWhenAnotherPlayerStarts);
        return () => window.removeEventListener(PLAYER_ACTIVATION_EVENT, releaseWhenAnotherPlayerStarts);
    }, [instanceId]);

    const activate = () => {
        window.dispatchEvent(new CustomEvent<PlayerActivationDetail>(PLAYER_ACTIVATION_EVENT, {
            detail: { instanceId },
        }));
        setActive(true);
    };

    const useSourcePoster = posterFailed || /i\.ytimg\.com/i.test(thumbnail);

    if (active) {
        return (
            <div
                className='lazy-youtube lazy-youtube-active'
                data-youtube-active={videoId}
                data-youtube-instance={instanceId}
            >
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={title}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    referrerPolicy='strict-origin-when-cross-origin'
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <button
            className={'lazy-youtube lazy-youtube-poster' + (useSourcePoster ? ' is-source-poster' : '')}
            type='button'
            onClick={activate}
            aria-label={`Play: ${title}`}
            data-youtube-poster={videoId}
            data-youtube-instance={instanceId}
            data-source-poster={useSourcePoster ? '1' : undefined}
        >
            {!useSourcePoster && thumbnail ? (
                <img
                    src={thumbnail}
                    alt=''
                    loading={eager ? 'eager' : 'lazy'}
                    decoding='async'
                    referrerPolicy='no-referrer'
                    onError={() => setPosterFailed(true)}
                />
            ) : null}
            <span className='lazy-youtube-fallback' aria-hidden='true'>
                <small>YOUTUBE · SOURCE VIDEO</small>
                <strong>{title}</strong>
                <em>{videoId}</em>
            </span>
            <span className='lazy-youtube-play' aria-hidden='true'><Play fill='currentColor' /></span>
        </button>
    );
}
