export type LocalText={he:string;en:string;ru:string};
export type TruthStatus='VERIFIED'|'STRONGLY_INFERRED'|'REQUIRES_CONFIRMATION';
export type ContentNodeKind=
  |'Person'|'Moment'|'Post'|'Video'|'Image'|'Article'|'Interview'|'Project'|'Organization'|'Role'|'Event'|'Place'|'Idea'|'Research'|'Quote'|'Achievement'|'Campaign'|'MediaMention'|'AudienceReaction'|'Metric'|'Product'
  |'Source';
export type ContentEdgeType=
  |'CREATED'|'FEATURED_IN'|'LED'|'WORKED_WITH'|'HAPPENED_AT'|'RESPONDED_TO'|'INSPIRED'|'MENTIONS'|'PROVES'|'CONTRADICTS'|'RELATED_TO'|'PART_OF'|'WENT_VIRAL_ON'|'REUSED_AS'
  |'SUPPORTED_BY'|'HAS_MEDIA'|'HAS_METRIC';
export type PublicationStatus='published'|'known-unpublished';

export type ContentNode={
  id:string;
  kind:ContentNodeKind;
  title:LocalText;
  date?:string;
  truthStatus:TruthStatus;
  topics:string[];
  platforms:string[];
  sourceUrls:string[];
  publicationStatus:PublicationStatus;
  data:Record<string,unknown>;
};

export type ContentEdge={
  id:string;
  type:ContentEdgeType;
  from:string;
  to:string;
  truthStatus:TruthStatus;
  sourceUrls:string[];
  data:Record<string,unknown>;
};

export type ContentGraph={
  schemaVersion:3;
  sourceSchemaVersion:2;
  nodes:ContentNode[];
  edges:ContentEdge[];
  stats:{primaryNodes:number;nodes:number;edges:number};
};
