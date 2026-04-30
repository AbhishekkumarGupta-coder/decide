import { soloAgent } from './soloAgent';
import { groupAgent } from './groupAgent';
import { budgetAgent } from './budgetAgent';
import { reorderAgent } from './reorderAgent';
import { comboAgent } from './comboAgent';
import { regretAgent } from './regretAgent';
import { instantAgent } from './instantAgent';

// Central agent registry — add new agents here
export const agents = [
  soloAgent,
  groupAgent,
  budgetAgent,
  reorderAgent,
  comboAgent,
  regretAgent,
  instantAgent,
];

export const getAgent = (id) => agents.find((a) => a.id === id);

export default agents;
