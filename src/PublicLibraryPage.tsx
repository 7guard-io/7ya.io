import{api}from'@appdeploy/client';import{useEffect,useState}from"react";import{ArrowRight,ExternalLink,Layers3,Play,Search,ShieldCheck,SlidersHorizontal,X}from"lucide-react";import{appendQuery,pageHref,rootHref,useLocale}from"./locale";import{fetchPublicProjection,type PublicLibraryItem}from"./public-library-model";import"./public-library.css";import"./public-library-human.css";import'./entity-graph.css';import{getArchiveCollections,getArchiveInterfaceCopy}from"./archive-collections";const copy={he:{eyebrow:"IGOR \xB7 LIFE ARCHIVE \xB7 ALL PUBLIC CONTENT",lead:"\u05D6\u05D4 \u05D4\u05D0\u05E8\u05DB\u05D9\u05D5\u05DF \u05D4\u05D7\u05D9 \u05E9\u05DC \u05D4\u05D7\u05D9\u05D9\u05DD \u05D5\u05D4\u05E2\u05E9\u05D9\u05D9\u05D4 \u05E9\u05DC\u05D9: \u05E4\u05D5\u05E1\u05D8\u05D9\u05DD, \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA, \u05D5\u05D9\u05D3\u05D0\u05D5, \u05DB\u05EA\u05D1\u05D5\u05EA, \u05E8\u05D0\u05D9\u05D5\u05E0\u05D5\u05EA, \u05DE\u05D5\u05D6\u05D9\u05E7\u05D4, \u05DE\u05E1\u05DE\u05DB\u05D9\u05DD, StartOn, \u05DE\u05D7\u05E7\u05E8, \u05D4\u05D5\u05E4\u05E2\u05D5\u05EA \u05D5\u05DE\u05E7\u05D5\u05E8\u05D5\u05EA \u05E9\u05E0\u05D5\u05E1\u05E4\u05D9\u05DD \u05DB\u05DB\u05DC \u05E9\u05D4\u05DD \u05E0\u05DE\u05E6\u05D0\u05D9\u05DD. \u05D0\u05E4\u05E9\u05E8 \u05DC\u05DE\u05D9\u05D9\u05DF \u05DC\u05E4\u05D9 \u05E9\u05E0\u05D4, \u05E4\u05DC\u05D8\u05E4\u05D5\u05E8\u05DE\u05D4, \u05E1\u05D5\u05D2 \u05D5\u05E9\u05DB\u05D1\u05EA \u05D0\u05D9\u05DE\u05D5\u05EA. \u05D0\u05D9\u05DF \u05DB\u05D0\u05DF \u05DE\u05E1\u05E4\u05E8 \u05D9\u05E2\u05D3 \u2014 \u05E8\u05E7 \u05DB\u05DC \u05DE\u05D4 \u05E9\u05D9\u05D3\u05D5\u05E2 \u05DB\u05E8\u05D2\u05E2 \u05D5\u05D4\u05DE\u05E9\u05DA \u05D8\u05E2\u05D9\u05E0\u05D4 \u05D0\u05DC \u05DB\u05DC \u05DE\u05D4 \u05E9\u05E0\u05DE\u05E6\u05D0 \u05D1\u05DE\u05D0\u05D2\u05E8.",search:"\u05D7\u05D9\u05E4\u05D5\u05E9 \u05D1\u05DB\u05DC \u05D4\u05E1\u05E4\u05E8\u05D9\u05D9\u05D4",all:"\u05D4\u05DB\u05D5\u05DC",canon:"\u05E7\u05D0\u05E0\u05D5\u05DF",discovery:"Discovery",live:"\u05D7\u05D9",legacy:"Legacy",pending:"Pending",platform:"\u05E4\u05DC\u05D8\u05E4\u05D5\u05E8\u05DE\u05D4",year:"\u05E9\u05E0\u05D4",topic:"\u05E0\u05D5\u05E9\u05D0",newest:"\u05D7\u05D3\u05E9 \u2192 \u05D9\u05E9\u05DF",oldest:"\u05D9\u05E9\u05DF \u2192 \u05D7\u05D3\u05E9",items:"\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8\u05D9\u05DD \u05E6\u05D9\u05D1\u05D5\u05E8\u05D9\u05D9\u05DD \u05D9\u05D3\u05D5\u05E2\u05D9\u05DD",partial:"\u05D0\u05D7\u05D3 \u05DE\u05D6\u05E8\u05DE\u05D9 \u05D4\u05DE\u05E7\u05D5\u05E8 \u05DC\u05D0 \u05E0\u05D8\u05E2\u05DF; \u05D9\u05EA\u05E8 \u05D4\u05D6\u05E8\u05DE\u05D9\u05DD \u05E0\u05E9\u05D0\u05E8\u05D9\u05DD \u05DE\u05D5\u05E6\u05D2\u05D9\u05DD.",source:"\u05DC\u05DE\u05E7\u05D5\u05E8",more:"\u05DC\u05D4\u05D1\u05D9\u05D0 \u05E2\u05D5\u05D3 \u05DE\u05D4\u05DE\u05D0\u05D2\u05E8",empty:"\u05D0\u05D9\u05DF \u05E4\u05E8\u05D9\u05D8\u05D9\u05DD \u05DC\u05DE\u05E1\u05E0\u05DF \u05D4\u05D6\u05D4.",reset:"\u05D0\u05D9\u05E4\u05D5\u05E1",showing:"\u05DE\u05D5\u05E6\u05D2\u05D9\u05DD"},en:{eyebrow:"IGOR \xB7 LIFE ARCHIVE \xB7 ALL PUBLIC CONTENT",lead:"This is the living archive of my life and work: posts, photographs, video, coverage, interviews, music, documents, StartOn, research, appearances and sources added as they are found. Sort it by year, platform, type and verification layer. There is no target count \u2014 only everything currently known and progressive access to the rest of the archive.",search:"Search the whole library",all:"All",canon:"Canon",discovery:"Discovery",live:"Live",legacy:"Legacy",pending:"Pending",platform:"Platform",year:"Year",topic:"Topic",newest:"Newest \u2192 oldest",oldest:"Oldest \u2192 newest",items:"known public objects",partial:"One source stream failed; the other streams remain visible.",source:"Open source",more:"Load more from inventory",empty:"No objects match this filter.",reset:"Reset",showing:"Showing"},ru:{eyebrow:"IGOR \xB7 LIFE ARCHIVE \xB7 ALL PUBLIC CONTENT",lead:"\u042D\u0442\u043E \u0436\u0438\u0432\u043E\u0439 \u0430\u0440\u0445\u0438\u0432 \u043C\u043E\u0435\u0439 \u0436\u0438\u0437\u043D\u0438 \u0438 \u0440\u0430\u0431\u043E\u0442\u044B: \u043F\u043E\u0441\u0442\u044B, \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438, \u0432\u0438\u0434\u0435\u043E, \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438, \u0438\u043D\u0442\u0435\u0440\u0432\u044C\u044E, \u043C\u0443\u0437\u044B\u043A\u0430, \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B, StartOn, \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F, \u0432\u044B\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u044F \u0438 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u043F\u043E \u043C\u0435\u0440\u0435 \u043E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u0438\u044F. \u0410\u0440\u0445\u0438\u0432 \u043C\u043E\u0436\u043D\u043E \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E \u0433\u043E\u0434\u0443, \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435, \u0442\u0438\u043F\u0443 \u0438 \u0443\u0440\u043E\u0432\u043D\u044E \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438. \u0417\u0434\u0435\u0441\u044C \u043D\u0435\u0442 \u0446\u0435\u043B\u0435\u0432\u043E\u0433\u043E \u0447\u0438\u0441\u043B\u0430 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u0441\u0451 \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u0441\u0435\u0439\u0447\u0430\u0441 \u0438 \u043F\u043E\u0441\u0442\u0435\u043F\u0435\u043D\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0430\u0440\u0445\u0438\u0432\u0430.",search:"\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0432\u0441\u0435\u0439 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0435",all:"\u0412\u0441\u0435",canon:"\u041A\u0430\u043D\u043E\u043D",discovery:"Discovery",live:"Live",legacy:"Legacy",pending:"Pending",platform:"\u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430",year:"\u0413\u043E\u0434",topic:"\u0422\u0435\u043C\u0430",newest:"\u041D\u043E\u0432\u044B\u0435 \u2192 \u0441\u0442\u0430\u0440\u044B\u0435",oldest:"\u0421\u0442\u0430\u0440\u044B\u0435 \u2192 \u043D\u043E\u0432\u044B\u0435",items:"\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0445 \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0445 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432",partial:"\u041E\u0434\u0438\u043D \u043F\u043E\u0442\u043E\u043A \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0441\u044F; \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0432\u0438\u0434\u0438\u043C\u044B\u043C\u0438.",source:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A",more:"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0435\u0449\u0451",empty:"\u041D\u0435\u0442 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0444\u0438\u043B\u044C\u0442\u0440\u0430.",reset:"\u0421\u0431\u0440\u043E\u0441",showing:"\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E"}},typeCopy={video:{he:"\u05D5\u05D9\u05D3\u05D0\u05D5",en:"Video",ru:"\u0412\u0438\u0434\u0435\u043E"},image:{he:"\u05EA\u05DE\u05D5\u05E0\u05D4",en:"Image",ru:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435"},article:{he:"\u05DB\u05EA\u05D1\u05D4 / \u05D8\u05E7\u05E1\u05D8",en:"Article",ru:"\u0421\u0442\u0430\u0442\u044C\u044F"},audio:{he:"\u05D0\u05D5\u05D3\u05D9\u05D5",en:"Audio",ru:"\u0410\u0443\u0434\u0438\u043E"},post:{he:"\u05E4\u05D5\u05E1\u05D8",en:"Post",ru:"\u041F\u043E\u0441\u0442"},document:{he:"\u05DE\u05E1\u05DE\u05DA",en:"Document",ru:"\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442"},profile:{he:"\u05E4\u05E8\u05D5\u05E4\u05D9\u05DC",en:"Profile",ru:"\u041F\u0440\u043E\u0444\u0438\u043B\u044C"},other:{he:"\u05D0\u05D7\u05E8",en:"Other",ru:"\u0414\u0440\u0443\u0433\u043E\u0435"}},layerText=(layer,locale,c)=>layer==="CANON"?c.canon:layer==="DISCOVERY"?c.discovery:layer==="LIVE"?c.live:layer==="LEGACY"?c.legacy:layer==="PENDING"?c.pending:c.all,facetCount=(facets,value)=>facets?.find(([name])=>name===value)?.[1]||0,cleanPlatform=value=>value.replace(/^https?:\/\//,"").slice(0,40),youtubeId=raw=>{try{const url=new URL(raw);return url.hostname==="youtu.be"?url.pathname.split("/").filter(Boolean)[0]||"":url.hostname.endsWith("youtube.com")&&(url.searchParams.get("v")||url.pathname.match(/\/(?:shorts|embed)\/([^/?#]+)/)?.[1])||""}catch{return""}};function LibraryVisual({item}){const initial=item.imageUrl?"source":item.screenshotUrl?"screenshot":"poster",[stage,setStage]=useState(initial);useEffect(()=>setStage(item.imageUrl?"source":item.screenshotUrl?"screenshot":"poster"),[item.id,item.imageUrl,item.screenshotUrl]);const src=stage==="source"?item.imageUrl:stage==="screenshot"?item.screenshotUrl:"",fail=()=>setStage(stage==="source"&&item.screenshotUrl?"screenshot":"poster");return<div className={"pl-visual "+(stage==="poster"?"is-poster":"")}data-visual-stage={stage}>
      {src&&<img src={src}alt={item.title.en}loading="lazy"decoding="async"referrerPolicy="no-referrer"onError={fail}/>}
      <div className="pl-poster">
        <small>{item.mediaType.toUpperCase()}</small>
        <strong>{cleanPlatform(item.platform||item.publisher||"PUBLIC")}</strong>
        <span>{item.year||"PUBLIC WEB"}</span>
      </div>
      {stage==="screenshot"&&<span className="pl-screen-badge">SOURCE SCREENSHOT</span>}
      {item.mediaType==="video"&&<Play className="pl-play"/>}
    </div>}type GraphNode={id:string;kind:string;label:string;canonicalId?:string;truthStatus:string;data?:Record<string,unknown>};type GraphEdge={type:string;from:string;to:string};type GraphSearch={matches?:GraphNode[];nodes?:GraphNode[];edges?:GraphEdge[]};type GraphEntity={id:string;entityId:string;label:string;kind:string;truthStatus:string};const graphEntityLabel=(node:GraphNode,locale:'he'|'en'|'ru')=>{const raw=node.data?.label;if(raw&&typeof raw==='object'){const value=(raw as Record<string,unknown>)[locale];if(typeof value==='string')return value}return node.label};const graphEntityId=(node:GraphNode)=>{const value=node.data?.entityId;return typeof value==='string'?value:node.id.replace(/^entity:/,'')};function MomentGraph({item,locale,entities}:{item:PublicLibraryItem;locale:'he'|'en'|'ru';entities:GraphEntity[]}){const sparse=item.relationships.length===0&&entities.length===0&&item.relatedLabels.length<2;return <section className="pl-consequence-graph" aria-label="Source-linked consequence and connection graph"><header><div><small dir="ltr">CONSEQUENCE / CONNECTION GRAPH</small><h3>{locale==='he'?'מה הרגע הזה מחבר':locale==='ru'?'Что связывает этот момент':'What this moment connects'}</h3></div><span dir="ltr">EVIDENCE ONLY</span></header><div className="pl-graph-stage"><article className="pl-graph-center"><small dir="ltr">SELECTED MOMENT</small><strong>{item.title[locale]}</strong><span dir="ltr">{item.year||'PUBLIC'} · {item.trust||item.layer}</span></article>{item.relationships.length>0&&<div className="pl-graph-edges"><small dir="ltr">RECORDED EDGE TYPES</small>{item.relationships.slice(0,8).map(value=><b key={value}>{value}</b>)}</div>}{item.relatedLabels.length>0&&<div className="pl-graph-nodes"><small dir="ltr">CONNECTED RECORDS / LABELS</small>{item.relatedLabels.slice(0,8).map(value=><span key={value}>{value}</span>)}</div>}</div>{entities.length>0&&<div className="pl-graph-entities"><small dir="ltr">GRAPH ENTITIES · CLICK TO EXPLORE</small><div>{entities.map(entity=><a href={rootHref('entity/'+encodeURIComponent(entity.entityId)+'/?lang='+locale)} key={entity.id}><b>{entity.label}</b><span dir="ltr">{entity.kind.toUpperCase()} · {entity.truthStatus}</span></a>)}</div></div>}{item.topics.length>0&&<div className="pl-graph-topics">{item.topics.slice(0,8).map(value=><span key={value}>{value}</span>)}</div>}{sparse&&<p className="pl-graph-sparse">{locale==='he'?'ראיות קשר דלילות · לא נוספו צמתים או סיבתיות שלא קיימים במקור.':locale==='ru'?'Разреженные данные связей · не добавлены узлы или причинность, которых нет в источнике.':'Sparse relationship evidence · no inferred nodes or causality were added.'}</p>}<footer dir="ltr">SPATIAL ORDER ≠ CAUSAL ORDER · SOURCE RELATIONS ONLY</footer></section>}function PublicLibraryPage(){const{locale,dir}=useLocale(),c=copy[locale],params=new URLSearchParams(window.location.search),momentMatch=window.location.pathname.match(/\/moment\/([^/]+)\/?$/),momentId=momentMatch?decodeURIComponent(momentMatch[1]):"",chapterQuery=params.get("q")||"",validLayers=["CANON","DISCOVERY","LIVE","LEGACY","PENDING"],[input,setInput]=useState(params.get("q")||""),[query,setQuery]=useState(params.get("q")||""),[layer,setLayer]=useState(validLayers.includes(params.get("layer")||"")?params.get("layer"):"ALL"),[media,setMedia]=useState(params.get("type")||""),[platform,setPlatform]=useState(params.get("platform")||""),[year,setYear]=useState(params.get("year")||""),[topic,setTopic]=useState(params.get("topic")||""),[sort,setSort]=useState("impact"),[payload,setPayload]=useState(null),[items,setItems]=useState([]),[state,setState]=useState("loading"),[moreLoading,setMoreLoading]=useState(!1),[selected,setSelected]=useState(null),[momentEntities,setMomentEntities]=useState<GraphEntity[]>([]),args=(cursor="")=>({q:query,layer:layer==="ALL"?"":layer,platform,year,type:media,topic,sort,cursor,limit:60}),libraryHref=()=>{const next=new URLSearchParams;next.set("lang",locale),query&&next.set("q",query),layer!=="ALL"&&next.set("layer",layer),media&&next.set("type",media),platform&&next.set("platform",platform),year&&next.set("year",year),topic&&next.set("topic",topic);return rootHref("library/?"+next.toString())},momentHref=(item:PublicLibraryItem)=>rootHref("moment/"+encodeURIComponent(item.id)+"/?lang="+locale),openMoment=(item:PublicLibraryItem)=>{window.history.replaceState(null,"",momentHref(item)),setSelected(item)},closeMoment=()=>{window.history.replaceState(null,"",libraryHref()),setSelected(null)};useEffect(()=>{let live=!0;return setState("loading"),fetchPublicProjection(args()).then(data=>{live&&(setPayload(data),setItems(data.items),setState("ready"))}).catch(()=>{live&&(setPayload(null),setItems([]),setState("failed"))}),()=>{live=!1}},[query,layer,media,platform,year,topic,sort]),useEffect(()=>{if(selected||momentId)return;window.history.replaceState(null,"",libraryHref())},[locale,query,layer,media,platform,year,topic,selected,momentId]),useEffect(()=>{if(!momentId)return;let live=!0;return fetchPublicProjection({id:momentId,limit:20}).then(data=>{if(!live)return;const exact=data.items.find(item=>item.id===momentId);exact&&setSelected(exact)}).catch(()=>undefined),()=>{live=!1}},[momentId]),useEffect(()=>{setMomentEntities([]);if(!selected?.canonicalId)return;let live=!0;void api.get('/api/public-internet-graph/search?q='+encodeURIComponent(selected.canonicalId)+'&kind=Moment&limit=1').then(response=>{if(!live)return;const data=response.data as GraphSearch,moment=(data.matches||[]).find(node=>node.kind==='Moment'&&node.canonicalId===selected.canonicalId);if(!moment)return;const entityIds=new Set((data.edges||[]).filter(edge=>edge.type==='INVOLVES'&&(edge.from===moment.id||edge.to===moment.id)).map(edge=>edge.from===moment.id?edge.to:edge.from)),entities=(data.nodes||[]).filter(node=>node.kind==='Entity'&&entityIds.has(node.id)).map(node=>({id:node.id,entityId:graphEntityId(node),label:graphEntityLabel(node,locale),kind:typeof node.data?.entityKind==='string'?node.data.entityKind:'entity',truthStatus:node.truthStatus}));setMomentEntities(entities)},()=>{if(live)setMomentEntities([])});return()=>{live=!1}},[selected?.canonicalId,locale]),useEffect(()=>{if(!selected)return;document.body.classList.add("pl-lock");const onKey=event=>{event.key==="Escape"&&closeMoment()};return document.addEventListener("keydown",onKey),()=>{document.removeEventListener("keydown",onKey),document.body.classList.remove("pl-lock")}},[selected]);const submit=event=>{event.preventDefault(),setQuery(input.trim())},reset=()=>{setInput(""),setQuery(""),setLayer("ALL"),setMedia(""),setPlatform(""),setYear(""),setTopic(""),setSort("newest")},loadMore=()=>{!payload?.nextCursor||moreLoading||(setMoreLoading(!0),fetchPublicProjection(args(payload.nextCursor)).then(data=>{setPayload(data),setItems(previous=>{const seen=new Set(previous.map(item=>item.sourceUrl));return[...previous,...data.items.filter(item=>!seen.has(item.sourceUrl))]})}).finally(()=>setMoreLoading(!1)))},moveSelected=step=>{if(!selected||!items.length)return;const index=Math.max(0,items.findIndex(item=>item.id===selected.id));openMoment(items[(index+step+items.length)%items.length])},layers=["ALL","CANON","DISCOVERY","LIVE","LEGACY","PENDING"],facets=payload?.facets,collections=getArchiveCollections(locale),interfaceCopy=getArchiveInterfaceCopy(locale),selectCollection=value=>{setInput(value),setQuery(value),setLayer("ALL"),setMedia(""),setPlatform(""),setYear(""),setTopic(""),setSort("impact")};return<main className="public-library-page"dir={dir}>
      <header className="pl-hero">
        <div className="pl-shell">
          <a className="pl-back"href={pageHref("home",locale)}>
            <ArrowRight/>
            {locale==="he"?"\u05D7\u05D6\u05E8\u05D4 \u05DC\u05E1\u05D9\u05E4\u05D5\u05E8":locale==="ru"?"\u041D\u0430\u0437\u0430\u0434 \u043A \u0438\u0441\u0442\u043E\u0440\u0438\u0438":"Back to story"}
          </a>
          <p dir="ltr">{c.eyebrow}</p>
          {chapterQuery&&<div className="pl-chapter-context">
              <b>LIVING ARCHIVE · STORY FILTER</b>
              <span>“{chapterQuery}”</span>
              <a href={pageHref("home",locale)+"#story"}>
                {locale==="he"?"\u05D7\u05D6\u05E8\u05D4 \u05DC\u05E1\u05D9\u05E4\u05D5\u05E8":locale==="ru"?"\u041D\u0430\u0437\u0430\u0434 \u043A \u0438\u0441\u0442\u043E\u0440\u0438\u0438":"Back to story"}
              </a>
            </div>}
          <h1 dir="ltr">
            IGOR
            <br/>
            <em>LIFE ARCHIVE</em>
          </h1>
          <div className="pl-hero-grid">
            <p>{c.lead}</p>
            <div className="pl-stats"dir="ltr">
              <article>
                <b>{payload?.knownTotal??"\u2014"}</b>
                <span>{c.items}</span>
              </article>
              <article>
                <b>{payload?.streamCounts.canonicalSources??"\u2014"}</b>
                <span>CANON SOURCES</span>
              </article>
              <article>
                <b>{payload?.streamCounts.discovery??"\u2014"}</b>
                <span>DISCOVERY</span>
              </article>
              <article>
                <b>{payload?.streamCounts.worldDiscovery??"\u2014"}</b>
                <span>WORLD DISCOVERY</span>
              </article>
            </div>
          </div>
          {payload&&<div className="pl-runtime"dir="ltr">
              <span>
                <ShieldCheck/>
                PUBLIC PROJECTION
              </span>
              <b>CANON {payload.streamCounts.canonicalSources}</b>
              <b>DISCOVERY {payload.streamCounts.discovery}</b>
              <b>WORLD {payload.streamCounts.worldDiscovery}</b>
              <b>LIVE {payload.streamCounts.live}</b>
              <b>GRAPH {payload.streamCounts.graphObjects}</b>
              <b>SURFACES {payload.streamCounts.publicSurfaces}</b>
              <em>{payload.release}</em>
            </div>}
          {payload?.status==="partial"&&<div className="pl-partial">
              <ShieldCheck/>
              {c.partial}
            </div>}
        </div>
      </header>
      <section className="pl-controls">
        <div className="pl-shell">
          <section className="pl-human-discovery"aria-labelledby="pl-human-title">
            <header>
              <small>{interfaceCopy.eyebrow}</small>
              <h2 id="pl-human-title">{interfaceCopy.title}</h2>
              <p>{interfaceCopy.lead}</p>
            </header>
            <div className="pl-human-collections">
              {collections.map(collection=><button type="button"className={query===collection.query?"active":""}aria-pressed={query===collection.query}onClick={()=>selectCollection(collection.query)}key={collection.query}>
                  <small dir="ltr">{collection.eyebrow}</small>
                  <strong>{collection.label}</strong>
                </button>)}
            </div>
          </section>
          <form className="pl-search"onSubmit={submit}>
            <Search/>
            <input value={input}onChange={event=>setInput(event.target.value)}placeholder={c.search}/>
            {input&&<button type="button"onClick={()=>{setInput(""),setQuery("")}}>
                <X/>
              </button>}
          </form>
          <details className="pl-advanced">
            <summary>
              <SlidersHorizontal/>
              {interfaceCopy.advanced}
            </summary>
            <div>
              <div className="pl-layer-row">
                {layers.map(value=><button key={value}type="button"className={layer===value?"active":""}onClick={()=>setLayer(value)}>
                    <span>{layerText(value,locale,c)}</span>
                    <b>
                      {value==="ALL"?payload?.knownTotal||0:facetCount(facets?.layers,value)}
                    </b>
                  </button>)}
                <span className="pl-echo-label">
                  <Layers3/>
                  OPEN-ENDED ARCHIVE
                </span>
              </div>
              <div className="pl-refine">
                <label>
                  <span>{c.platform}</span>
                  <select value={platform}onChange={event=>setPlatform(event.target.value)}>
                    <option value="">{c.all}</option>
                    {facets?.platforms.map(([name,count])=><option value={name}key={name}>
                        {name} · {count}
                      </option>)}
                  </select>
                </label>
                <label>
                  <span>{c.year}</span>
                  <select value={year}onChange={event=>setYear(event.target.value)}>
                    <option value="">{c.all}</option>
                    {facets?.years.map(([name,count])=><option value={name}key={name}>
                        {name} · {count}
                      </option>)}
                  </select>
                </label>
                <label>
                  <span>{c.topic}</span>
                  <select value={topic}onChange={event=>setTopic(event.target.value)}>
                    <option value="">{c.all}</option>
                    {facets?.topics.map(([name,count])=><option value={name}key={name}>
                        {name} · {count}
                      </option>)}
                  </select>
                </label>
                <label>
                  <span>SORT</span>
                  <select value={sort}onChange={event=>setSort(event.target.value)}>
                    <option value="impact">
                      {locale==="he"?"\u05D4\u05E9\u05E4\u05E2\u05D4 \u2192 \u05EA\u05D7\u05D9\u05DC\u05D4":locale==="ru"?"\u0412\u043B\u0438\u044F\u043D\u0438\u0435 \u2192 \u0441\u043D\u0430\u0447\u0430\u043B\u0430":"Impact \u2192 first"}
                    </option>
                    <option value="newest">{c.newest}</option>
                    <option value="oldest">{c.oldest}</option>
                  </select>
                </label>
                <button className="pl-reset"type="button"onClick={reset}>
                  <SlidersHorizontal/>
                  {c.reset}
                </button>
              </div>
              <div className="pl-media-row">
                <button type="button"className={media?"":"active"}onClick={()=>setMedia("")}>
                  {c.all}
                </button>
                {facets?.mediaTypes.map(([name,count])=><button type="button"className={media===name?"active":""}onClick={()=>setMedia(name)}key={name}>
                    {typeCopy[name]?.[locale]||name}
                    <b>{count}</b>
                  </button>)}
              </div>
            </div>
          </details>
        </div>
      </section>
      <section className="pl-wall-section">
        <div className="pl-shell">
          <header className="pl-wall-head">
            <div>
              <span>{c.showing}</span>
              <b>
                {items.length} / {payload?.filteredTotal??0}
              </b>
            </div>
            <small dir="ltr">SOURCE MEDIA → OG PREVIEW → LIVE SOURCE SCREENSHOT → POSTER</small>
          </header>
          {state==="loading"?<div className="pl-state">PROJECTING PUBLIC OBJECTS…</div>:state==="failed"?<div className="pl-state danger">PUBLIC PROJECTION FAILED · RETRY</div>:items.length===0?<div className="pl-state">{c.empty}</div>:<div className="pl-wall">
              {items.map((item,index)=><button type="button"className={"pl-card "+(index%13===0||item.mediaType==="video"&&index%7===0?"wide":"")}onClick={()=>openMoment(item)}key={item.id}data-layer={item.layer}>
                  <LibraryVisual item={item}/>
                  <div className="pl-card-top">
                    <span className={"pl-layer layer-"+item.layer.toLowerCase()}>
                      {layerText(item.layer,locale,c)}
                    </span>
                    <time dir="ltr">{item.year||"\u2014"}</time>
                  </div>
                  <div className="pl-card-copy">
                    <small dir="ltr">
                      {(typeCopy[item.mediaType]?.[locale]||item.mediaType).toUpperCase()} ·{" "}
                      {cleanPlatform(item.platform)}
                    </small>
                    <h2>{item.title[locale]}</h2>
                    <p>{item.publisher}</p>
                    {item.relationships.length>0&&<div className="pl-card-rel"dir="ltr">
                        {item.relationships.slice(0,3).map(value=><span key={value}>{value}</span>)}
                      </div>}
                    <footer>
                      <span>
                        {locale==="he"?"\u05E6\u05E4\u05D9\u05D9\u05D4":locale==="ru"?"\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C":"View"}
                      </span>
                      <ExternalLink/>
                    </footer>
                  </div>
                </button>)}
            </div>}
          {payload?.nextCursor&&<button type="button"className="pl-more"disabled={moreLoading}onClick={loadMore}>
              {moreLoading?"\u2026":c.more+" \xB7 "+Math.max(0,payload.filteredTotal-items.length)}
            </button>}
        </div>
      </section>
      {selected&&<div className="pl-overlay"role="dialog"aria-modal="true"aria-label={selected.title[locale]}onMouseDown={event=>{event.target===event.currentTarget&&closeMoment()}}>
          <article className="pl-detail">
            <button className="pl-close"type="button"onClick={closeMoment}>
              <X/>
              {locale==="he"?"\u05E1\u05D2\u05D9\u05E8\u05D4":locale==="ru"?"\u0417\u0430\u043A\u0440\u044B\u0442\u044C":"Close"}
            </button>
            <div className="pl-detail-media">
              {youtubeId(selected.sourceUrl)?<div className="pl-video">
                  <iframe src={"https://www.youtube-nocookie.com/embed/"+youtubeId(selected.sourceUrl)}title={selected.title[locale]}allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"allowFullScreen/>
                </div>:<LibraryVisual item={selected}/>}
            </div>
            <div className="pl-detail-copy">
              <header>
                <div>
                  <span className={"pl-layer layer-"+selected.layer.toLowerCase()}>
                    {layerText(selected.layer,locale,c)}
                  </span>
                  <time dir="ltr">{selected.year||"\u2014"}</time>
                </div>
                <div className="pl-viewer-commands"dir="ltr">
                  <button type="button"onClick={()=>moveSelected(-1)}>
                    ← PREV
                  </button>
                  <button type="button"onClick={()=>moveSelected(1)}>
                    NEXT →
                  </button>
                </div>
              </header>
              <small dir="ltr">MOMENT VIEW · SOURCE-LINKED · {(typeCopy[selected.mediaType]?.[locale]||selected.mediaType).toUpperCase()} · {cleanPlatform(selected.platform)}</small>
              <h2>{selected.title[locale]}</h2>
              <p>{selected.summary[locale]}</p>
              <dl>
                <div>
                  <dt>LAYER</dt>
                  <dd>{selected.layer}</dd>
                </div>
                <div>
                  <dt>TRUST</dt>
                  <dd>{selected.trust||"\u2014"}</dd>
                </div>
                <div>
                  <dt>EVIDENCE</dt>
                  <dd>{selected.evidenceGrade||"\u2014"}</dd>
                </div>
              </dl>
              <MomentGraph item={selected} locale={locale} entities={momentEntities}/>
              {selected.metrics.length>0&&<div className="pl-detail-block"><h3>DATED METRICS</h3><div className="pl-metrics">{selected.metrics.slice(0,9).map(metric=><div key={metric.label+metric.value+metric.date}><b dir="ltr">{metric.value}{metric.unit?' '+metric.unit:''}</b><span>{metric.label}</span><small dir="ltr">{metric.date}{metric.scope?' · '+metric.scope:''}</small></div>)}</div></div>}
              <div className="pl-viewer-actions">
                <a className="pl-source"href={selected.sourceUrl}target="_blank"rel="noreferrer">
                  {c.source}
                  <ExternalLink/>
                </a>
                <a className="pl-permalink"href={momentHref(selected)}>{locale==="he"?"קישור קבוע לרגע":locale==="ru"?"Постоянная ссылка на момент":"Moment permalink"}<ExternalLink/></a>
                <a className="pl-talk-source"href={appendQuery(pageHref("home",locale),"chat=open&journeyChapter=archive&journeyChoice="+encodeURIComponent(selected.title[locale]))}>
                  {locale==="he"?"לשאול את Bro Chat על הרגע הזה":locale==="ru"?"Спросить Bro Chat об этом моменте":"Ask Bro Chat about this moment"}
                </a>
              </div>
            </div>
          </article>
        </div>}
    </main>}export{PublicLibraryPage as default};
