import { db } from '@appdeploy/sdk';
type Counter={value:number;updatedAt:number};
const TABLE='global_visits';
export async function getVisitCount(){const {items}=await db.list<Counter>(TABLE,{limit:1});return items[0]?.value??0;}
export async function incrementVisitCount(){const {items}=await db.list<Counter>(TABLE,{limit:1});if(items.length===0){const [id]=await db.add(TABLE,[{value:1,updatedAt:Date.now()}]);if(!id)throw new Error('Failed to create counter');return 1;}const current=items[0];const value=(current.value??0)+1;const [ok]=await db.update(TABLE,[{id:current.id,record:{value,updatedAt:Date.now()}}]);if(!ok)throw new Error('Failed to update counter');return value;}
