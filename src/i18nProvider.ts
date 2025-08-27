import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';
import {resolveBrowserLocale} from "ra-core";

const translations = {en, fr};
en.resources = {
    projects: {
        fields: {
            p_acronym: 'Acronym',
            p_description: 'Description',
            p_keywords: 'Keyword(s)',
            p_name: 'Name',
            p_title: 'Title',
            p_website: 'Website',
        }
    },
    datasets: {
        fields: {
            d_domain: 'Domain',
            d_name: "Dataset Name",
            d_status: 'Status',
            d_countries: 'Countries',
            dh_disease_status: 'Disease Status',
            d_provenance: 'Provenance',
            du_permission: 'Data Use Conditions',
            d_subjects: 'Sample Size',
            d_provider: 'Project',
            redcap_data_access_group: 'Project'
        }
    }
};

export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale],
    resolveBrowserLocale('en'),
    [
        {locale: 'en', name: 'English'}
    ],
    {
        allowMissing: false,
    }
);
