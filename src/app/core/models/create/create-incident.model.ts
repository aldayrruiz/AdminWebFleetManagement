import { IncidentType } from '..';

export interface CreateIncident {
  id?: string;
  title: string;
  date_stored?: string;
  description: string;
  type: IncidentType;
  owner?: string;
  reservation: string;
  solved: true;
}
