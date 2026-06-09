import ReactGA from "react-ga4";

/** GA4 event when user clicks "Get" under Access Pathway on the datasets table */
export const EVENT_ACCESS_PATHWAY_GET = "access_pathway_get";

export type AccessPathwayGetPayload = {
    dataset_id: string;
    dataset_name: string;
    project_acronym: string;
};

export function trackAccessPathwayGet(payload: AccessPathwayGetPayload): void {
    ReactGA.event(EVENT_ACCESS_PATHWAY_GET, {
        dataset_id: payload.dataset_id,
        dataset_name: payload.dataset_name,
        project_acronym: payload.project_acronym,
    });
}
